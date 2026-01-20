import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { Input } from "../ui/input";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: number) => void;
};

export const NumberPreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  onChange,
}) => {
  const current = typeof value === "number" ? value : undefined;
  const interaction = propDef.presentation?.interaction ?? "inlineEditor";
  const widget = propDef.editor?.widget ?? "textbox";
  const inline =
    interaction === "inlineEditor" && widget === "textbox" && !!onChange;

  if (inline) {
    return (
      <Input
        type="number"
        value={current ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "" ? 0 : Number(next));
        }}
        className="h-8 text-sm"
      />
    );
  }

  return <span>{current ?? "-"}</span>;
};
