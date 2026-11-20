import { CONTENT_REVALIDATE_SECONDS } from '@/constants/cache-revalidation';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

type Variables = {
  slug?: string;
  categoryId?: string;
  ids?: string[] | string;
  categories?: string[] | string;
  objectTypes?: string[] | string;
  skip?: number;
};

type QueryDatoCmsOptions<TResult> = {
  document: TypedDocumentNode<TResult, Variables>;
  variables?: Variables;
  includeDrafts?: boolean;
};

const MAX_CONCURRENT_REQUESTS = 4;
const MAX_RETRIES = 6;
const INITIAL_RETRY_MS = 750;

let inFlight = 0;
const waitQueue: (() => void)[] = [];

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const acquireSlot = (): Promise<void> => {
  if (inFlight < MAX_CONCURRENT_REQUESTS) {
    inFlight += 1;

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    waitQueue.push(() => {
      inFlight += 1;
      resolve();
    });
  });
};

const releaseSlot = (): void => {
  inFlight -= 1;
  const next = waitQueue.shift();

  if (next) {
    next();
  }
};

const retryDelayMs = (response: Response, attempt: number): number => {
  const retryAfterHeader = response.headers.get('Retry-After');
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : Number.NaN;

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return Math.min(INITIAL_RETRY_MS * 2 ** attempt, 15_000);
};

const fetchDatoCMS = async (body: string, headers: Record<string, string>, includeDrafts: boolean): Promise<Response> => {
  await acquireSlot();

  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      const response = await fetch('https://graphql.datocms.com/', {
        next: { revalidate: includeDrafts ? 0 : CONTENT_REVALIDATE_SECONDS },
        method: 'POST',
        headers,
        body,
      });

      if (response.status === 429) {
        if (attempt === MAX_RETRIES) {
          throw new Error('DatoCMS request failed: Too Many Requests');
        }

        await sleep(retryDelayMs(response, attempt));

        continue;
      }

      if (!response.ok) {
        throw new Error(`DatoCMS request failed: ${response.statusText}`);
      }

      return response;
    }

    throw new Error('DatoCMS request failed: Too Many Requests');
  } finally {
    releaseSlot();
  }
};

export const queryDatoCMS = async <TResult = unknown>({
  document,
  variables,
  includeDrafts,
}: QueryDatoCmsOptions<TResult>): Promise<TResult> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
  };

  if (includeDrafts) {
    headers['X-Include-Drafts'] = 'true';
  }

  if (process.env.NEXT_DATOCMS_ENVIRONMENT) {
    headers['X-Environment'] = process.env.NEXT_DATOCMS_ENVIRONMENT;
  }

  const body = JSON.stringify({ query: print(document), variables });
  const response = await fetchDatoCMS(body, headers, Boolean(includeDrafts));
  const { data } = (await response.json()) as { data: TResult };

  return data;
};
