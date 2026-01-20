import type { ItemPropertyDefinitionInput } from "../data";

export const isCompletedPropertyDefinition: ItemPropertyDefinitionInput = {
  key: "isCompleted",
  label: "Completed",
  type: "boolean",

  presentation: {
    region: "body",
    //variant: "chip",
    //icon: "flag",
    order: 1,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "switch",
    // your schema says `options: z.string()` → JSON string
    options: JSON.stringify({}),
  },

  decorators: [
    {
      when: { equals: true },
      apply: {
        leftBarColor: "#4dff7aff",
        badge: {
          text: "Completed",
          color: "#4dff7aff",
          icon: "check",
        },
      },
    },
  ],

  // views is z.record(z.string(), z.string()) → JSON per view
  // views: {
  //   kanban: JSON.stringify({ laneKey: true, showOnCard: true }),
  //   table: JSON.stringify({ column: true, order: 2 }),
  // },
};
