'use strict';

/**
 * Adds the "✉️ Kontaktformular" block and allows it in the page content field.
 * Additive only: no existing model, field or record is changed or removed.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const contactFormBlock = await client.itemTypes.create({
    name: '✉️ Kontaktformular',
    api_key: 'contact_form',
    modular_block: true,
    hint: 'Kontaktformular mit Spamschutz. Anfragen werden per E-Mail an Wehrli Licht gesendet.',
  });

  await client.fields.create(contactFormBlock, {
    label: 'Titel',
    api_key: 'title',
    field_type: 'string',
    appearance: { editor: 'single_line', parameters: { heading: true }, addons: [] },
  });

  await client.fields.create(contactFormBlock, {
    label: 'Einleitungstext',
    api_key: 'intro',
    field_type: 'text',
    appearance: { editor: 'textarea', parameters: {}, addons: [] },
  });

  await client.fields.create(contactFormBlock, {
    label: 'Abstand oben aus',
    api_key: 'disable_margin_top',
    field_type: 'boolean',
    appearance: { editor: 'boolean', parameters: {}, addons: [] },
  });

  await client.fields.create(contactFormBlock, {
    label: 'Abstand unten aus',
    api_key: 'disable_margin_bottom',
    field_type: 'boolean',
    appearance: { editor: 'boolean', parameters: {}, addons: [] },
  });

  const contentField = await client.fields.find('page::content');
  const allowedBlocks = contentField.validators.rich_text_blocks.item_types;

  await client.fields.update(contentField.id, {
    validators: {
      ...contentField.validators,
      rich_text_blocks: { item_types: [...allowedBlocks, contactFormBlock.id] },
    },
  });
};
