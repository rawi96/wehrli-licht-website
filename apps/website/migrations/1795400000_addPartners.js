'use strict';

/**
 * Partners as their own model (name, logo, place, a short text, website) and the block «Partner mit Beschreibung»,
 * which shows them as cards: more than a cloud of logos, and one place to maintain each partner.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SINGLE_LINE = { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] };

module.exports = async (client) => {
  const pageModel = await client.itemTypes.find('page');

  const partner = await client.itemTypes.create({
    name: '🤝 Partner',
    api_key: 'partner',
    sortable: true,
    hint: 'Ein Hersteller, mit dem wir zusammenarbeiten. Erscheint im Block «Partner mit Beschreibung».',
  });
  const name = await client.fields.create(partner.id, {
    api_key: 'name',
    label: 'Name',
    field_type: 'string',
    validators: { required: {} },
    appearance: SINGLE_LINE,
  });
  await client.fields.create(partner.id, {
    api_key: 'logo',
    label: 'Logo',
    field_type: 'file',
    validators: { required: {}, extension: { predefined_list: 'image' } },
    hint: 'Am besten quer und mit hellem oder transparentem Hintergrund.',
  });
  await client.fields.create(partner.id, {
    api_key: 'place',
    label: 'Ort und Land',
    field_type: 'string',
    hint: 'Z. B. «Flawil, Schweiz».',
    appearance: SINGLE_LINE,
  });
  await client.fields.create(partner.id, {
    api_key: 'description',
    label: 'Kurzbeschreibung',
    field_type: 'text',
    hint: 'Ein, zwei Sätze: wofür die Marke steht.',
    validators: { length: { max: 280 } },
    appearance: { editor: 'textarea', parameters: { placeholder: null }, addons: [] },
  });
  await client.fields.create(partner.id, {
    api_key: 'website',
    label: 'Website',
    field_type: 'string',
    hint: 'Ganze Adresse mit https://',
    validators: { format: { predefined_pattern: 'url' } },
    appearance: SINGLE_LINE,
  });
  await client.itemTypes.update(partner.id, { title_field: { id: name.id, type: 'field' } });

  const block = await client.itemTypes.create({
    name: '🤝 Partner mit Beschreibung',
    api_key: 'partners_block',
    modular_block: true,
    hint: 'Partner als Karten mit Logo, Ort, Kurztext und Link zur Website. Die Partner selbst pflegen Sie unter «Partner».',
  });
  await client.fields.create(block.id, { api_key: 'title', label: 'Überschrift', field_type: 'string', hint: 'Optional.', appearance: SINGLE_LINE });
  await client.fields.create(block.id, {
    api_key: 'intro',
    label: 'Einleitung',
    field_type: 'text',
    hint: 'Optional.',
    appearance: { editor: 'textarea', parameters: { placeholder: null }, addons: [] },
  });
  await client.fields.create(block.id, {
    api_key: 'partners',
    label: 'Partner',
    field_type: 'links',
    hint: 'In der gewünschten Reihenfolge.',
    validators: { items_item_type: { item_types: [partner.id] }, size: { min: 1 } },
    appearance: { editor: 'links_select', parameters: {}, addons: [] },
  });
  await client.fields.create(block.id, {
    api_key: 'anchor_id',
    label: 'Sprungmarke (Anker)',
    field_type: 'string',
    hint: 'Optional. Kurzes Wort ohne Leerzeichen.',
    appearance: SINGLE_LINE,
  });
  await client.fields.create(block.id, { api_key: 'disable_margin_top', label: 'Kein Abstand oben', field_type: 'boolean' });
  await client.fields.create(block.id, { api_key: 'disable_margin_bottom', label: 'Kein Abstand unten', field_type: 'boolean' });

  const pageContent = (await client.fields.list(pageModel.id)).find((field) => field.api_key === 'content');
  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: { item_types: [...pageContent.validators.rich_text_blocks.item_types, block.id] },
    },
  });
};
