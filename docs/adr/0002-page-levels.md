# 0002: Drei Seitenstufen für Inhaltsseiten

## Kontext

Die Inhaltsseiten (`/lampenschirme`, `/licht-planen`, `/ueber-uns` …) sind ein Baum mit bis zu drei Stufen. Bisher
war jede Seite eine freie Abfolge von Blöcken: Übersichtsseiten hatten eigene Texte, Galerien und von Hand gepflegte
Kachel-Listen, Detailseiten fingen mal mit Bild, mal mit Text an. Man sah einer Seite nicht an, ob sie Übersicht oder
Detail ist, und die Kacheln zu Unterseiten mussten doppelt gepflegt werden.

## Entscheid

Die Stufe einer Seite ergibt sich aus ihrer Lage im Baum, nicht aus einem Feld:

| Stufe | Regel | Beispiel | Aufbau |
|---|---|---|---|
| **Bereich** | oberste Ebene, hat Unterseiten | `/lampenschirme`, `/licht-planen` | Seitenkopf über die ganze Breite, darunter je Unterseite eine grosse Karte mit deren Unterseiten als Links, danach wenig eigener Inhalt (Fakten, Projekte, Zitat), Kontakt |
| **Übersicht** | tiefer, hat Unterseiten | `/lampenschirme/leistungen` | mittlerer Seitenkopf, darunter die Unterseiten als Karten, danach FAQ und Kontakt |
| **Detail** | keine Unterseiten | `/lampenschirme/leistungen/nach-mass` | Leselayout (`DetailPage`): H1 und Lead in Lesebreite, breites Bild, darunter ein Balken mit der Ansprechperson samt «Termin vereinbaren», dann der Inhalt über die ganze Spalte, am Schluss «Mehr zum Thema» mit den Geschwisterseiten |

Kopf und Bild kommen auf allen Stufen aus drei Seitenfeldern (Gruppe «Seitenkopf»): `headline` (leer: Seitentitel),
`intro` und `hero_image` (leer: Bild der Vorschau-Karte). Die Stufe erkennt man an der Farbe des Kopfs (`PageHero`, Text
links, Bild rechts): Bereich dunkelblau (`band-wehrli`, schliesst an die Navigation an, weisse Schrift, grösstes Bild),
Übersicht hellblau (`band-wehrli-50`), Detail weiss als Lesekopf mit breitem Bild darunter. Seitentitel haben auf allen Stufen die Grösse `text-title`.

Detailseiten zeigen kein Inhaltsverzeichnis, nur die Ansprechperson als Balken. Die Ansprechperson
ist auf allen Detailseiten dieselbe (Feld «Ansprechperson auf Detailseiten» in «Header & Footer»); Kontaktblöcke am
Seitenende fallen dort weg. Mit «Schlichter Seitenkopf» (`plain_header`) zeigt eine Detailseite nur Titel und
Einleitung, ohne Kopfbild und Box, für Seiten, deren Inhalt gleich beginnen soll (Team, Kontakt, Konfigurator …).
Jede Seite ohne Unterseiten nutzt dieses Layout, egal welche Blöcke sie hat
(Kontakt, Team, Konfigurator …). Einzige Ausnahme: eine Listen-Seite auf oberster Ebene (Projektübersicht oder
Shop-Kategorien, z. B. `/projekte`) gilt als Bereich.

Die **Karten** zu Unterseiten kommen automatisch aus den Vorschau-Feldern der Unterseiten (Eyebrow, Titel,
Beschreibung, Bild, Linktext), in der Reihenfolge des Baums. Eine neue Unterseite erscheint ohne weitere Pflege.
Kachel-Raster (Seiten-Teaser, Projekte, Karten) haben überall 4 Spalten (`CARD_COLUMNS` in `layout/grid`), auch bei
nur 1–3 Karten: Eine einzelne Karte wird so nie halb oder ganz breit, die Reihe füllt sich von links. Auf Tablets 2,
auf dem Handy 1 Spalte. Textspalten (`TextTwoColumnsBlock`) sind davon ausgenommen.

Am Ende jeder Detailseite mit Elternseite steht `RelatedPagesBlock`: «Mehr zum Thema …» mit den Geschwisterseiten und
«Zurück zu …» auf die Übersicht; ohne Geschwister nur der Weg zurück.

Seiten ohne `intro` und Bild (z. B. Rechtliches) zeigen nur Breadcrumbs und H1.

Breadcrumbs und H1 stehen auf allen Stufen und auf den eigenen Routen (FAQ, Shop, Projekte) exakt am selben Ort:
alle Seitenköpfe nutzen `PAGE_HEAD_TOP` und `BREADCRUMBS_GAP` aus `layout/page-head`, eigene Routen
`PageHeadBreadcrumbs`. Text neben einem Bild ist oben ausgerichtet, nicht zentriert.

## Folgen

- Redaktion pflegt Übersichtsseiten fast nur noch über die Vorschau-Felder ihrer Unterseiten.
- Ein H1-Textblock am Seitenanfang ist überflüssig; die H1 steht im Seitenkopf.
- Interne Verlinkung ist einheitlich: Bereich → Übersicht → Detail und Detail ↔ Geschwister.
- Bilder in Text-Bild-Blöcken stehen immer rechts; das Feld «Layout» des Blocks wird nicht mehr ausgewertet.
- Die Migrationen `1795470000_addPageHeader`, `1795480000_addDetailContact`, `1795490000_addPlainDetailHeader` und `1795500000_addCardPreview` müssen vor dem Merge auch in der Ziel-Umgebung laufen, und die Inhalte
  brauchen dieselbe Umstellung wie in der Sandbox `nav-v3`.
