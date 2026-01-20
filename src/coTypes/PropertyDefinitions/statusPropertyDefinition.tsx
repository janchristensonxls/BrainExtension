import type { ItemPropertyDefinitionInput } from "../data";

export const statusPropertyDefinition: ItemPropertyDefinitionInput = {
  key: "status", // <- used in item.values["status"]
  label: "Status",
  type: "enum",

  presentation: {
    region: "body",
    //variant: "chip",
    icon: "flag",
    order: 10,
    hideLabel: false,
    interaction: "inlineEditor",
  },

  editor: {
    widget: "dropdown",
    // your schema says `options: z.string()` → JSON string
    options: JSON.stringify({
      values: ["New", "In progress", "Blocked", "Done"],
    }),
  },

  decorators: [
    {
      when: { equals: "Blocked" },
      apply: {
        leftBarColor: "#ff4d4f",
        badge: {
          text: "Blocked",
          color: "#ff4d4f",
          icon: "alert-circle",
        },
      },
    },
    {
      when: { equals: "Done" },
      apply: {
        leftBarColor: "#52c41a",
        badge: {
          text: "Done",
          color: "#52c41a",
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
