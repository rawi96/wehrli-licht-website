'use strict';

/**
 * A catalog of lampshade shapes (page «Lampenschirmformen»): groups of shapes, each with its sketch, name and a short
 * description. A shape that the 3D configurator knows links straight into it.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const configuratorShapes = [
    'zylinder', 'trommel', 'konisch', 'konisch-flach', 'quadratisch-zylindrisch', 'rechteckig-zylindrisch',
    'quadratisch', 'rechteckig', 'oval', 'elliptisch', 'elliptisch-flach', 'spitzoval', 'halbschild-zylindrisch',
    'halbschild', 'halbschild-eckig', 'halbschild-oval', 'mehrfach', 'pagode', 'doppelpagode', 'wellenpagode',
    'doppelwellenpagode',
  ];

  const item = await client.itemTypes.create({
    name: 'Form', api_key: 'shape_item', modular_block: true,
    hint: 'Eine Lampenschirmform mit Skizze, Name und kurzer Beschreibung.',
  });
  await client.fields.create(item.id, { api_key: 'name', label: 'Name', field_type: 'string', validators: { required: {} } });
  await client.fields.create(item.id, { api_key: 'description', label: 'Beschreibung', field_type: 'text', hint: 'Ein bis zwei Sätze.' });
  await client.fields.create(item.id, {
    api_key: 'image', label: 'Skizze', field_type: 'file',
    validators: { required: {}, extension: { predefined_list: 'image' } },
  });
  await client.fields.create(item.id, {
    api_key: 'configurator_shape', label: 'Form im 3D-Konfigurator', field_type: 'string',
    hint: 'Wenn der Konfigurator diese Form kennt: Die Karte bekommt den Link «In 3D ansehen».',
    validators: { enum: { values: configuratorShapes } },
    appearance: { editor: 'string_select', parameters: { options: configuratorShapes.map((value) => ({ label: value, value, hint: '' })) }, addons: [] },
  });

  const group = await client.itemTypes.create({
    name: 'Formengruppe', api_key: 'shape_group', modular_block: true,
    hint: 'Eine Gruppe von Formen, z. B. «Runde Formen».',
  });
  await client.fields.create(group.id, { api_key: 'title', label: 'Titel', field_type: 'string', validators: { required: {} } });
  await client.fields.create(group.id, { api_key: 'intro', label: 'Einleitung', field_type: 'text' });
  await client.fields.create(group.id, {
    api_key: 'shapes', label: 'Formen', field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [item.id] } },
  });

  const catalog = await client.itemTypes.create({
    name: 'Formen-Katalog', api_key: 'shape_catalog', modular_block: true,
    hint: 'Alle Lampenschirmformen nach Gruppen, mit Sprunglinks und Link in den 3D-Konfigurator.',
  });
  await client.fields.create(catalog.id, {
    api_key: 'groups', label: 'Gruppen', field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [group.id] } },
  });
  const page = await client.itemTypes.find('page');
  await client.fields.create(catalog.id, {
    api_key: 'configurator_page', label: 'Seite des 3D-Konfigurators', field_type: 'link',
    validators: { item_item_type: { item_types: [page.id] } },
  });

  const content = await client.fields.find('page::content');
  await client.fields.update(content.id, {
    validators: {
      ...content.validators,
      rich_text_blocks: { item_types: [...content.validators.rich_text_blocks.item_types, catalog.id] },
    },
  });
};
