'use strict';

/**
 * An offer tile (home page) can have its own picture. Without one, the tile shows the teaser image of the page it links
 * to, which is the same as that page's head picture.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const item = await client.itemTypes.find('highlight_offer_item');

  await client.fields.create(item.id, {
    api_key: 'image',
    label: 'Bild',
    field_type: 'file',
    hint: 'Eigenes Bild für die Kachel. Leer lassen, dann gilt das Teaserbild der verlinkten Seite.',
    validators: { extension: { predefined_list: 'image' } },
  });
};
