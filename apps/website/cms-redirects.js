/**
 * Permanent redirects maintained in DatoCMS («Weiterleitung»), read at build time by next.config.js.
 * Neither a failing request nor an unusable record fails the build: they are left out with a warning.
 */
const QUERY = `query CmsRedirects($skip: IntType) {
  allRedirects(first: 100, skip: $skip) { source destination }
}`;

const fetchPage = async (skip) => {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Environment': process.env.NEXT_DATOCMS_ENVIRONMENT ?? 'main',
      'X-Exclude-Invalid': 'true',
    },
    body: JSON.stringify({ query: QUERY, variables: { skip } }),
  });
  const { data, errors } = await response.json();

  if (!response.ok || errors) {
    throw new Error(JSON.stringify(errors ?? response.status));
  }

  return data.allRedirects;
};

const WILDCARD = '/:path*';
/** A plain path: Next.js parses redirect paths as patterns and stops the build on an invalid one (e.g. «?» or «+»). */
const PLAIN_PATH = /^\/[A-Za-z0-9._~%/-]*$/;

/** Whether Next.js can use the redirect: plain paths, «/:path*» only at the end of both, and no loop. */
const isUsable = ({ source, destination }) => {
  // The destination may jump to an anchor (e.g. /kontakt#termin).
  const target = destination.replace(/#[\w-]+$/, '');
  const wildcard = source.endsWith(WILDCARD);
  const from = wildcard ? source.slice(0, -WILDCARD.length) || '/' : source;
  const to = target.endsWith(WILDCARD) ? target.slice(0, -WILDCARD.length) || '/' : target;

  if (!PLAIN_PATH.test(from) || !PLAIN_PATH.test(to) || source === destination) {
    return false;
  }
  if (target.endsWith(WILDCARD) && !wildcard) {
    return false;
  }

  // «/alt/:path*» → «/alt/neu/:path*» (or anything below «/:path*») would redirect forever.
  return !(wildcard && `${to}/`.startsWith(from === '/' ? '/' : `${from}/`));
};

/** @returns {Promise<import('next/dist/lib/load-custom-routes').Redirect[]>} */
const getCmsRedirects = async () => {
  if (!process.env.NEXT_DATOCMS_API_TOKEN) {
    return [];
  }

  try {
    const redirects = [];
    for (let skip = 0; ; skip += 100) {
      const page = await fetchPage(skip);
      redirects.push(...page);
      if (page.length < 100) {
        break;
      }
    }

    const candidates = redirects
      .filter(({ source, destination }) => source && destination)
      .map(({ source, destination }) => ({ source: source.trim(), destination: destination.trim() }));
    const skipped = candidates.filter((redirect) => !isUsable(redirect));
    if (skipped.length > 0) {
      console.warn('[redirects] Skipped DatoCMS redirects Next.js cannot use:', skipped);
    }

    return candidates.filter(isUsable).map((redirect) => ({ ...redirect, permanent: true }));
  } catch (error) {
    console.warn('[redirects] DatoCMS redirects could not be loaded, deploying without them:', error);

    return [];
  }
};

module.exports = { getCmsRedirects };
