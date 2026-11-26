'use strict';

/**
 * The shop start page can show the configurator teaser, so buyers find the configurator right in the shop.
 *
 * @param client { import("@datocms/cli/lib/cma-client-node").Client }
 */
module.exports = async (client) => {
  const teaser = await client.itemTypes.find('configurator_teaser');
  const sections = await client.fields.find('shop_page::sections');
  const allowed = sections.validators.rich_text_blocks.item_types;

  if (!allowed.includes(teaser.id)) {
    await client.fields.update(sections.id, {
      validators: { ...sections.validators, rich_text_blocks: { item_types: [...allowed, teaser.id] } },
    });
  }
};
