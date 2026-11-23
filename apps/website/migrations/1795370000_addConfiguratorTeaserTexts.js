'use strict';

/**
 * Block «Lampenschirm-Konfigurator»: the texts of the invitation (teaser) that opens the configurator become
 * editable. Existing blocks get the current texts, so nothing changes on the website.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SCREENSHOTS = require('./editor-screenshots.json');

const FIELDS = [
  {
    key: 'teaser_eyebrow',
    label: 'Kleine Überschrift',
    hint: 'Steht klein über dem Titel.',
    default: 'Lampenschirm-Konfigurator',
  },
  {
    key: 'teaser_title',
    label: 'Titel',
    default: 'Gestalten Sie Ihren eigenen Lampenschirm',
    required: true,
  },
  {
    key: 'teaser_text',
    label: 'Text',
    hint: 'Zwei, drei Sätze: was man hier tun kann.',
    multiline: true,
    default:
      'Wählen Sie Raum, Form, Stoff und Farbe und sehen Sie Ihren Schirm sofort in 3D. Ganz einfach, Schritt für Schritt. Zum Schluss geht das Licht an.',
  },
  {
    key: 'teaser_points',
    label: 'Punkte mit Häkchen',
    hint: 'Eine Zeile pro Punkt, am besten drei kurze.',
    multiline: true,
    default: 'In 8 einfachen Schritten\nSofort in 3D, in Ihrem Raum\nUnverbindlich anfragen',
  },
  {
    key: 'start_label',
    label: 'Text auf dem Startknopf',
    hint: 'Wer schon angefangen hat, sieht «Weiter gestalten».',
    default: 'Jetzt starten',
    required: true,
  },
  {
    key: 'teaser_note',
    label: 'Hinweis neben dem Knopf',
    hint: 'Optional, z. B. wie lange es dauert.',
    default: 'Dauert etwa 3 Minuten',
  },
];

module.exports = async (client) => {
  const block = await client.itemTypes.find('lampshade_configurator');
  const hint =
    'Eine Einladung mit Startknopf; der 3D-Konfigurator öffnet sich darauf im ganzen Bildschirm. Am besten allein auf einer Seite. Die Anfrage landet im Kontaktformular der Kontaktseite (aus «Kopf- & Fusszeile»).';
  await client.itemTypes.update(block.id, {
    hint: SCREENSHOTS.lampshade_configurator ? `${SCREENSHOTS.lampshade_configurator} ${hint}` : hint,
  });

  for (const [index, field] of FIELDS.entries()) {
    await client.fields.create(block.id, {
      api_key: field.key,
      label: field.label,
      hint: field.hint ?? null,
      field_type: field.multiline ? 'text' : 'string',
      appearance: field.multiline
        ? { editor: 'textarea', parameters: { placeholder: null }, addons: [] }
        : { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] },
      validators: field.required ? { required: {} } : {},
      default_value: field.default,
      position: index,
    });
  }

  // Existing configurator blocks get the current texts.
  const defaults = Object.fromEntries(FIELDS.map((field) => [field.key, field.default]));
  for await (const page of client.items.listPagedIterator({ filter: { type: 'page' }, nested: true, version: 'current' })) {
    const content = page.content ?? [];
    if (!content.some((item) => item.relationships?.item_type?.data?.id === block.id)) {
      continue;
    }
    const published = page.meta.status === 'published';
    await client.items.update(page.id, {
      content: content.map((item) =>
        item.relationships?.item_type?.data?.id === block.id
          ? {
              type: 'item',
              id: item.id,
              attributes: defaults,
              relationships: { item_type: { data: { id: block.id, type: 'item_type' } } },
            }
          : item.id,
      ),
    });
    if (published) {
      await client.items.publish(page.id);
    }
  }
};
