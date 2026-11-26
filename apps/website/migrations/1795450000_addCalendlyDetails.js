'use strict';

/**
 * Block «Terminbuchung (Calendly)»: a contact person and a short checklist beside the calendar.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const block = await client.itemTypes.find('calendly');
  const employee = await client.itemTypes.find('employee');
  await client.fields.create(block.id, {
    api_key: 'employee',
    label: 'Ansprechperson',
    field_type: 'link',
    hint: 'Optional. Erscheint mit Foto neben dem Kalender.',
    validators: { item_item_type: { item_types: [employee.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(block.id, {
    api_key: 'points',
    label: 'Punkte mit Häkchen',
    field_type: 'text',
    hint: 'Eine Zeile pro Punkt, z. B. Dauer oder was man mitbringen kann.',
    appearance: { editor: 'textarea', parameters: { placeholder: null }, addons: [] },
  });
};
