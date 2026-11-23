'use strict';

/**
 * Block «Terminbuchung (Calendly)»: heading, text and anchor of its own, shown beside the booking widget. Existing
 * pages keep their separate text block until an editor moves it.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
const SINGLE_LINE = { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] };

module.exports = async (client) => {
  const block = await client.itemTypes.find('calendly');
  await client.fields.create(block.id, { api_key: 'title', label: 'Überschrift', field_type: 'string', appearance: SINGLE_LINE, hint: 'Steht links neben dem Kalender.' });
  await client.fields.create(block.id, {
    api_key: 'intro',
    label: 'Text',
    field_type: 'text',
    appearance: { editor: 'textarea', parameters: { placeholder: null }, addons: [] },
    hint: 'Z. B. was man mitbringen soll.',
  });
  await client.fields.create(block.id, {
    api_key: 'anchor_id',
    label: 'Sprungmarke (Anker)',
    field_type: 'string',
    appearance: SINGLE_LINE,
    hint: 'Optional, z. B. «termin». Dann führt /seite#termin direkt zum Kalender.',
  });
};
