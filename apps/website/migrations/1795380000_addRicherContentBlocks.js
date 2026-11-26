'use strict';

/**
 * Five blocks that make pages easier to scan than text after text: cards with a symbol, facts & figures, steps or a
 * timeline, sections that fold open, and a call to action with buttons.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

/** Symbols for cards; the design system has the same names (CARD_ICONS). */
const ICONS = [
  ['licht', 'Glühbirne'],
  ['funkeln', 'Funkeln'],
  ['sonne', 'Sonne'],
  ['stoff', 'Stoffmuster'],
  ['schere', 'Schere'],
  ['pinsel', 'Pinsel'],
  ['werkzeug', 'Werkzeug'],
  ['steuerung', 'Regler'],
  ['berechnung', 'Rechner'],
  ['form', 'Würfel / Form'],
  ['zuhause', 'Haus'],
  ['buero', 'Bürogebäude'],
  ['laden', 'Laden'],
  ['gespraech', 'Gespräch'],
  ['foto', 'Kamera'],
  ['frage', 'Fragezeichen'],
  ['zeit', 'Uhr'],
  ['ort', 'Ort'],
  ['lieferung', 'Lieferwagen'],
  ['team', 'Menschen'],
  ['qualitaet', 'Qualitätssiegel'],
  ['herz', 'Herz'],
];

const SINGLE_LINE = { editor: 'single_line', parameters: { heading: false, placeholder: null }, addons: [] };
const TEXTAREA = { editor: 'textarea', parameters: { placeholder: null }, addons: [] };

