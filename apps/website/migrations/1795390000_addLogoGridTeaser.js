'use strict';

/**
 * Block «Logos»: optionally only the first logos and a link below, so a page can show a few partners and link to the
 * page with all of them.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const block = await client.itemTypes.find('logo_grid');
  const link = await client.itemTypes.find('link');
  await client.fields.create(block.id, {
    api_key: 'limit',
    label: 'Anzahl Logos',
    field_type: 'integer',
    hint: 'Optional, z. B. 12. Dann erscheinen nur die ersten Logos, gut zusammen mit einem Link zur Seite mit allen.',
    validators: { number_range: { min: 1 } },
  });
  await client.fields.create(block.id, {
    api_key: 'link',
    label: 'Link darunter',
    field_type: 'single_block',
    hint: 'Optional, z. B. «Alle Partner ansehen».',
    validators: { single_block_blocks: { item_types: [link.id] } },
    appearance: { editor: 'framed_single_block', parameters: { start_collapsed: false }, addons: [] },
  });
};
