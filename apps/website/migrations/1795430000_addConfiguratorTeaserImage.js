'use strict';

/**
 * Both configurator teasers can show a picture, e.g. a screenshot of the 3D view, instead of the drawn lamp.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  for (const [model, apiKey] of [
    ['configurator_teaser', 'image'],
    ['lampshade_configurator', 'teaser_image'],
  ]) {
    const block = await client.itemTypes.find(model);
    await client.fields.create(block.id, {
      api_key: apiKey,
      label: 'Bild',
      field_type: 'file',
      hint: 'Am besten ein Bild aus dem 3D-Konfigurator. Leer: eine gezeichnete, leuchtende Lampe.',
      validators: { extension: { predefined_list: 'image' } },
    });
  }
};
