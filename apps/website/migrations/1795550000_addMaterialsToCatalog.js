'use strict';

/**
 * The shape catalog also lists materials (page «Materialien»): an entry can name a material and colour of the 3D
 * configurator, and the catalog says whether it shows shapes (sketches, shown whole) or materials (renderings, filling
 * the card).
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const materials = ['leinen', 'seide', 'polyester', 'smocking', 'pergament', 'leder', 'blattmetall'];

  const item = await client.itemTypes.find('shape_item');
  await client.itemTypes.update(item.id, {
    name: 'Form oder Material',
    hint: 'Eine Lampenschirmform oder ein Material mit Bild, Name und kurzer Beschreibung.',
  });
  await client.fields.create(item.id, {
    api_key: 'configurator_material', label: 'Material im 3D-Konfigurator', field_type: 'string',
    hint: 'Wenn der Konfigurator dieses Material kennt: Die Karte bekommt den Link «In 3D ansehen».',
    validators: { enum: { values: materials } },
    appearance: { editor: 'string_select', parameters: { options: materials.map((value) => ({ label: value, value, hint: '' })) }, addons: [] },
  });
  await client.fields.create(item.id, {
    api_key: 'configurator_color', label: 'Farbe im 3D-Konfigurator', field_type: 'string',
    hint: 'Hex-Farbe ohne #, z. B. 214073. Nur zusammen mit einem Material.',
    validators: { format: { custom_pattern: '^[0-9a-fA-F]{6}$' } },
  });

  const catalog = await client.itemTypes.find('shape_catalog');
  await client.itemTypes.update(catalog.id, {
    name: 'Formen- oder Materialkatalog',
    hint: 'Formen oder Materialien nach Gruppen, mit Sprunglinks und Link in den 3D-Konfigurator.',
  });
  await client.fields.create(catalog.id, {
    api_key: 'kind', label: 'Art', field_type: 'string',
    hint: 'Formen: Skizzen, ganz gezeigt. Materialien: Bilder füllen die Karte.',
    validators: { required: {}, enum: { values: ['formen', 'materialien'] } },
    default_value: 'formen',
    appearance: {
      editor: 'string_radio_group',
      parameters: { radios: [{ label: 'Formen', value: 'formen' }, { label: 'Materialien', value: 'materialien' }] },
      addons: [],
    },
  });
  await client.fields.update((await client.fields.find('shape_item::image')).id, { label: 'Bild' });
};
