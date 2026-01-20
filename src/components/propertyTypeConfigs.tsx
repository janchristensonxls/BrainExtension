///Each property type maps to a preview and editor component
import type React from "react";
import {
  type ItemPropertyDefinitionValue,
  type ItemValue,
  itemHasLoadedValues,
  type PropertyType,
  type PropertyValue,
} from "@/coTypes/data";
import { BooleanPreview } from "./propertyViews/BooleanPreView";
import { EnumPreview } from "./propertyViews/EnumPreView";

type PropertyTypeConfig = {
  preview?: React.ComponentType<{
    value: PropertyValue;
    propDef: ItemPropertyDefinitionValue;
    onOpenEditor?: () => void;
    onChange?: (v: any) => void;
  }>;
  editor?: React.ComponentType<{
    value: PropertyValue;
    propDef: ItemPropertyDefinitionValue;
    onChange?: (v: any) => void;
  }>;
};

export const propertyTypeRegistry: Record<PropertyType, PropertyTypeConfig> = {
  calendarEntry: {
    preview: undefined,
    editor: undefined,
  },
  string: {
    preview: undefined,
    editor: undefined,
  },
  number: {
    preview: undefined,
    editor: undefined,
  },
  boolean: {
    preview: BooleanPreview,
    editor: undefined,
  },
  date: {
    preview: undefined,
    editor: undefined,
  },
  enum: {
    preview: EnumPreview,
    editor: undefined,
  },
  tags: {
    preview: undefined,
    editor: undefined,
  },
};
