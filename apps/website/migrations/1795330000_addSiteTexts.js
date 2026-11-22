'use strict';

/**
 * Texts that were in the code become editable:
 * - Singleton «Texte & Beschriftungen»: labels of menus, projects, FAQ, shop, checkout, e-mails, contact form, cookie
 *   notice, 404 page and footer, in groups. Fields and current texts come from src/domain/content/site-texts.json,
 *   the record is created with them, so nothing changes on the website.
 * - «Firmenprofil»: the bank details for prepayment e-mails.
 * - The old navigation («Menü» with the blocks «Verzeichnis» and «Navigationspunkt») is removed: the website uses
 *   «Hauptmenü» only.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const { groups } = require('../src/domain/content/site-texts.json');

const BANK_DETAILS = `Wehrli Licht GmbH
Blumenstrasse 66, 9403 Goldach
CH85 8080 8002 7218 3021 4
BIC/Swift Code: RAIFCH22C96
Raiffeisenbank Region Rorschach
Blumenstrasse 30, 9403 Goldach`;

module.exports = async (client) => {
  const model = await client.itemTypes.create({
    name: '🔤 Texte & Beschriftungen',
    api_key: 'site_text',
    singleton: true,
    hint: 'Kleinere Texte der Website, die nicht zu einer Seite gehören: Knöpfe, Links, Hinweise, E-Mails. Gruppe aufklappen, Text ändern, veröffentlichen.',
  });

  const values = {};
  for (const [index, group] of groups.entries()) {
    const fieldset = await client.fieldsets.create(model.id, {
      title: group.title,
      hint: group.hint ?? null,
      collapsible: true,
      start_collapsed: true,
      position: index,
    });
    for (const field of group.fields) {
      await client.fields.create(model.id, {
        api_key: field.key,
        label: field.label,
        hint: field.hint ?? null,
        field_type: field.multiline ? 'text' : 'string',
        appearance: field.multiline
          ? { editor: 'textarea', parameters: { placeholder: null }, addons: [] }
          : { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] },
        validators: { required: {} },
        default_value: field.default,
        fieldset: { id: fieldset.id, type: 'fieldset' },
      });
      values[field.key] = field.default;
    }
  }

  const record = await client.items.create({ item_type: { id: model.id, type: 'item_type' }, ...values });
  await client.items.publish(record.id);

  // Bank details in the company profile.
  const profileModel = await client.itemTypes.find('company_profile');
  await client.itemTypes.update(profileModel.id, {
    name: '🏢 Firmendaten',
    hint: 'Angaben zur Firma für Google, KI-Assistenten und Bestell-E-Mails. Adresse, Telefon und E-Mail stehen in «Kopf- & Fusszeile».',
  });
  await client.fields.create(profileModel.id, {
    api_key: 'bank_details',
    label: 'Bankverbindung',
    hint: 'Erscheint in der Bestätigung bei Vorauskasse. Inhaber, Adresse, IBAN, BIC und Bank, je eine Zeile.',
    field_type: 'text',
    appearance: { editor: 'textarea', parameters: { placeholder: null }, addons: [] },
  });
  const [profile] = await client.items.list({ filter: { type: 'company_profile' } });
  if (profile) {
    await client.items.update(profile.id, { bank_details: BANK_DETAILS });
    if (profile.meta.status === 'published') {
      await client.items.publish(profile.id);
    }
  }

  // Old navigation: replaced by «Hauptmenü».
  const headerFooter = await client.itemTypes.find('header_footer');
  const oldMenu = (await client.fields.list(headerFooter.id)).find((field) => field.api_key === 'menu');
  if (oldMenu) {
    await client.fields.destroy(oldMenu.id);
  }
  for (const apiKey of ['directory', 'navigation_item']) {
    const block = (await client.itemTypes.list()).find((itemType) => itemType.api_key === apiKey);
    if (block) {
      await client.itemTypes.destroy(block.id);
    }
  }
};
