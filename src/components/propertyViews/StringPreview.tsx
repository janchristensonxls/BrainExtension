import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: string) => void;
};

export const StringPreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  onChange,
}) => {
  const current = typeof value === "string" ? value : "";
  const interaction = propDef.presentation?.interaction ?? "inlineEditor";
  const widget = propDef.editor?.widget ?? "textbox";
  const inline =
    interaction === "inlineEditor" &&
    (widget === "textbox" || widget === "textarea") &&
    !!onChange;

  if (inline && widget === "textarea") {
    return (
      <Textarea
        value={current}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[60px] text-sm"
      />
    );
  }

  if (inline) {
    return (
      <Input
        value={current}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 text-sm"
      />
    );
  }

  return <span>{current || "-"}</span>;
};
