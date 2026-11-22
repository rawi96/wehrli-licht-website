'use strict';

/**
 * Page slugs only need to be unique below the same parent (the website resolves pages by their full path), so
 * /lampenschirme/leistungen and /licht-planen/leistungen can both exist. Removes the global unique validator.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const slug = (await client.fields.list('page')).find((field) => field.api_key === 'slug');
  // eslint-disable-next-line no-unused-vars
  const { unique, ...validators } = slug.validators;

  await client.fields.update(slug.id, {
    validators,
    hint: 'Muss nur unter derselben Elternseite eindeutig sein.',
  });
};
