'use strict';

/**
 * One tile block everywhere: the shop's service cards (block «Service») become «Kacheln mit Symbol», like on every
 * other page. Adds the symbols the service cards used (payment, viewing) and a few for contact tiles, converts the
 * existing service sections and removes the old block types.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const NEW_ICONS = [
  ['zahlung', 'Kreditkarte'],
  ['ansehen', 'Auge'],
  ['telefon', 'Telefon'],
  ['mail', 'E-Mail'],
  ['kalender', 'Kalender'],
];

const SERVICE_ICONS = { shipping: 'lieferung', pickup: 'laden', payment: 'zahlung', viewing: 'ansehen', showroom: 'funkeln' };

const plain = (node) => {
  if (!node) return '';
  if (node.document) return plain(node.document);
  if (node.type === 'span') return node.value;
  const inner = (node.children ?? []).map(plain).join('');
  return node.type === 'paragraph' ? `${inner}\n` : inner;
};

module.exports = async (client) => {
  const types = Object.fromEntries((await client.itemTypes.list()).map((t) => [t.api_key, t]));
  const typeKey = Object.fromEntries(Object.values(types).map((t) => [t.id, t.api_key]));

  // 1. Symbols.
  const icon = (await client.fields.list(types.card_item.id)).find((field) => field.api_key === 'icon');
  const values = [...icon.validators.enum.values, ...NEW_ICONS.map(([value]) => value)];
  await client.fields.update(icon.id, {
    validators: { ...icon.validators, enum: { values } },
    appearance: {
      ...icon.appearance,
      parameters: {
        options: [...icon.appearance.parameters.options, ...NEW_ICONS.map(([value, label]) => ({ hint: '', label, value }))],
      },
    },
  });

  // 2. The shop page may use the tile block.
  const sections = (await client.fields.list(types.shop_page.id)).find((field) => field.api_key === 'sections');
  await client.fields.update(sections.id, {
    validators: {
      ...sections.validators,
      rich_text_blocks: { item_types: [...sections.validators.rich_text_blocks.item_types, types.cards_block.id] },
    },
  });

  // 3. Convert the service sections.
  const block = (apiKey, attributes) => ({
    type: 'item',
    attributes,
    relationships: { item_type: { data: { type: 'item_type', id: types[apiKey].id } } },
  });
  const copyLink = (link) => (link ? block('link', { ...link.attributes }) : null);
  for await (const page of client.items.listPagedIterator({ filter: { type: 'shop_page' }, nested: true, version: 'current' })) {
    if (!(page.sections ?? []).some((section) => typeKey[section.relationships.item_type.data.id] === 'shop_service_section')) {
      continue;
    }
    const published = page.meta.status === 'published';
    await client.items.update(page.id, {
      sections: page.sections.map((section) => {
        if (typeKey[section.relationships.item_type.data.id] !== 'shop_service_section') return section.id;
        const s = section.attributes;
        return block('cards_block', {
          title: s.title,
          intro: plain(s.description).trim() || null,
          items: (s.items ?? []).map((item) =>
            block('card_item', {
              icon: SERVICE_ICONS[item.attributes.icon] ?? null,
              title: item.attributes.title,
              text: item.attributes.description ?? null,
              link: copyLink(item.attributes.link),
            }),
          ),
          anchor_id: null,
          disable_margin_top: false,
          disable_margin_bottom: false,
        });
      }),
    });
    if (published) await client.items.publish(page.id);
  }

  // 4. The old block types are gone from the shop page and deleted.
  await client.fields.update(sections.id, {
    validators: {
      ...sections.validators,
      rich_text_blocks: {
        item_types: [...sections.validators.rich_text_blocks.item_types, types.cards_block.id].filter(
          (id) => id !== types.shop_service_section.id,
        ),
      },
    },
  });
  await client.itemTypes.destroy(types.shop_service_section.id);
  await client.itemTypes.destroy(types.shop_service_card.id);
};
