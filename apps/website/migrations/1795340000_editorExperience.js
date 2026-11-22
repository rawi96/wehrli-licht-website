'use strict';

/**
 * Makes the CMS easier for editors: German names, a short explanation with a screenshot for every block (the help
 * text of a block starts with the image URL, DatoCMS shows it in the block picker), help texts for fields that are
 * not self-explanatory, rarely used settings (SEO, teaser) in collapsed groups and spacing last in every block.
 * Only names, help texts, groups and option labels change: no content is touched.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */

const SCREENSHOTS = require('./editor-screenshots.json');

const MARGIN_FIELDS = {
  disable_margin_top: { label: 'Kein Abstand oben', hint: 'Block rückt näher an den Block darüber.' },
  disable_margin_bottom: { label: 'Kein Abstand unten', hint: 'Block rückt näher an den Block darunter.' },
};
const ANCHOR_FIELD = {
  label: 'Sprungmarke (Anker)',
  hint: 'Optional. Kurzes Wort ohne Leerzeichen, z. B. «ablauf». Dann führt /seite#ablauf direkt zu diesem Block.',
};

/**
 * Per model or block: name, explanation and fields (label, hint, group). A screenshot is put in front of the hint of
 * blocks listed in editor-screenshots.json.
 */
const SCHEMA = {
  // ── Content blocks of pages ──
  text: {
    name: '📝 Text',
    hint: 'Fliesstext mit Zwischentiteln, Listen und Links. Der Standard-Block für fast alles.',
    fields: { content: { label: 'Text' }, anchor_id: ANCHOR_FIELD },
  },
  text_image: {
    name: '📝 Text mit Bild',
    hint: 'Text auf der einen, ein Bild auf der anderen Seite. Auf dem Handy steht das Bild über dem Text.',
    fields: {
      content: { label: 'Text' },
      image: { label: 'Bild' },
      layout: { label: 'Bild-Position', hint: 'Auf welcher Seite das Bild steht.' },
      anchor_id: ANCHOR_FIELD,
    },
    options: {
      layout: [
        { label: 'Bild rechts', value: 'image_right' },
        { label: 'Bild links', value: 'image_left' },
      ],
    },
  },
  text_two_column: {
    name: '📝 Text in 2 Spalten',
    hint: 'Zwei Texte nebeneinander, z. B. für Vergleiche. Auf dem Handy untereinander.',
    fields: { content_left: { label: 'Linke Spalte' }, content_right: { label: 'Rechte Spalte' }, anchor_id: ANCHOR_FIELD },
  },
  text_three_column: {
    name: '📝 Text in 3 Spalten',
    hint: 'Drei kurze Texte nebeneinander, z. B. drei Schritte. Auf dem Handy untereinander.',
    fields: {
      content_left: { label: 'Linke Spalte' },
      content_middle: { label: 'Mittlere Spalte' },
      content_right: { label: 'Rechte Spalte' },
      anchor_id: ANCHOR_FIELD,
    },
  },
  image: {
    name: '📷 Bild',
    hint: 'Ein oder mehrere Bilder in voller Breite. Mehrere Bilder stehen nebeneinander.',
    fields: {
      images: { label: 'Bilder', hint: 'Bei jedem Bild unter «Alternativtext» kurz beschreiben, was zu sehen ist.' },
      priority: { label: 'Sofort laden', hint: 'Nur einschalten, wenn das Bild ganz oben auf der Seite steht.' },
    },
  },
  gallery: {
    name: '📷 Bildergalerie',
    hint: 'Mehrere Bilder als Raster. Ein Klick öffnet das Bild gross (Lightbox).',
    fields: {
      gallery: { label: 'Bilder' },
      show_image_titles: { label: 'Bildtitel anzeigen', hint: 'Zeigt den Titel aus der Mediathek unter jedem Bild.' },
    },
  },
  iframe: {
    name: '🪟 Eingebettete Seite',
    hint: 'Bindet eine fremde Seite ein, z. B. eine Karte oder ein Video. Nur für Spezialfälle.',
    fields: {
      src: { label: 'Adresse (URL)', hint: 'Vollständige Adresse mit https://, z. B. vom «Einbetten»-Knopf von YouTube.' },
    },
  },
  teaser_row: {
    name: '🎫 Seiten-Kacheln (Reihe)',
    hint: 'Verlinkt zwei bis vier Seiten als Kacheln in einer Reihe. Bild und Text kommen aus «Vorschau-Karte» der Seite.',
    fields: {
      teasers: {
        label: 'Seiten',
        hint: 'Bild, Titel und Text jeder Kachel pflegen Sie bei der Seite unter «Vorschau-Karte».',
      },
    },
  },
  teaser_grid: {
    name: '🎫 Seiten-Kacheln (Raster)',
    hint: 'Verlinkt beliebig viele Seiten als Kacheln im Raster, z. B. alle Unterseiten einer Übersicht.',
    fields: {
      teasers: {
        label: 'Seiten',
        hint: 'Bild, Titel und Text jeder Kachel pflegen Sie bei der Seite unter «Vorschau-Karte».',
      },
    },
  },
  quote: {
    name: '💬 Kundenstimmen',
    hint: 'Zeigt eine oder mehrere Kundenstimmen. Die Stimmen selbst pflegen Sie unter «Kundenstimmen».',
    fields: { testimonials: { label: 'Kundenstimmen' } },
  },
  logo_grid: {
    name: '🃏 Logos',
    hint: 'Logos von Kunden oder Marken in einem Raster.',
    fields: { logos: { label: 'Logos', hint: 'Am besten PNG oder SVG mit transparentem Hintergrund.' } },
  },
  team: {
    name: '👪 Team',
    hint: 'Zeigt Mitarbeitende mit Bild, Funktion und Kurzbiografie.',
    fields: {
      title: { label: 'Überschrift', hint: 'Optional, z. B. «Unser Team».' },
      employees: { label: 'Mitarbeitende', hint: 'Reihenfolge per Ziehen ändern.' },
    },
  },
  contact: {
    name: '☎️ Ansprechperson',
    hint: 'Eine Person mit Bild, Telefon und E-Mail als Kontakt für das Thema der Seite.',
    fields: {
      text: { label: 'Text', hint: 'Kurzer Satz über der Person, z. B. «Haben Sie Fragen zu Lampenschirmen?»' },
      employee: { label: 'Person' },
    },
  },
  contact_form: {
    name: '✉️ Kontaktformular',
    hint: 'Formular mit Spamschutz. Anfragen kommen per E-Mail an Wehrli Licht.',
    fields: {
      title: { label: 'Überschrift' },
      intro: { label: 'Einleitung' },
      topics: { label: 'Anliegen zur Auswahl', hint: 'Ein Anliegen pro Zeile. Das erste ist vorausgewählt.' },
    },
  },
  calendly: {
    name: '📅 Terminbuchung',
    hint: 'Kalender zum Buchen eines Termins (Calendly).',
    fields: {
      url: {
        label: 'Calendly-Link',
        hint: 'Den Link aus Calendly kopieren. Mit ?primary_color=214073 am Ende erscheinen die Knöpfe im Wehrli-Blau.',
      },
    },
  },
  faq_block: {
    name: '❓ Häufige Fragen',
    hint: 'Ausgewählte Fragen als aufklappbare Liste mit Link zu allen Fragen. Fragen pflegen Sie unter «FAQ».',
    fields: {
      title: { label: 'Überschrift', hint: 'Leer: «Häufige Fragen».' },
      intro: { label: 'Einleitung' },
      faqs: { label: 'Fragen', hint: 'Fragen auswählen oder hier neu anlegen. Reihenfolge per Ziehen.' },
      all_faqs_page: { label: 'Link zu allen Fragen', hint: 'Meist die Seite «FAQ». Leer: kein Link.' },
      all_faqs_link_text: { label: 'Text des Links', hint: 'Leer: «Alle Fragen ansehen».' },
    },
  },
  projects_block: {
    name: '🏗️ Passende Projekte',
    hint: 'Zeigt bis zu drei Projekte zu einem Bereich oder einer Leistung. Ohne Auswahl: die hervorgehobenen Projekte.',
    fields: {
      title: { label: 'Überschrift', hint: 'Leer: «Projekte zu diesem Thema».' },
      area: { label: 'Bereich', hint: 'Zeigt Projekte dieses Bereichs, z. B. Gastronomie.' },
      service: { label: 'Leistung', hint: 'Zeigt Projekte, bei denen diese Seite unter «Leistungen» ausgewählt ist.' },
    },
  },
  projects_overview: {
    name: '🏗️ Alle Projekte',
    hint: 'Alle Projekte mit Knöpfen pro Bereich. Gehört auf die Seite «Projekte».',
    fields: { all_label: { label: 'Text des Knopfs «Alle»', hint: 'Leer: «Alle».' } },
  },
  all_categories_block: {
    name: '🛒 Alle Shop-Kategorien',
    hint: 'Zeigt alle Shop-Kategorien, die unter «Im Shop anzeigen» aktiv sind.',
    fields: { layout: { label: 'Darstellung' } },
    options: {
      layout: [
        { label: 'Raster', value: 'grid' },
        { label: 'Reihe', value: 'row' },
      ],
    },
  },

  // ── Home page ──
  home_stage: {
    name: '🏠 Startseite: Bühne',
    hint: 'Grosses Bild mit Titel ganz oben auf der Startseite.',
    fields: {
      image: { label: 'Hauptbild', hint: 'Querformat, mindestens 2400 Pixel breit.' },
      title: { label: 'Titel' },
      intro: { label: 'Untertitel' },
      call_to_actions: { label: 'Knöpfe', hint: 'Ein bis zwei Knöpfe, z. B. «Lampenschirme» und «Licht planen».' },
      images: { label: 'Weitere Bilder (Slideshow)', hint: 'Optional. Wechseln nach dem Hauptbild automatisch.' },
    },
  },
  highlight_offers_teaser: {
    name: '🎬 Startseite: Leistungen',
    hint: 'Grosse Karten mit Bild für die wichtigsten Leistungen.',
    fields: {
      title: { label: 'Überschrift' },
      subline: { label: 'Einleitung' },
      footer_cta: { label: 'Knopf unten' },
      offers: { label: 'Karten' },
    },
  },
  highlight_offer_item: {
    name: '🃏 Leistungs-Karte',
    hint: 'Eine Karte im Block «Startseite: Leistungen». Das Bild kommt von der verlinkten Seite.',
    fields: {
      title: { label: 'Titel' },
      eyebrow: { label: 'Dachzeile', hint: 'Kleines Wort über dem Titel, z. B. «Atelier».' },
      offer_link: { label: 'Link' },
    },
  },
  highlight_projects_teaser: {
    name: '🎬 Startseite: Projekte',
    hint: 'Ausgewählte Projekte als grosse Karten.',
    fields: {
      title: { label: 'Überschrift' },
      subline: { label: 'Einleitung' },
      primary_cta: { label: 'Knopf' },
      projects: { label: 'Karten' },
    },
  },
  highlight_project_item: {
    name: '🃏 Projekt-Karte',
    hint: 'Eine Karte im Block «Startseite: Projekte». Das Bild kommt von der verlinkten Seite.',
    fields: {
      offer: { label: 'Dachzeile', hint: 'Was gemacht wurde, z. B. «Lichtplanung».' },
      title: { label: 'Titel' },
      company: { label: 'Kunde' },
      description: { label: 'Kurzbeschreibung' },
      project_link: { label: 'Link zum Projekt' },
    },
  },
  highlight_shop_teaser: {
    name: '🛒 Startseite: Online-Shop',
    hint: 'Hinweis auf den Online-Shop mit beliebten Kategorien.',
    fields: {
      eyebrow: { label: 'Dachzeile' },
      title: { label: 'Überschrift' },
      subline: { label: 'Einleitung' },
      primary_cta: { label: 'Hauptknopf' },
      secondary_cta: { label: 'Zweiter Knopf' },
      featured_categories: { label: 'Beliebte Kategorien', hint: 'Erscheinen als Kacheln mit Bild.' },
      popular_categories_label: { label: 'Titel über den beliebten Kategorien' },
      more_categories_label: { label: 'Titel über den weiteren Kategorien' },
    },
  },

  // ── Shop home page ──
  shop_storefront_hero: {
    name: '🛒 Shop: Einstieg',
    hint: 'Titel, Text und Kategorien ganz oben auf der Shop-Startseite.',
    fields: {
      eyebrow: { label: 'Dachzeile' },
      title: { label: 'Titel' },
      intro: { label: 'Einleitung' },
      primary_cta: { label: 'Hauptknopf' },
      secondary_cta: { label: 'Zweiter Knopf' },
      hero_categories: { label: 'Kategorien' },
    },
  },
  shop_category_section: {
    name: '🛒 Shop: Kategorien',
    hint: 'Die Shop-Kategorien als Kacheln.',
    fields: {
      title: { label: 'Überschrift' },
      description: { label: 'Einleitung' },
      action_link: { label: 'Link rechts' },
      section_id: ANCHOR_FIELD,
    },
  },
  shop_sf_featured: {
    name: '🛒 Shop: Bestseller',
    hint: 'Produkte mit «Als Bestseller hervorheben».',
    fields: { title: { label: 'Überschrift' }, description: { label: 'Einleitung' }, action_link: { label: 'Link rechts' } },
  },
  shop_service_section: {
    name: '🛒 Shop: Beratung & Service',
    hint: 'Karten zu Versand, Abholung, Zahlung und Besichtigung.',
    fields: {
      title: { label: 'Überschrift' },
      description: { label: 'Einleitung' },
      offers_link: { label: 'Link rechts' },
      items: { label: 'Karten' },
    },
  },
  shop_service_card: {
    name: '🃏 Shop: Service-Karte',
    hint: 'Eine Karte im Block «Shop: Beratung & Service».',
    fields: {
      title: { label: 'Titel' },
      description: { label: 'Text' },
      icon: { label: 'Symbol' },
      link: { label: 'Link' },
    },
  },

  // ── Small building blocks ──
  link: {
    name: '🔗 Knopf / Link',
    hint: 'Ein Link mit Text: auf eine Seite oder eine fremde Adresse.',
    fields: {
      label: { label: 'Text' },
      link: { label: 'Seite' },
      anchor_link: { label: 'Sprungmarke', hint: 'Optional, z. B. #ablauf: springt zu einem Block der Seite.' },
      is_external_url: { label: 'Fremde Adresse statt Seite' },
      external_url: {
        label: 'Adresse',
        hint: 'Mit https://, z. B. https://instagram.com/wehrlilicht. Oder ein Pfad wie /shop.',
      },
      new_tab: { label: 'In neuem Fenster öffnen' },
    },
  },
  product_variant: {
    name: '📦 Produktvariante',
    hint: 'Eine kaufbare Kombination, z. B. Grösse S in Weiss.',
    fields: {
      price: { label: 'Preis (CHF)' },
      selections: { label: 'Auswahl', hint: 'Pro Eigenschaft eine Zeile, z. B. Farbe → Weiss.' },
    },
  },
  variant_selection: {
    name: '🔹 Eigenschaft der Variante',
    fields: {
      option: { label: 'Eigenschaft', hint: 'z. B. Farbe, Grösse oder Material.' },
      value: { label: 'Wert', hint: 'z. B. Weiss oder S (40 × 31 cm).' },
    },
  },
  product_spec: {
    name: '📋 Technische Angabe',
    fields: { group: { label: 'Gruppe' }, label: { label: 'Bezeichnung' }, value: { label: 'Wert' } },
  },

  // ── Navigation ──
  menu_section: {
    name: '🧭 Hauptmenü: Punkt',
    hint: 'Ein Punkt im Hauptmenü. Mit Spalten klappt er auf, ohne Spalten ist er ein einfacher Link.',
    fields: {
      label: { label: 'Text' },
      page: { label: 'Übersichtsseite', hint: 'Im aufgeklappten Menü als «Zur Übersicht» verlinkt.' },
      path: { label: 'Pfad', hint: 'Nur wenn keine Seite passt, z. B. /shop.' },
      columns: { label: 'Spalten' },
      footer_links: { label: 'Links unter den Spalten' },
      is_shop: {
        label: 'Ist der Online-Shop',
        hint: 'Einschalten beim Menüpunkt des Shops. Er steht dann als letzter Punkt.',
      },
    },
  },
  menu_column: {
    name: '📂 Hauptmenü: Spalte',
    hint: 'Eine Spalte mit Überschrift im aufgeklappten Menü.',
    fields: {
      title: { label: 'Überschrift' },
      links: { label: 'Links' },
      overview_label: { label: 'Text des Links «Alle …»', hint: 'z. B. «Alle Leistungen». Leer: kein Link.' },
      page: { label: 'Ziel des Links «Alle …»' },
      overview_path: { label: 'Pfad des Links «Alle …»', hint: 'Nur wenn keine Seite passt, z. B. /shop/alle-leuchten.' },
    },
  },
  menu_link: {
    name: '🔗 Hauptmenü: Link',
    hint: 'Ein Link im Menü: auf eine Seite, eine Shop-Kategorie oder einen Pfad.',
    fields: {
      label: { label: 'Text' },
      page: { label: 'Seite', hint: 'Wenn gesetzt, gilt die Seite.' },
      shop_category: { label: 'Shop-Kategorie' },
      path: { label: 'Pfad', hint: 'Nur wenn nichts anderes passt, z. B. /ueber-uns/showroom#hersteller.' },
    },
  },
  footer_navigation_group: {
    name: '📂 Fusszeile: Link-Gruppe',
    fields: { title: { label: 'Überschrift' }, links: { label: 'Links' } },
  },
  footer_link: {
    name: '🔗 Fusszeile: Link',
    fields: {
      label: { label: 'Text' },
      href: { label: 'Pfad oder Adresse', hint: 'z. B. /lampenschirme oder /shop/kategorien/pendelleuchte.' },
    },
  },

  // ── Models ──
  page: {
    name: '📄 Seite',
    hint: 'Eine Seite der Website. Unterseiten entstehen, indem Sie eine Seite in der Liste unter eine andere ziehen.',
    fields: {
      title: { label: 'Titel', hint: 'Erscheint als grosse Überschrift, im Menü-Pfad (Breadcrumb) und im Browser-Tab.' },
      slug: {
        label: 'Adresse (Slug)',
        hint: 'Letzter Teil der Adresse, z. B. «nach-mass». Nach dem Veröffentlichen nicht mehr ändern, sonst funktionieren alte Links nicht mehr.',
      },
      content: { label: 'Inhalt', hint: 'Blöcke mit «+» hinzufügen und per Ziehen sortieren.' },
      is_article: { label: 'Ist ein Magazin-Artikel', hint: 'Für Beiträge im Magazin: Google zeigt dann das Datum an.' },
      teaser_eyebrow: { label: 'Dachzeile' },
      teaser_title: { label: 'Titel', hint: 'Leer: Titel der Seite.' },
      teaser_description: { label: 'Kurzbeschreibung', hint: 'Ein bis zwei Sätze.' },
      teaser_image: { label: 'Bild' },
      teaser_link_text: { label: 'Link-Text' },
      seometatags: { label: 'Google & Social Media', hint: 'Titel und Beschreibung für Google sowie das Bild beim Teilen.' },
    },
    fieldsets: [
      {
        title: '🎫 Vorschau-Karte',
        hint: 'So erscheint die Seite als Kachel auf anderen Seiten und im Menü.',
        fields: ['teaser_eyebrow', 'teaser_title', 'teaser_description', 'teaser_image', 'teaser_link_text'],
      },
      {
        title: '🔍 Google & Adresse',
        hint: 'Adresse der Seite und Angaben für Suchmaschinen.',
        fields: ['slug', 'seometatags', 'is_article'],
      },
    ],
    options: {
      teaser_link_text: [
        { label: 'Mehr erfahren', value: 'Mehr erfahren' },
        { label: 'Projekt ansehen', value: 'Projekt ansehen' },
        { label: 'Beitrag lesen', value: 'Beitrag lesen' },
      ],
    },
  },
  project: {
    name: '🏗️ Projekt',
    hint: 'Ein Referenzprojekt. Erscheint unter /projekte/<adresse>, in der Projektübersicht, in seinem Bereich und auf den Seiten seiner Leistungen.',
    fields: {
      title: { label: 'Titel' },
      slug: { label: 'Adresse (Slug)', hint: 'Nach dem Veröffentlichen nicht mehr ändern.' },
      client: { label: 'Kunde' },
      location: { label: 'Ort' },
      year: { label: 'Jahr' },
      area: { label: 'Bereich', hint: 'z. B. Gastronomie oder Zuhause. Neue Bereiche unter «Projekt-Bereiche».' },
      services: {
        label: 'Leistungen',
        hint: 'Seiten der Leistungen, z. B. Lichtplanung. Das Projekt erscheint dort automatisch.',
      },
      teaser_description: { label: 'Kurzbeschreibung', hint: 'Ein bis zwei Sätze für die Kacheln.' },
      teaser_image: { label: 'Titelbild', hint: 'Für Kacheln und Menü. Querformat.' },
      testimonial: { label: 'Kundenstimme' },
      featured: {
        label: 'Hervorheben',
        hint: 'Hervorgehobene Projekte stehen zuerst und erscheinen, wo kein passendes Projekt gefunden wird.',
      },
      content: { label: 'Inhalt', hint: 'Der erste Block (Titel und Einleitung) steht über den Fakten, der Rest darunter.' },
      seo: { label: 'Google & Social Media' },
    },
    fieldsets: [
      { title: '📋 Fakten', fields: ['client', 'location', 'year', 'area', 'services'] },
      { title: '🎫 Vorschau-Karte', fields: ['teaser_description', 'teaser_image', 'featured'] },
      { title: '🔍 Google & Adresse', fields: ['slug', 'seo'] },
    ],
  },
  project_area: {
    name: '🗂️ Projekt-Bereich',
    hint: 'Bereich für Projekte, z. B. Gastronomie. Jeder Bereich hat eine eigene Seite unter /projekte/<adresse>.',
    fields: {
      name: { label: 'Name' },
      slug: { label: 'Adresse (Slug)', hint: 'Nach dem Veröffentlichen nicht mehr ändern.' },
      intro: { label: 'Einleitung', hint: 'Erscheint auf der Bereichsseite unter den Knöpfen.' },
      image: { label: 'Bild' },
      seo: { label: 'Google & Social Media' },
    },
  },
  faq: {
    name: '❓ FAQ',
    hint: 'Eine Frage mit Antwort. Erscheint auf der Seite «FAQ» und überall, wo sie in einem Block «Häufige Fragen» ausgewählt ist.',
    fields: {
      question: { label: 'Frage' },
      answer: { label: 'Antwort', hint: 'Kurz und klar. Ein Absatz pro Gedanke.' },
      topic: { label: 'Thema' },
      slug: { label: 'Sprungmarke', hint: 'Wird automatisch erzeugt.' },
      sort_order: { label: 'Reihenfolge', hint: 'Kleinere Zahl steht weiter oben.' },
    },
  },
  faq_topic: {
    name: '🏷️ FAQ-Thema',
    hint: 'Themen, nach denen die Fragen auf der Seite «FAQ» gruppiert sind.',
    fields: {
      title: { label: 'Titel' },
      slug: { label: 'Sprungmarke', hint: 'Wird automatisch erzeugt.' },
      sort_order: { label: 'Reihenfolge', hint: 'Kleinere Zahl steht weiter oben.' },
    },
  },
  employee: {
    name: '💁 Mitarbeiter/in',
    fields: {
      firstname: { label: 'Vorname' },
      lastname: { label: 'Nachname' },
      function: { label: 'Funktion', hint: 'z. B. Inhaberin, Lichtplaner.' },
      bio: { label: 'Kurzbiografie', hint: 'Ein Satz.' },
      image: { label: 'Bild', hint: 'Hochformat oder quadratisch.' },
      phone: { label: 'Telefon' },
      email: { label: 'E-Mail' },
      appointment_text: { label: 'Termin: Text', hint: 'z. B. «Termin vereinbaren». Erscheint im Block «Ansprechperson».' },
      appointment_link: { label: 'Termin: Seite' },
      appointment_anchor_link: { label: 'Termin: Sprungmarke', hint: 'z. B. #termin.' },
    },
    fieldsets: [
      {
        title: '📅 Termin-Knopf',
        hint: 'Optional: Knopf im Block «Ansprechperson».',
        fields: ['appointment_text', 'appointment_link', 'appointment_anchor_link'],
      },
    ],
  },
  testimonial: {
    name: '💬 Kundenstimme',
    fields: {
      text: { label: 'Zitat' },
      author_image: { label: 'Bild der Person' },
      author_name: { label: 'Name' },
      author_function: { label: 'Funktion', hint: 'z. B. Geschäftsführerin.' },
      company_name: { label: 'Firma' },
      company_url: { label: 'Webseite der Firma', hint: 'Mit https://.' },
    },
  },
  redirect: {
    name: '↪️ Weiterleitung',
    hint: 'Leitet eine alte Adresse dauerhaft auf eine neue um (z. B. nach dem Umbenennen einer Seite). Gilt ab der nächsten Veröffentlichung der Website.',
    fields: {
      source: {
        label: 'Alte Adresse',
        hint: 'Ohne Domain, z. B. /angebot/lampenschirme. Mit «:path*» am Ende werden auch alle Unterseiten weitergeleitet.',
      },
      destination: { label: 'Neue Adresse', hint: 'Ohne Domain, z. B. /lampenschirme.' },
    },
  },
  shop_product: {
    name: '🛒 Produkt',
    fields: {
      active: { label: 'Im Shop sichtbar' },
      featured: { label: 'Als Bestseller hervorheben', hint: 'Erscheint im Block «Shop: Bestseller».' },
      featured_sort: { label: 'Reihenfolge bei den Bestsellern', hint: 'Kleinere Zahl steht weiter vorne.' },
      slug: { label: 'Adresse (Slug)', hint: 'Nach dem Veröffentlichen nicht mehr ändern.' },
      price: { label: 'Preis (CHF)', hint: 'Gilt für alle Varianten ohne eigenen Preis.' },
      shipping_cost: { label: 'Versandkosten (CHF)', hint: 'Pro Stück. Leer: 15 CHF.' },
      delivery_time: { label: 'Lieferzeit', hint: 'z. B. «2–3 Wochen».' },
      variants: { label: 'Varianten', hint: 'Eine Zeile pro kaufbare Kombination, z. B. Grösse S in Weiss für CHF 380.' },
      seo_title: { label: 'Titel bei Google', hint: 'Ca. 60 Zeichen. Leer: Produktname.' },
      seo_description: { label: 'Beschreibung bei Google', hint: 'Ca. 150 Zeichen.' },
      seo_noindex: { label: 'Nicht bei Google anzeigen' },
      showroom_note: { label: 'Hinweis zum Showroom', hint: 'z. B. «Im Showroom in Goldach ausgestellt».' },
    },
  },
  shop_category: {
    name: '🏷️ Shop-Kategorie',
    fields: {
      slug: { label: 'Adresse (Slug)', hint: 'Nach dem Veröffentlichen nicht mehr ändern.' },
      show_in_shop: { label: 'Im Shop anzeigen', hint: 'Erscheint in den Kategorien-Blöcken des Shops.' },
      seo_title: { label: 'Titel bei Google', hint: 'Ca. 60 Zeichen. Leer: Name der Kategorie.' },
      seo_description: { label: 'Beschreibung bei Google', hint: 'Ca. 150 Zeichen.' },
      seo_noindex: { label: 'Nicht bei Google anzeigen' },
    },
  },
  shop_page: {
    name: '🛒 Shop-Startseite',
    fields: { sections: { label: 'Inhalt' }, seo: { label: 'Google & Social Media' } },
  },
  header_footer: {
    name: '⚙️ Kopf- & Fusszeile',
    hint: 'Menü, Adresse, Öffnungszeiten und Links, die auf jeder Seite erscheinen.',
    fields: {
      main_menu: { label: 'Hauptmenü', hint: 'Die Punkte oben in der Navigation, in dieser Reihenfolge.' },
      appointment_label: { label: 'Kontakt-Knopf: Text', hint: 'Knopf oben rechts, z. B. «Kontakt».' },
      appointment_page: { label: 'Kontakt-Knopf: Seite' },
      footer_navigation: { label: 'Link-Gruppen der Fusszeile' },
      contact_page: { label: 'Kontaktseite', hint: 'Ziel von «Fragen zu dieser Leuchte?» im Shop.' },
      privacy_page: {
        label: 'Datenschutzseite',
        hint: 'Verlinkt in der Fusszeile, im Cookie-Hinweis und beim Kontaktformular.',
      },
      maps_link: { label: 'Google-Maps-Link', hint: 'In Google Maps auf «Teilen» klicken und den Link kopieren.' },
      holiday_disable: { label: 'Ferienhinweis ausblenden' },
      opening_hours_text: { label: 'Öffnungszeiten' },
      opening_hours_title: { label: 'Überschrift' },
      holiday_title: { label: 'Überschrift' },
      holiday_text: { label: 'Text', hint: 'z. B. «Vom 22. Dezember bis 5. Januar geschlossen.»' },
    },
  },
  company_profile: {
    name: '🏢 Firmenprofil für Google & KI',
    hint: 'Angaben für Suchmaschinen und KI-Assistenten wie ChatGPT. Adresse, Telefon und E-Mail kommen aus «Kopf- & Fusszeile».',
  },
  schema_migration: {
    name: '🔒 Technisch: Migrationen',
    hint: 'Wird automatisch gepflegt. Bitte nichts ändern.',
    fields: { name: { label: 'Datei' } },
  },
};

