'use strict';

/**
 * Projects as their own model instead of pages:
 * - «Projekt-Bereich» (e.g. Gastronomie, Büro): overview pages under /projekte/<slug>
 * - «Projekt»: facts (client, place, year, area, services), teaser, featured flag and content blocks like a page
 * - Blocks «Projekte zu einem Thema» (on service pages) and «Projektübersicht» (all projects with filter)
 * Additive only: existing project pages stay until their content has been moved.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const pageModel = await client.itemTypes.find('page');
  const testimonialModel = await client.itemTypes.find('testimonial');
  const pageContent = (await client.fields.list(pageModel.id)).find((field) => field.api_key === 'content');

  const area = await client.itemTypes.create({
    name: '🗂️ Projekt-Bereich',
    api_key: 'project_area',
    sortable: true,
    hint: 'Bereich für Projekte, z. B. Gastronomie oder Büro. Jeder Bereich hat eine Übersichtsseite unter /projekte/<slug>.',
  });
  const areaName = await client.fields.create(area.id, {
    api_key: 'name',
    label: 'Name',
    field_type: 'string',
    validators: { required: {} },
  });
  await client.fields.create(area.id, {
    api_key: 'slug',
    label: 'Slug',
    field_type: 'slug',
    validators: {
      required: {},
      unique: {},
      slug_title_field: { title_field_id: areaName.id },
      slug_format: { predefined_pattern: 'webpage_slug' },
    },
  });
  await client.fields.create(area.id, {
    api_key: 'intro',
    label: 'Einleitung',
    field_type: 'text',
    hint: 'Text oben auf der Bereichsseite.',
  });
  await client.fields.create(area.id, {
    api_key: 'image',
    label: 'Bild',
    field_type: 'file',
    hint: 'Für Kacheln und das Menü.',
  });
  await client.fields.create(area.id, { api_key: 'seo', label: 'SEO', field_type: 'seo' });
  await client.itemTypes.update(area.id, { title_field: { id: areaName.id, type: 'field' } });

  const project = await client.itemTypes.create({
    name: '🏗️ Projekt',
    api_key: 'project',
    hint: 'Ein Referenzprojekt. Erscheint unter /projekte/<slug>, in der Übersicht, in seinem Bereich und auf den Seiten seiner Leistungen.',
  });
  const projectTitle = await client.fields.create(project.id, {
    api_key: 'title',
    label: 'Titel',
    field_type: 'string',
    validators: { required: {} },
  });
  await client.fields.create(project.id, {
    api_key: 'slug',
    label: 'Slug',
    field_type: 'slug',
    validators: {
      required: {},
      unique: {},
      slug_title_field: { title_field_id: projectTitle.id },
      slug_format: { predefined_pattern: 'webpage_slug' },
    },
  });
  await client.fields.create(project.id, { api_key: 'client', label: 'Kunde', field_type: 'string' });
  await client.fields.create(project.id, { api_key: 'location', label: 'Ort', field_type: 'string' });
  await client.fields.create(project.id, { api_key: 'year', label: 'Jahr', field_type: 'string' });
  await client.fields.create(project.id, {
    api_key: 'area',
    label: 'Bereich',
    field_type: 'link',
    validators: { required: {}, item_item_type: { item_types: [area.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(project.id, {
    api_key: 'services',
    label: 'Leistungen',
    field_type: 'links',
    hint: 'Angebotsseiten, zu denen das Projekt passt (z. B. Lichtplanung, Lampenschirm nach Mass). Das Projekt erscheint dort automatisch.',
    validators: { items_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'links_select', parameters: {}, addons: [] },
  });
  await client.fields.create(project.id, {
    api_key: 'teaser_description',
    label: 'Kurzbeschreibung',
    field_type: 'text',
    hint: 'Ein bis zwei Sätze für Kacheln und Suchmaschinen.',
  });
  await client.fields.create(project.id, { api_key: 'teaser_image', label: 'Titelbild', field_type: 'file' });
  await client.fields.create(project.id, {
    api_key: 'testimonial',
    label: 'Kundenstimme',
    field_type: 'link',
    validators: { item_item_type: { item_types: [testimonialModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(project.id, {
    api_key: 'featured',
    label: 'Hervorgehoben',
    field_type: 'boolean',
    hint: 'Hervorgehobene Projekte stehen zuerst und erscheinen, wo kein passendes Projekt gefunden wird.',
  });
  await client.fields.create(project.id, {
    api_key: 'content',
    label: 'Inhalt',
    field_type: 'rich_text',
    hint: 'Die Geschichte des Projekts: Text, Bilder, Galerie.',
    validators: { rich_text_blocks: { item_types: pageContent.validators.rich_text_blocks.item_types } },
  });
  await client.fields.create(project.id, { api_key: 'seo', label: 'SEO', field_type: 'seo' });
  await client.itemTypes.update(project.id, { title_field: { id: projectTitle.id, type: 'field' } });

  const projectsBlock = await client.itemTypes.create({
    name: '🏗️ Projekte zu einem Thema',
    api_key: 'projects_block',
    modular_block: true,
    hint: 'Zeigt Projekte eines Bereichs oder einer Leistung. Ohne Auswahl: die hervorgehobenen Projekte.',
  });
  await client.fields.create(projectsBlock.id, { api_key: 'title', label: 'Titel', field_type: 'string' });
  await client.fields.create(projectsBlock.id, {
    api_key: 'area',
    label: 'Bereich',
    field_type: 'link',
    validators: { item_item_type: { item_types: [area.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });
  await client.fields.create(projectsBlock.id, {
    api_key: 'service',
    label: 'Leistung',
    field_type: 'link',
    hint: 'Projekte, die diese Seite unter «Leistungen» haben.',
    validators: { item_item_type: { item_types: [pageModel.id] } },
    appearance: { editor: 'link_select', parameters: {}, addons: [] },
  });

  const overviewBlock = await client.itemTypes.create({
    name: '🏗️ Projektübersicht',
    api_key: 'projects_overview',
    modular_block: true,
    hint: 'Alle Projekte mit Filter nach Bereich.',
  });
  await client.fields.create(overviewBlock.id, {
    api_key: 'all_label',
    label: 'Text für «Alle»',
    field_type: 'string',
    hint: 'Leer: «Alle».',
  });

  await client.fields.update(pageContent.id, {
    validators: {
      ...pageContent.validators,
      rich_text_blocks: {
        item_types: [...pageContent.validators.rich_text_blocks.item_types, projectsBlock.id, overviewBlock.id],
      },
    },
  });
};
