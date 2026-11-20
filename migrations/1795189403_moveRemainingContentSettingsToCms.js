'use strict';

/**
 * Moves settings that were hardcoded in the frontend into the CMS:
 * - «Header & Footer»: links to the contact page and the privacy page
 * - «Kontaktformular» block: topics («Anliegen»)
 * - «Team» block: optional title (section heading above the team members)
 * - «Calendly» block: booking URL
 * Additive only: no existing model, field or record is changed or removed.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const pageModel = await client.itemTypes.find('page');
  const pageLink = (api_key, label, hint) =>
    client.fields.create('header_footer', {
      api_key,
      label,
      field_type: 'link',
      hint,
      validators: { item_item_type: { item_types: [pageModel.id] } },
      appearance: { editor: 'link_select', parameters: {}, addons: [] },
    });

  await pageLink('contact_page', 'Kontaktseite', 'Seite mit dem Kontaktformular (Ziel von «Fragen zu dieser Leuchte?»).');
  await pageLink('privacy_page', 'Datenschutzseite', 'Wird im Footer, im Cookie-Hinweis und beim Kontaktformular verlinkt.');

  await client.fields.create('contact_form', {
    api_key: 'topics',
    label: 'Anliegen',
    field_type: 'text',
    hint: 'Auswahl im Formular, ein Anliegen pro Zeile. Das erste ist vorausgewählt.',
    appearance: { editor: 'textarea', parameters: {}, addons: [] },
  });

  await client.fields.create('team', {
    api_key: 'title',
    label: 'Titel',
    field_type: 'string',
    hint: 'Optionale Überschrift über dem Team (Namen werden dann als Unterüberschriften ausgezeichnet).',
  });

  await client.fields.create('calendly', {
    api_key: 'url',
    label: 'Calendly-Link',
    field_type: 'string',
    hint: 'Buchungslink, z.B. https://calendly.com/<konto>/<termin>. Optional mit ?primary_color=214073.',
    validators: { format: { custom_pattern: '^https://calendly\\.com/.+' } },
  });
};
