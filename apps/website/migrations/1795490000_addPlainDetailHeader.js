'use strict';

/**
 * Some detail pages are their own content (team, history, contact, configurator …): a picture and the box with
 * sections and contact person at the top only get in the way there.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const page = await client.itemTypes.find('page');
  const fieldsets = await client.fieldsets.list(page.id);
  const header = fieldsets.find((set) => set.title.includes('Seitenkopf'));

  await client.fields.create(page.id, {
    api_key: 'plain_header',
    label: 'Schlichter Seitenkopf',
    field_type: 'boolean',
    hint: 'Nur bei Seiten ohne Unterseiten: Titel und Einleitung ohne Kopfbild und Ansprechperson. Für Seiten wie Team, Kontakt oder Konfigurator, deren Inhalt gleich beginnen soll.',
    default_value: false,
    position: 3,
    ...(header ? { fieldset: { id: header.id, type: 'fieldset' } } : {}),
  });
};