const withScreenshot = (apiKey, hint) => (SCREENSHOTS[apiKey] ? `${SCREENSHOTS[apiKey]} ${hint ?? ''}`.trim() : hint);

module.exports = async (client) => {
  const itemTypes = await client.itemTypes.list();

  for (const itemType of itemTypes) {
    const spec = SCHEMA[itemType.api_key];
    const fields = await client.fields.list(itemType.id);
    const fieldByKey = Object.fromEntries(fields.map((field) => [field.api_key, field]));

    if (spec) {
      await client.itemTypes.update(itemType.id, {
        name: spec.name,
        hint: withScreenshot(itemType.api_key, spec.hint ?? itemType.hint),
      });
    }

    // Spacing is rarely changed: last in every block (blocks cannot have groups).
    const lastPosition = Math.max(...fields.map((field) => field.position));
    for (const [offset, key] of ['disable_margin_top', 'disable_margin_bottom'].entries()) {
      if (fieldByKey[key]) {
        await client.fields.update(fieldByKey[key].id, { position: lastPosition + 1 + offset });
      }
    }

    // Groups (models only): created once, fields moved in, collapsed.
    const fieldsets = itemType.modular_block ? [] : (spec?.fieldsets ?? []);
    const existingFieldsets = await client.fieldsets.list(itemType.id);
    for (const [index, set] of fieldsets.entries()) {
      const fieldset =
        existingFieldsets.find((existing) => existing.title === set.title) ??
        (await client.fieldsets.create(itemType.id, {
          title: set.title,
          hint: set.hint ?? null,
          collapsible: true,
          start_collapsed: true,
          position: 100 + index,
        }));
      for (const key of set.fields) {
        if (fieldByKey[key]) {
          await client.fields.update(fieldByKey[key].id, { fieldset: { id: fieldset.id, type: 'fieldset' } });
        }
      }
    }

    const fieldSpecs = { ...(fieldByKey.disable_margin_top ? MARGIN_FIELDS : {}), ...(spec?.fields ?? {}) };
    for (const [key, fieldSpec] of Object.entries(fieldSpecs)) {
      const field = fieldByKey[key];
      if (!field) {
        continue;
      }
      const options = spec?.options?.[key];
      const appearance = options
        ? {
            ...field.appearance,
            parameters: {
              ...field.appearance.parameters,
              [field.appearance.editor === 'string_radio_group' ? 'radios' : 'options']: options.map((option) => ({
                hint: '',
                ...option,
              })),
            },
          }
        : undefined;
      await client.fields.update(field.id, {
        label: fieldSpec.label,
        ...(fieldSpec.hint !== undefined ? { hint: fieldSpec.hint } : {}),
        ...(appearance ? { appearance } : {}),
      });
    }
  }
};
