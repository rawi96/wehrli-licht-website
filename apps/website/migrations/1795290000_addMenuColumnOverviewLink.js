'use strict';

/**
 * «Menü-Spalte»: a link with arrow below the column's links («Alle Leistungen →»), to «Seite» or a «Pfad».
 * The column title itself is plain text. Additive only.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  await client.fields.create('menu_column', {
    api_key: 'overview_label',
    label: 'Text des Übersichts-Links',
    field_type: 'string',
    hint: 'Link unter den Links der Spalte, z. B. «Alle Leistungen». Ziel ist «Seite», sonst «Pfad». Leer: kein Link.',
  });
  await client.fields.create('menu_column', {
    api_key: 'overview_path',
    label: 'Pfad des Übersichts-Links',
    field_type: 'string',
    hint: 'Nur wenn keine Seite passt, z. B. /shop/alle-leuchten.',
    validators: { format: { custom_pattern: '^/[^\\s]*$' } },
  });

  const page = (await client.fields.list('menu_column')).find((field) => field.api_key === 'page');
  await client.fields.update(page.id, {
    hint: 'Ziel des Übersichts-Links unter der Spalte, z. B. die Übersicht der Kategorie.',
  });
};
