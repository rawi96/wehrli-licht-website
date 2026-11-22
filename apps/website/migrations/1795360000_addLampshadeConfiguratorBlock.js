'use strict';

/**
 * Block «Lampenschirm-Konfigurator»: the 3D configurator in which visitors design a lampshade (form, size, material,
 * colour, lining, trim, lamp, room) and send it as an inquiry. Forms and materials come from the atelier's offer.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SCREENSHOTS = require('./editor-screenshots.json');

module.exports = async (client) => {
  const hint =
    'Der 3D-Konfigurator für Lampenschirme. Am besten allein auf einer Seite, mit einem kurzen Text darüber. Die Anfrage landet im Kontaktformular der Kontaktseite (aus «Kopf- & Fusszeile»).';
  const block = await client.itemTypes.create({
    name: '🎨 Lampenschirm-Konfigurator',
    api_key: 'lampshade_configurator',
    modular_block: true,
    hint: SCREENSHOTS.lampshade_configurator ? `${SCREENSHOTS.lampshade_configurator} ${hint}` : hint,
  });
  await client.fields.create(block.id, {
    api_key: 'anchor_id',
    label: 'Sprungmarke (Anker)',
    field_type: 'string',
    hint: 'Optional, z. B. «konfigurator». Dann führt /seite#konfigurator direkt zum Konfigurator.',
  });

  const pageContent = (await client.fields.list('page')).find((field) => field.api_key === 'content');
  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: { item_types: [...pageContent.validators.rich_text_blocks.item_types, block.id] },
    },
  });
};
