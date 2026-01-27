import type { ItemPropertyDefinitionInput } from "../data";

export const tagsPropertyDefinition: ItemPropertyDefinitionInput = {
  key: "tags",
  label: "Tags",
  type: "tags",

  presentation: {
    region: "body",
    order: 8,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "tagInput",
    options: JSON.stringify({}),
  },
};
