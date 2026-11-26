'use strict';

/**
 * Detail pages show one contact person with «Termin vereinbaren» below their picture, the same on every page.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const settings = await client.itemTypes.find('header_footer');
  const employee = await client.itemTypes.find('employee');

  await client.fields.create(settings.id, {
    api_key: 'detail_contact',
    label: 'Ansprechperson auf Detailseiten',
    field_type: 'link',
    hint: 'Erscheint auf jeder Detailseite unter dem Bild, mit «Termin vereinbaren», E-Mail und Telefon.',
    validators: { item_item_type: { item_types: [employee.id] } },
  });
};
