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

const textboxEditorOptionsSchema = z.object({
  inputType: z.enum(["text", "number", "email", "url"]).optional(),
  placeholder: z.string().optional(),
});

const textareaEditorOptionsSchema = z.object({
  rows: z.number().int().positive().optional(),
  placeholder: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
});

const dropdownEditorOptionsSchema = z.object({
  values: z.array(z.string()).optional(),
  allowCustom: z.boolean().optional(),
});

const datePickerEditorOptionsSchema = z.object({
  includeTime: z.boolean().optional(),
  minDateIso: z.string().optional(),
  maxDateIso: z.string().optional(),
});

const checkboxEditorOptionsSchema = z.object({});
const switchEditorOptionsSchema = z.object({});

const sliderEditorOptionsSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
});

const colorPickerEditorOptionsSchema = z.object({
  allowAlpha: z.boolean().optional(),
});

const tagInputEditorOptionsSchema = z.object({
  allowCreate: z.boolean().optional(),
  maxTags: z.number().int().positive().optional(),
});

const calendarEntryEditorOptionsSchema = z.object({
  defaultDurationMinutes: z.number().int().positive().optional(),
  timezone: z.string().optional(),
});

const editorOptionsSchema = z.union([
  textboxEditorOptionsSchema,
  textareaEditorOptionsSchema,
  dropdownEditorOptionsSchema,
  datePickerEditorOptionsSchema,
  checkboxEditorOptionsSchema,
  switchEditorOptionsSchema,
  sliderEditorOptionsSchema,
  colorPickerEditorOptionsSchema,
  tagInputEditorOptionsSchema,
  calendarEntryEditorOptionsSchema,
]);
export type EditorOptions = z.infer<typeof editorOptionsSchema>;

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
  options: editorOptionsSchema.optional(),
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

const tablePropertyViewConfigSchema = z.object({
  column: z.boolean().optional(),
  order: z.number().optional(),
  width: z.number().positive().optional(),
});

const kanbanPropertyViewConfigSchema = z.object({
  laneKey: z.boolean().optional(),
  showOnCard: z.boolean().optional(),
  cardOrder: z.number().optional(),
});

const calendarPropertyViewConfigSchema = z.object({
  useAsStart: z.boolean().optional(),
  useAsEnd: z.boolean().optional(),
  useAsAllDay: z.boolean().optional(),
  eventOrder: z.number().optional(),
});

const listPropertyViewConfigSchema = z.object({
  show: z.boolean().optional(),
  order: z.number().optional(),
});

const propertyViewConfigValueSchema = z.union([
  tablePropertyViewConfigSchema,
  kanbanPropertyViewConfigSchema,
  calendarPropertyViewConfigSchema,
  listPropertyViewConfigSchema,
]);

const propertyViewsConfigSchema = z.record(
  z.string(),
  propertyViewConfigValueSchema,
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
  filters: z
    .object({
      mode: z.enum(["all", "any"]).optional(),
      rules: z.array(
        z.object({
          key: z.string(),
          op: z.enum([
            "eq",
            "neq",
            "contains",
            "startsWith",
            "endsWith",
            "lt",
            "lte",
            "gt",
            "gte",
            "in",
            "notIn",
            "isNull",
            "isNotNull",
          ]),
          value: z
            .union([propertyValueSchema, z.array(propertyValueSchema)])
            .optional(),
        }),
      ),
    })
    .optional(),
});
export type ViewDefinition = z.infer<typeof viewDefinitionSchema>;

export const ViewDefinitionMap = co.map({
  name: z.string(),
  type: viewTypeEnum,
  visiblePropertyKeys: z.array(z.string()).optional(),
  sortKey: z.string().optional(),
  groupBy: z.string().optional(),
  filters: viewDefinitionSchema.shape.filters,
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

const tagMetadataSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  icon: z.string().optional(),
});

const tagsDataSchema = z.record(z.string(), tagMetadataSchema);
export type TagsData = z.infer<typeof tagsDataSchema>;

const projectPropertyValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  tagsDataSchema,
  z.literal(null),
]);

export type ProjectPropertyValue = z.infer<typeof projectPropertyValueSchema>;
export const ProjectPropertyValues = co.record(
  z.string(),
  projectPropertyValueSchema,
);
// ============ Item (Jazz) ============

export const Item = co.map({
  // We already have $jazz.id as the identity
  title: z.string(),
  values: ItemValues,
});

export type ItemInput = co.input<typeof Item>;
export type ItemValue = co.loaded<typeof Item>;
// ============ Project (Jazz) ============

export const Project = co.map({
  name: z.string().min(1, "Project name cannot be empty"),
  description: z.string().optional(),
  createdAt: z.date(),
  //users: co.list(MyAppAccount),
  items: co.list(Item),
  propertyDefinitions: co.list(ItemPropertyDefinition),
  projectValues: co.optional(ProjectPropertyValues),
  views: co.optional(co.list(ViewDefinitionMap)),
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
