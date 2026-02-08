import { co, z } from "jazz-tools";

// ============ Property Value Types ============

const calendarEntryValueSchema = z.object({
  start: z.string(), // ISO datetime
  end: z.string(), // ISO datetime
  allDay: z.boolean().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
});

const propertyValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  z.array(z.string()), // for tags
  calendarEntryValueSchema,
  z.literal(null),
]);

// If you want a TS type for property values:
export type PropertyValue = z.infer<typeof propertyValueSchema>;

// ============ Property Type Enum ============

const propertyTypeEnum = z.enum([
  "string",
  "number",
  "boolean",
  "date",
  "enum",
  "calendarEntry",
  "tags",
]);
export type PropertyType = z.infer<typeof propertyTypeEnum>;

// ============ Presentation Configuration ============

const presentationConfigSchema = z.object({
  region: z
    .enum(["header", "subtitle", "badges", "sidebar", "body"])
    .optional(),
  variant: z.enum(["chip", "text", "icon+text", "preview"]).optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  hideLabel: z.boolean().optional(),
  interaction: z
    .enum(["none", "inlineEditor", "modalEditor", "drawerEditor"])
    .optional(),
});
export type PresentationConfig = z.infer<typeof presentationConfigSchema>;

// ============ Editor Configuration ============

const editorConfigSchema = z.object({
  widget: z
    .enum([
      "textbox",
      "textarea",
      "dropdown",
      "datePicker",
      "checkbox",
      "switch",
      "slider",
      "colorPicker",
      "tagInput",
      "calendarEntryEditor",
    ])
    .optional(),
  options: z.string().optional(), // JSON string for widget-specific options
});
export type EditorConfig = z.infer<typeof editorConfigSchema>;

// ============ Decorator Rules ============

const decoratorBadgeSchema = z.object({
  text: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
});
export type DecoratorBadge = z.infer<typeof decoratorBadgeSchema>;

const decoratorRuleSchema = z.object({
  when: z.object({
    equals: z
      .union([propertyValueSchema, z.array(propertyValueSchema)])
      .optional(),
  }),
  apply: z.object({
    cardColor: z.string().optional(),
    borderColor: z.string().optional(),
    leftBarColor: z.string().optional(),
    textColor: z.string().optional(),
    badge: decoratorBadgeSchema.optional(),
  }),
});
export type DecoratorRule = z.infer<typeof decoratorRuleSchema>;

// ============ Views Configuration ============

const propertyViewsConfigSchema = z.record(
  z.string(),
  z.string(), // JSON string for view-specific config (kanban, table, calendar, etc.)
);
export type PropertyViewsConfig = z.infer<typeof propertyViewsConfigSchema>;

// ============ View Definitions ============

const viewTypeEnum = z.enum(["table", "kanban", "calendar", "list"]);
export type ViewType = z.infer<typeof viewTypeEnum>;

const viewDefinitionSchema = z.object({
  name: z.string(),
  type: viewTypeEnum,
  visiblePropertyKeys: z.array(z.string()).optional(),
  sortKey: z.string().optional(),
  groupBy: z.string().optional(),
  filters: z.string().optional(), // JSON string for filter definitions
});
export type ViewDefinition = z.infer<typeof viewDefinitionSchema>;

export const ViewDefinitionMap = co.map({
  name: z.string(),
  type: viewTypeEnum,
  visiblePropertyKeys: z.array(z.string()).optional(),
  sortKey: z.string().optional(),
  groupBy: z.string().optional(),
  filters: z.string().optional(),
});
export type ViewDefinitionInput = co.input<typeof ViewDefinitionMap>;
export type ViewDefinitionValue = co.loaded<typeof ViewDefinitionMap>;

// ============ Item Property Definition (Jazz) ============

export const ItemPropertyDefinition = co.map({
  key: z.string(), // used as key in item.values[key]
  label: z.string(),
  type: propertyTypeEnum,
  presentation: presentationConfigSchema.optional(),
  editor: editorConfigSchema.optional(),
  decorators: z.array(decoratorRuleSchema).optional(),
  views: propertyViewsConfigSchema.optional(),
});

export type ItemPropertyDefinitionInput = co.input<
  typeof ItemPropertyDefinition
>;
export type ItemPropertyDefinitionValue = co.loaded<
  typeof ItemPropertyDefinition
>;

export const ItemValues = co.record(z.string(), propertyValueSchema);
// ============ Item (Jazz) ============

export const Item = co.map({
  // We already have $jazz.id as the identity
  title: z.string(),
  values: ItemValues,
});

export type ItemInput = co.input<typeof Item>;
export type ItemValue = co.loaded<typeof Item>;

const ItemList = co.list(Item);
// ============ Project (Jazz) ============

export const Project = co.map({
  name: z.string().min(1, "Project name cannot be empty"),
  description: z.string().optional(),
  createdAt: z.date(),
  //users: co.list(MyAppAccount),
  propertyDefinitions: co.list(ItemPropertyDefinition),
  views: co.optional(co.list(ViewDefinitionMap)),

  get items(): co.List<typeof Item> {
    return ItemList;
  },
});

export type ProjectInput = co.input<typeof Project>;
export type ProjectValue = co.loaded<typeof Project>;

// ============ Decorations Logic ============

// Apply for an item, to get its decorations from its properties
// (To be used on item cards, etc.)
export function computeItemDecorations(
  item: ItemInput,
  defs: readonly ItemPropertyDefinitionInput[],
) {
  const base = {
    cardColor: undefined as string | undefined,
    borderColor: undefined as string | undefined,
    leftBarColor: undefined as string | undefined,
    textColor: undefined as string | undefined,
    badges: [] as { text: string; color?: string; icon?: string }[],
  };

  return defs.reduce((acc, def) => {
    const value = item.values[def.key];

    def.decorators?.forEach((rule) => {
      const eq = rule.when.equals;

      // simple "equals" / "in array" matcher
      const match =
        Array.isArray(eq) && typeof value === "string"
          ? eq.includes(value)
          : value === eq;

      if (!match) return;

      // merge visual rules
      if (rule.apply.cardColor) acc.cardColor = rule.apply.cardColor;
      if (rule.apply.borderColor) acc.borderColor = rule.apply.borderColor;
      if (rule.apply.leftBarColor) acc.leftBarColor = rule.apply.leftBarColor;
      if (rule.apply.textColor) acc.textColor = rule.apply.textColor;
      if (rule.apply.badge) acc.badges.push(rule.apply.badge);
    });

    return acc;
  }, base);
}
