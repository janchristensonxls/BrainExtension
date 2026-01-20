import type { ItemPropertyDefinitionInput } from "../data";

export const dueDatePropertyDefinition: ItemPropertyDefinitionInput = {
  key: "dueDate",
  label: "Due date",
  type: "date",

  presentation: {
    region: "body",
    order: 7,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "datePicker",
    options: JSON.stringify({}),
  },
};
