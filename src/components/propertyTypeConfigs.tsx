///Each property type maps to a preview and editor component
import type React from "react";
import type {
  ItemPropertyDefinitionValue,
  PropertyType,
  PropertyValue,
} from "@/coTypes/data";
import { BooleanPreview } from "./propertyViews/BooleanPreView";
import { DatePreview } from "./propertyViews/DatePreview";
import { EnumPreview } from "./propertyViews/EnumPreView";
import { NumberPreview } from "./propertyViews/NumberPreview";
import { StringPreview } from "./propertyViews/StringPreview";
import { TagsPreview } from "./propertyViews/TagsPreview";

type PropertyTypeConfig = {
  preview?: React.ComponentType<{
    value: PropertyValue;
    propDef: ItemPropertyDefinitionValue;
    onOpenEditor?: () => void;
    onChange?: (v: PropertyValue) => void;
  }>;
  editor?: React.ComponentType<{
    value: PropertyValue;
    propDef: ItemPropertyDefinitionValue;
    onChange?: (v: PropertyValue) => void;
  }>;
};

export const propertyTypeRegistry: Record<PropertyType, PropertyTypeConfig> = {
  calendarEntry: {
    preview: undefined,
    editor: undefined,
  },
  string: {
    preview: StringPreview,
    editor: undefined,
  },
  number: {
    preview: NumberPreview,
    editor: undefined,
  },
  boolean: {
    preview: BooleanPreview,
    editor: undefined,
  },
  date: {
    preview: DatePreview,
    editor: undefined,
  },
  enum: {
    preview: EnumPreview,
    editor: undefined,
  },
  tags: {
    preview: TagsPreview,
    editor: undefined,
  },
};
