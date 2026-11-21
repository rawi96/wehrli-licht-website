/**
 * Permanent redirects maintained in DatoCMS («Weiterleitung»), read at build time by next.config.js.
 * A failing request does not fail the build: the site then deploys without the CMS redirects and logs a warning.
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

    return redirects
      .filter(({ source, destination }) => source && destination && source !== destination)
      .map(({ source, destination }) => ({ source: source.trim(), destination: destination.trim(), permanent: true }));
  } catch (error) {
    console.warn('[redirects] DatoCMS redirects could not be loaded, deploying without them:', error);

    return [];
  }
};

module.exports = { getCmsRedirects };
