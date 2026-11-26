'use strict';

/**
 * A project in the projects teaser (home page) can point at the project record itself: its picture and URL come from
 * there. Links (the `link` block) can only point at pages.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const item = await client.itemTypes.find('highlight_project_item');
  const project = await client.itemTypes.find('project');

  await client.fields.create(item.id, {
    api_key: 'project',
    label: 'Projekt',
    field_type: 'link',
    hint: 'Das Referenzprojekt: Bild und Link kommen vom Projekt. Ohne Projekt gilt der Link darunter.',
    validators: {
      item_item_type: {
        item_types: [project.id],
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
      },
    },
    position: 0,
  });
};
