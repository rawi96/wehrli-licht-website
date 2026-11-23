'use strict';

/**
 * «Kopf- & Fusszeile»: the legal pages shown at the bottom of the footer (e.g. Impressum, Datenschutz, AGB), in order.
 * Without any, the footer keeps showing only the privacy page.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const layout = await client.itemTypes.find('header_footer');
  const page = await client.itemTypes.find('page');
  const privacy = (await client.fields.list(layout.id)).find((field) => field.api_key === 'privacy_page');
  await client.fields.create(layout.id, {
    api_key: 'legal_pages',
    label: 'Rechtliche Seiten',
    field_type: 'links',
    hint: 'Erscheinen klein unten im Footer, in dieser Reihenfolge, z. B. Impressum, Datenschutz, AGB.',
    validators: { items_item_type: { item_types: [page.id] } },
    appearance: { editor: 'links_select', parameters: {}, addons: [] },
    ...(privacy?.fieldset ? { fieldset: privacy.fieldset } : {}),
  });
};
