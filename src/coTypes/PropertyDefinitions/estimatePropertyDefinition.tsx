import type { ItemPropertyDefinitionInput } from "../data";

export const estimatePropertyDefinition: ItemPropertyDefinitionInput = {
  key: "estimate",
  label: "Estimate",
  type: "number",

  presentation: {
    region: "body",
    order: 6,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "textbox",
    options: JSON.stringify({}),
  },
};
