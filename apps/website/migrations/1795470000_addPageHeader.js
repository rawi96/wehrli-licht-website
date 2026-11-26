'use strict';

/**
 * Every content page gets the same header: H1 and introduction on the left, a picture on the right. Which kind of
 * page it is (area, overview, detail) follows from its place in the tree, see docs/adr/0002-page-levels.md.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const page = await client.itemTypes.find('page');

  const fieldset = await client.fieldsets.create(page.id, {
    title: '🧭 Seitenkopf',
    hint: 'Oben auf der Seite: Überschrift und Einleitung links, Bild rechts. Unterseiten erscheinen automatisch als Karten darunter.',
    position: 0,
  });
  const inFieldset = { fieldset: { id: fieldset.id, type: 'fieldset' } };

  await client.fields.create(page.id, {
    api_key: 'headline',
    label: 'Überschrift (H1)',
    field_type: 'string',
    hint: 'Mit dem wichtigsten Suchbegriff der Seite. Leer: der Seitentitel.',
    position: 0,
    ...inFieldset,
  });
  await client.fields.create(page.id, {
    api_key: 'intro',
    label: 'Einleitung',
    field_type: 'text',
    hint: 'Zwei bis drei Sätze: worum es geht und für wen. Steht unter der Überschrift.',
    appearance: { editor: 'textarea', parameters: {}, addons: [] },
    position: 1,
    ...inFieldset,
  });
  await client.fields.create(page.id, {
    api_key: 'hero_image',
    label: 'Kopfbild',
    field_type: 'file',
    hint: 'Querformat. Leer: das Bild der Vorschau-Karte.',
    validators: { extension: { predefined_list: 'image' } },
    position: 2,
    ...inFieldset,
  });
};
