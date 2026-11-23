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
      // Like the site's own client: without a configured environment, the primary one (whatever its name).
      ...(process.env.NEXT_DATOCMS_ENVIRONMENT ? { 'X-Environment': process.env.NEXT_DATOCMS_ENVIRONMENT } : {}),
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

/** Next.js matches redirect sources case-insensitively and without a trailing slash. */
const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path).toLowerCase();
/** The path without an anchor: the destination may jump to one (e.g. /kontakt#termin), which browsers never send. */
const withoutAnchor = (path) => path.replace(/#[\w-]+$/, '');

/** Whether Next.js can use the redirect: plain paths, «/:path*» only at the end of both, and not onto itself. */
const isUsable = ({ source, destination }) => {
  const target = withoutAnchor(destination);
  const wildcard = source.endsWith(WILDCARD);
  const from = wildcard ? source.slice(0, -WILDCARD.length) || '/' : source;
  const to = target.endsWith(WILDCARD) ? target.slice(0, -WILDCARD.length) || '/' : target;

  if (!PLAIN_PATH.test(from) || !PLAIN_PATH.test(to)) {
    return false;
  }
  if (target.endsWith(WILDCARD) && !wildcard) {
    return false;
  }
  if (!wildcard) {
    // «/Kontakt» → «/kontakt» or «/kontakt» → «/kontakt#termin» would redirect forever.
    return normalize(from) !== normalize(to);
  }

  // «/alt/:path*» → «/alt/neu/:path*» (or anything below «/:path*») would redirect forever.
  const prefix = normalize(from);

  return !`${normalize(to)}/`.startsWith(prefix === '/' ? '/' : `${prefix}/`);
};

/**
 * Plain redirects that end up where they started across several records (e.g. /a → /b and later /b → /a), also with
 * the site's own redirects (e.g. «/» → «/home» with /home → /).
 */
const findCycles = (redirects, fixed) => {
  const next = new Map(
    [...fixed, ...redirects]
      .filter(({ source }) => !source.endsWith(WILDCARD))
      .map(({ source, destination }) => [normalize(source), normalize(withoutAnchor(destination))]),
  );

  return redirects.filter(({ source }) => {
    const start = normalize(source);
    let current = next.get(start);
    for (let step = 0; current !== undefined && step <= next.size; step += 1) {
      if (current === start) {
        return true;
      }
      current = next.get(current);
    }

    return false;
  });
};

/**
 * @param fixed {{ source: string; destination: string }[]} the site's own redirects, to rule out loops with them
 * @returns {Promise<import('next/dist/lib/load-custom-routes').Redirect[]>}
 */
const getCmsRedirects = async (fixed = []) => {
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
    const usable = candidates.filter(isUsable);
    const loops = findCycles(usable, fixed);
    const accepted = usable.filter((redirect) => !loops.includes(redirect));
    const skipped = candidates.filter((redirect) => !accepted.includes(redirect));
    if (skipped.length > 0) {
      console.warn('[redirects] Skipped DatoCMS redirects Next.js cannot use or that loop:', skipped);
    }

    return accepted.map((redirect) => ({ ...redirect, permanent: true }));
  } catch (error) {
    console.warn('[redirects] DatoCMS redirects could not be loaded, deploying without them:', error);

    return [];
  }
};

module.exports = { getCmsRedirects };
