'use strict';

/**
 * New navigation (mega menu) and redirects maintained in DatoCMS:
 * - Blocks «Menü-Link», «Menü-Spalte» and «Hauptmenüpunkt»
 * - «Header & Footer»: «Hauptmenü» (mega menu) and the «Termin» button in the header
 * - Model «Weiterleitung»: permanent redirects of old URLs, applied by the website at build time
 * Additive only: the old «Menü» field stays and is used as long as «Hauptmenü» is empty.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const pageModel = await client.itemTypes.find('page');
  const categoryModel = await client.itemTypes.find('shop_category');

  const menuLink = await client.itemTypes.create({
    name: '🔗 Menü-Link',
    api_key: 'menu_link',
    modular_block: true,
    hint: 'Ein Link im Hauptmenü: auf eine Seite, eine Shop-Kategorie oder einen Pfad.',
  });
  await client.fields.create(menuLink.id, {
    api_key: 'label',
    label: 'Text',
    field_type: 'string',
    validators: { required: {} },
  });
  await client.fields.create(menuLink.id, {
    api_key: 'page',
    label: 'Seite',
    field_type: 'link',
    hint: 'Wenn gesetzt, hat die Seite Vorrang vor Kategorie und Pfad.',
    validators: { item_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(menuLink.id, {
    api_key: 'shop_category',
    label: 'Shop-Kategorie',
    field_type: 'link',
    validators: { item_item_type: { item_types: [categoryModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(menuLink.id, {
    api_key: 'path',
    label: 'Pfad',
    field_type: 'string',
    hint: 'Nur wenn weder Seite noch Kategorie passen, z. B. /shop/alle-leuchten oder /ueber-uns/showroom#hersteller.',
    validators: { format: { custom_pattern: '^/[^\\s]*$' } },
  });

  const menuColumn = await client.itemTypes.create({
    name: '📂 Menü-Spalte',
    api_key: 'menu_column',
    modular_block: true,
    hint: 'Eine Spalte im aufgeklappten Hauptmenü, mit Überschrift.',
  });
  await client.fields.create(menuColumn.id, {
    api_key: 'title',
    label: 'Überschrift',
    field_type: 'string',
    validators: { required: {} },
  });
  await client.fields.create(menuColumn.id, {
    api_key: 'links',
    label: 'Links',
    field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [menuLink.id] } },
  });

  const menuSection = await client.itemTypes.create({
    name: '🧭 Hauptmenüpunkt',
    api_key: 'menu_section',
    modular_block: true,
    hint: 'Ein Punkt im Hauptmenü. Mit Spalten klappt er als Mega-Menü auf, ohne Spalten ist er ein Link.',
  });
  await client.fields.create(menuSection.id, {
    api_key: 'label',
    label: 'Text',
    field_type: 'string',
    validators: { required: {} },
  });
  await client.fields.create(menuSection.id, {
    api_key: 'page',
    label: 'Übersichtsseite',
    field_type: 'link',
    hint: 'Ziel des Menüpunkts. Im aufgeklappten Menü als «Übersicht …» verlinkt.',
    validators: { item_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(menuSection.id, {
    api_key: 'path',
    label: 'Pfad',
    field_type: 'string',
    hint: 'Nur wenn keine Übersichtsseite passt, z. B. /shop.',
    validators: { format: { custom_pattern: '^/[^\\s]*$' } },
  });
  await client.fields.create(menuSection.id, {
    api_key: 'columns',
    label: 'Spalten',
    field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [menuColumn.id] } },
  });
  await client.fields.create(menuSection.id, {
    api_key: 'footer_links',
    label: 'Links unter den Spalten',
    field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [menuLink.id] } },
  });
  await client.fields.create(menuSection.id, {
    api_key: 'is_shop',
    label: 'Shop (rechts als Button)',
    field_type: 'boolean',
    hint: 'Der Shop steht abgesetzt rechts neben dem Termin-Button.',
  });

  await client.fields.create('header_footer', {
    api_key: 'main_menu',
    label: 'Hauptmenü',
    field_type: 'rich_text',
    hint: 'Neues Hauptmenü mit Mega-Menü. Solange es leer ist, wird das alte «Menü» verwendet.',
    validators: { rich_text_blocks: { item_types: [menuSection.id] } },
  });
  await client.fields.create('header_footer', {
    api_key: 'appointment_label',
    label: 'Termin-Button: Text',
    field_type: 'string',
    hint: 'Button oben rechts im Header, z. B. «Termin».',
  });
  await client.fields.create('header_footer', {
    api_key: 'appointment_page',
    label: 'Termin-Button: Seite',
    field_type: 'link',
    validators: { item_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });

  const redirect = await client.itemTypes.create({
    name: '↪️ Weiterleitung',
    api_key: 'redirect',
    hint: 'Dauerhafte Weiterleitung (301) einer alten URL. Wird beim nächsten Deployment aktiv.',
    collection_appearance: 'table',
  });
  const source = await client.fields.create(redirect.id, {
    api_key: 'source',
    label: 'Alte URL',
    field_type: 'string',
    hint: 'Pfad ohne Domain, z. B. /angebot/lampenschirme. «:path*» am Ende leitet alle Unterseiten mit weiter.',
    validators: { required: {}, unique: {}, format: { custom_pattern: '^/[^\\s]*$' } },
  });
  await client.fields.create(redirect.id, {
    api_key: 'destination',
    label: 'Neue URL',
    field_type: 'string',
    hint: 'Pfad ohne Domain, z. B. /lampenschirme.',
    validators: { required: {}, format: { custom_pattern: '^/[^\\s]*$' } },
  });
  await client.itemTypes.update(redirect.id, { title_field: { id: source.id, type: 'field' } });
};
