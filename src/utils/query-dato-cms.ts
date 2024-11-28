import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

type Variables = {
  slug?: string;
  categories?: string[] | string;
  objectTypes?: string[] | string;
  skip?: number;
};

type Options<TResult = unknown> = {
  document: TypedDocumentNode<TResult, Variables>;
  variables?: Variables;
  includeDrafts?: boolean;
};

export async function queryDatoCMS<TResult = unknown>({
  document,
  variables,
  includeDrafts,
}: Options<TResult>): Promise<TResult> {
  const headers = {
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

  const response = await fetch('https://graphql.datocms.com/', {
    next: { revalidate: includeDrafts ? 0 : 60 },
    method: 'POST',
    headers,
    body: JSON.stringify({ query: print(document), variables }),
  });

  if (!response.ok) {
    throw new Error(`DatoCMS request failed: ${response.statusText}`);
  }

  const { data } = (await response.json()) as { data: TResult };

  return data;
}
