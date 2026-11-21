'use strict';

/**
 * «Menü-Spalte» gets an optional «Seite»: the column title then links to that page (e.g. a category overview).
 * Additive only.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const pageModel = await client.itemTypes.find('page');

  await client.fields.create('menu_column', {
    api_key: 'page',
    label: 'Seite',
    field_type: 'link',
    hint: 'Optional: die Überschrift verlinkt auf diese Seite, z. B. die Übersicht der Kategorie.',
    validators: { item_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
};