module.exports = async (client) => {
  const link = await client.itemTypes.find('link');
  const pageModel = await client.itemTypes.find('page');

  const string = (api_key, label, extra = {}) => ({ api_key, label, field_type: 'string', appearance: SINGLE_LINE, ...extra });
  const text = (api_key, label, extra = {}) => ({ api_key, label, field_type: 'text', appearance: TEXTAREA, ...extra });
  const linkBlock = (api_key, label, extra = {}) => ({
    api_key,
    label,
    field_type: 'single_block',
    validators: { single_block_blocks: { item_types: [link.id] } },
    appearance: { editor: 'framed_single_block', parameters: { start_collapsed: false }, addons: [] },
    ...extra,
  });
  const common = [
    string('anchor_id', 'Sprungmarke (Anker)', {
      hint: 'Optional. Kurzes Wort ohne Leerzeichen, z. B. «ablauf». Dann führt /seite#ablauf direkt zu diesem Block.',
    }),
    {
      api_key: 'disable_margin_top',
      label: 'Kein Abstand oben',
      hint: 'Block rückt näher an den Block darüber.',
      field_type: 'boolean',
    },
    {
      api_key: 'disable_margin_bottom',
      label: 'Kein Abstand unten',
      hint: 'Block rückt näher an den Block darunter.',
      field_type: 'boolean',
    },
  ];

  const createModel = async ({ name, api_key, hint, fields }) => {
    const model = await client.itemTypes.create({ name, api_key, modular_block: true, hint });
    for (const field of fields) {
      await client.fields.create(model.id, field);
    }

    return model;
  };
  const items = (itemModel, label, hint) => ({
    api_key: 'items',
    label,
    hint,
    field_type: 'rich_text',
    validators: { rich_text_blocks: { item_types: [itemModel.id] }, size: { min: 1 } },
    appearance: { editor: 'rich_text', parameters: { start_collapsed: true }, addons: [] },
  });
  const intro = [
    string('title', 'Überschrift', { hint: 'Optional.' }),
    text('intro', 'Einleitung', { hint: 'Optional, ein, zwei Sätze.' }),
  ];

  // Cards
  const cardItem = await createModel({
    name: '🗂️ Kachel',
    api_key: 'card_item',
    hint: 'Eine Kachel mit Symbol, Titel, kurzem Text und Link.',
    fields: [
      string('icon', 'Symbol', {
        validators: { enum: { values: ICONS.map(([value]) => value) } },
        appearance: {
          editor: 'string_select',
          parameters: { options: ICONS.map(([value, label]) => ({ hint: '', label, value })) },
          addons: [],
        },
        hint: 'Optional. Ein Bildzeichen über dem Titel.',
      }),
      string('title', 'Titel', { validators: { required: {} } }),
      text('text', 'Text', { hint: 'Ein, zwei kurze Sätze.' }),
      linkBlock('link', 'Link', { hint: 'Optional. Dann ist die ganze Kachel anklickbar.' }),
    ],
  });
  const cards = await createModel({
    name: '🗂️ Kacheln mit Symbol',
    api_key: 'cards_block',
    hint: 'Mehrere kurze Themen als Kacheln, z. B. die Unterseiten eines Bereichs oder die Vorteile einer Leistung. 3, 4 oder 6 Kacheln wirken am besten.',
    fields: [...intro, items(cardItem, 'Kacheln'), ...common],
  });

  // Facts & figures
  const factItem = await createModel({
    name: '🔢 Zahl',
    api_key: 'fact_item',
    hint: 'Eine Zahl mit Beschriftung.',
    fields: [
      string('value', 'Zahl', { validators: { required: {} }, hint: 'Kurz, z. B. «1948», «21» oder «100 %».' }),
      string('label', 'Beschriftung', { validators: { required: {} }, hint: 'Z. B. «Grundformen».' }),
      string('text', 'Zusatz', { hint: 'Optional, ein kurzer Satz.' }),
    ],
  });
  const facts = await createModel({
    name: '🔢 Zahlen & Fakten',
    api_key: 'facts_block',
    hint: 'Drei oder vier Zahlen gross auf blauem Grund: die Firma auf einen Blick.',
    fields: [...intro, items(factItem, 'Zahlen'), ...common],
  });

  // Steps / timeline
  const stepItem = await createModel({
    name: '🪜 Schritt',
    api_key: 'step_item',
    hint: 'Ein Schritt oder ein Ereignis in der Zeitleiste.',
    fields: [
      string('marker', 'Jahr oder Kennzeichen', { hint: 'Optional, z. B. «1948». Leer: die Nummer des Schritts.' }),
      string('title', 'Titel', { validators: { required: {} } }),
      text('text', 'Text', { hint: 'Ein, zwei Sätze.' }),
    ],
  });
  const steps = await createModel({
    name: '🪜 Schritte / Zeitleiste',
    api_key: 'steps_block',
    hint: 'Ein Ablauf in nummerierten Schritten (z. B. «So entsteht Ihr Lampenschirm») oder eine Zeitleiste mit Jahren.',
    fields: [
      ...intro,
      items(stepItem, 'Schritte'),
      linkBlock('link', 'Knopf darunter', { hint: 'Optional, z. B. «Jetzt anfragen».' }),
      ...common,
    ],
  });

  // Accordion
  const accordionItem = await createModel({
    name: '➕ Abschnitt',
    api_key: 'accordion_item',
    hint: 'Ein Abschnitt, der sich auf Klick öffnet.',
    fields: [
      string('title', 'Titel', { validators: { required: {} } }),
      {
        api_key: 'content',
        label: 'Inhalt',
        field_type: 'structured_text',
        validators: {
          structured_text_blocks: { item_types: [link.id] },
          structured_text_links: {
            on_publish_with_unpublished_references_strategy: 'fail',
            on_reference_unpublish_strategy: 'delete_references',
            on_reference_delete_strategy: 'delete_references',
            item_types: [pageModel.id],
          },
          structured_text_inline_blocks: { item_types: [] },
        },
        appearance: {
          editor: 'structured_text',
          parameters: {
            marks: ['strong', 'emphasis', 'underline'],
            nodes: ['link', 'list', 'itemLink'],
            heading_levels: [],
            blocks_start_collapsed: true,
            show_links_meta_editor: false,
            show_links_target_blank: true,
          },
          addons: [],
        },
      },
    ],
  });
  const accordion = await createModel({
    name: '➕ Aufklappbare Abschnitte',
    api_key: 'accordion_block',
    hint: 'Längere Inhalte in Abschnitten, die sich auf Klick öffnen. So bleibt die Seite kurz und übersichtlich.',
    fields: [
      ...intro,
      items(accordionItem, 'Abschnitte'),
      {
        api_key: 'open_first',
        label: 'Ersten Abschnitt offen zeigen',
        field_type: 'boolean',
      },
      ...common,
    ],
  });

  // Call to action
  const cta = await createModel({
    name: '📣 Aufruf mit Knopf',
    api_key: 'cta_block',
    hint: 'Ein blaues Band mit kurzem Titel, einem Satz und ein oder zwei Knöpfen. Gut am Ende einer Seite.',
    fields: [
      string('title', 'Titel', { validators: { required: {} } }),
      text('text', 'Text', { hint: 'Ein Satz.' }),
      linkBlock('primary', 'Knopf', { validators: { single_block_blocks: { item_types: [link.id] }, required: {} } }),
      linkBlock('secondary', 'Zweiter Link', { hint: 'Optional.' }),
      ...common,
    ],
  });

  const pageContent = (await client.fields.list(pageModel.id)).find((field) => field.api_key === 'content');
  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: {
        item_types: [
          ...pageContent.validators.rich_text_blocks.item_types,
          cards.id,
          facts.id,
          steps.id,
          accordion.id,
          cta.id,
        ],
      },
    },
  });
};
