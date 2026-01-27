import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { Input } from "../ui/input";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: Date) => void;
};

function toDateValue(value: PropertyValue) {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export const DatePreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  onChange,
}) => {
  const dateValue = toDateValue(value);
  const interaction = propDef.presentation?.interaction ?? "inlineEditor";
  const widget = propDef.editor?.widget ?? "datePicker";
  const inline =
    interaction === "inlineEditor" && widget === "datePicker" && !!onChange;

  if (inline) {
    const inputValue = dateValue ? dateValue.toISOString().slice(0, 10) : "";
    return (
      <Input
        type="date"
        value={inputValue}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next ? new Date(`${next}T00:00:00`) : new Date());
        }}
        className="h-8 text-sm"
      />
    );
  }

  return <span>{dateValue ? dateValue.toLocaleDateString() : "-"}</span>;
};
