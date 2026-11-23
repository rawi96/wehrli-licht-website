'use strict';

/**
 * Block «Konfigurator-Teaser»: the invitation to the 3D configurator with a link to its page, e.g. on the home page.
 * The configurator itself only loads on that page.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SINGLE_LINE = { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] };
const TEXTAREA = { editor: 'textarea', parameters: { placeholder: null }, addons: [] };

module.exports = async (client) => {
  const link = await client.itemTypes.find('link');
  const pageModel = await client.itemTypes.find('page');
  const block = await client.itemTypes.create({
    name: '🎨 Konfigurator-Teaser',
    api_key: 'configurator_teaser',
    modular_block: true,
    hint: 'Die Einladung zum 3D-Konfigurator mit leuchtender Lampe und Knopf zur Konfigurator-Seite. Der Konfigurator lädt erst dort.',
  });
  const fields = [
    { api_key: 'eyebrow', label: 'Kleine Überschrift', field_type: 'string', appearance: SINGLE_LINE, default_value: 'Lampenschirm-Konfigurator' },
    { api_key: 'title', label: 'Titel', field_type: 'string', appearance: SINGLE_LINE, validators: { required: {} } },
    { api_key: 'text', label: 'Text', field_type: 'text', appearance: TEXTAREA },
    { api_key: 'points', label: 'Punkte mit Häkchen', field_type: 'text', appearance: TEXTAREA, hint: 'Eine Zeile pro Punkt.' },
    {
      api_key: 'link',
      label: 'Knopf',
      field_type: 'single_block',
      hint: 'Link zur Seite mit dem Konfigurator.',
      validators: { single_block_blocks: { item_types: [link.id] }, required: {} },
      appearance: { editor: 'framed_single_block', parameters: { start_collapsed: false }, addons: [] },
    },
    { api_key: 'note', label: 'Hinweis neben dem Knopf', field_type: 'string', appearance: SINGLE_LINE },
  ];
  for (const field of fields) {
    await client.fields.create(block.id, field);
  }
  const pageContent = (await client.fields.list(pageModel.id)).find((field) => field.api_key === 'content');
  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: { item_types: [...pageContent.validators.rich_text_blocks.item_types, block.id] },
    },
  });
};
