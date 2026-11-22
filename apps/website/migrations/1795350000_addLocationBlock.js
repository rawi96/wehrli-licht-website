'use strict';

/**
 * Block «Adresse & Öffnungszeiten»: address, phone, e-mail, opening hours and holiday notice from «Kopf- & Fusszeile»,
 * with an optional map. Replaces copies of the opening hours in page texts, so they are changed in one place only.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SCREENSHOTS = require('./editor-screenshots.json');

module.exports = async (client) => {
  const hint =
    'Zeigt Adresse, Telefon, E-Mail und Öffnungszeiten, optional mit Karte. Die Angaben kommen aus «Kopf- & Fusszeile»: dort ändern, dann stimmt es überall.';
  const block = await client.itemTypes.create({
    name: '📍 Adresse & Öffnungszeiten',
    api_key: 'location',
    modular_block: true,
    hint: SCREENSHOTS.location ? `${SCREENSHOTS.location} ${hint}` : hint,
  });
  await client.fields.create(block.id, {
    api_key: 'title',
    label: 'Überschrift',
    field_type: 'string',
    hint: 'Leer: «Öffnungszeiten & Anfahrt».',
  });
  await client.fields.create(block.id, {
    api_key: 'map_url',
    label: 'Karte (Google-Maps-Link zum Einbetten)',
    field_type: 'string',
    hint: 'In Google Maps: «Teilen» → «Karte einbetten» → nur die Adresse aus src="…" kopieren. Leer: keine Karte.',
  });
  await client.fields.create(block.id, {
    api_key: 'anchor_id',
    label: 'Sprungmarke (Anker)',
    field_type: 'string',
    hint: 'Optional, z. B. «anfahrt». Dann führt /seite#anfahrt direkt zu diesem Block.',
  });

  const pageContent = (await client.fields.list('page')).find((field) => field.api_key === 'content');
  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: { item_types: [...pageContent.validators.rich_text_blocks.item_types, block.id] },
    },
  });
};
