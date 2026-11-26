'use strict';

/**
 * Cards can show what they are about above their text: a colour as a swatch (e.g. brand colours) or a picture such as
 * a logo, optionally on a dark background (white logo).
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const card = await client.itemTypes.find('card_item');

  await client.fields.create(card.id, {
    api_key: 'color',
    label: 'Farbe',
    field_type: 'color',
    hint: 'Zeigt oben auf der Karte ein Farbfeld mit dem Farbwert, z. B. für die Markenfarben.',
  });
  await client.fields.create(card.id, {
    api_key: 'preview',
    label: 'Vorschau',
    field_type: 'file',
    hint: 'Bild oben auf der Karte, z. B. ein Logo (SVG oder PNG). Wird ganz gezeigt, nicht zugeschnitten.',
    validators: { extension: { predefined_list: 'image' } },
  });
  await client.fields.create(card.id, {
    api_key: 'preview_dark',
    label: 'Vorschau auf dunklem Hintergrund',
    field_type: 'boolean',
    hint: 'Für helle oder weisse Bilder, z. B. das weisse Logo.',
    default_value: false,
  });
};
