import type { ItemPropertyDefinitionInput } from "../data";

export const descriptionPropertyDefinition: ItemPropertyDefinitionInput = {
  key: "description",
  label: "Description",
  type: "string",

  presentation: {
    region: "body",
    order: 5,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "textarea",
    options: JSON.stringify({}),
  },
};
