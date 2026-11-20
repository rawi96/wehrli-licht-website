'use strict';

/**
 * Moves business facts used for structured data (JSON-LD) and llms.txt into the CMS:
 * - singleton "🏢 Firmenprofil (SEO & KI)"
 * - boolean "Ist ein Artikel" on pages (BlogPosting structured data)
 * Additive only: no existing model, field or record is changed or removed.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const profile = await client.itemTypes.create({
    name: '🏢 Firmenprofil (SEO & KI)',
    api_key: 'company_profile',
    singleton: true,
    hint: 'Angaben für Suchmaschinen und KI-Assistenten (strukturierte Daten, llms.txt). Adresse, Telefon und E-Mail kommen aus «Header & Footer».',
  });

  const textarea = { appearance: { editor: 'textarea', parameters: {}, addons: [] } };
  const field = (api_key, label, field_type, hint, extra = {}) =>
    client.fields.create(profile, { api_key, label, field_type, hint, ...extra });

  await field('description', 'Kurzbeschreibung', 'text', 'Ein bis zwei Sätze: Was macht das Unternehmen, für wen, wo.', textarea);
  await field(
    'llms_intro',
    'Einleitung für KI-Assistenten',
    'text',
    'Erscheint in /llms.txt. Fakten statt Werbung: Geschichte, Kernkompetenzen, Ablauf (z.B. Beratung nach Termin).',
    textarea,
  );
  await field('founding_year', 'Gründungsjahr', 'integer', 'z.B. 1947');
  await field('address_region', 'Kanton / Region', 'string', 'Kürzel des Kantons, z.B. SG');
  await field('area_served', 'Einzugsgebiet', 'text', 'Eine Region pro Zeile, z.B. «Ostschweiz».', textarea);
  await field('expertise', 'Fachgebiete', 'text', 'Ein Fachgebiet pro Zeile, z.B. «Lampenschirme nach Mass».', textarea);
  await field('location', 'Standort', 'lat_lon', 'Position des Geschäfts auf der Karte (für lokale Suche «in der Nähe»).');

  await client.fields.create('page', {
    api_key: 'is_article',
    label: 'Ist ein Artikel',
    field_type: 'boolean',
    hint: 'Für Blog- und Ratgeberbeiträge: wird Suchmaschinen als Artikel (mit Datum) ausgezeichnet.',
  });
};
