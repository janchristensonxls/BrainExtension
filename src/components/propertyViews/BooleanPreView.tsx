import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { Switch } from "../ui/switch";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: boolean) => void;
};

export const BooleanPreview: React.FC<PropertyPreviewProps> = ({
  value,
  onChange,
}) => {
  const current = typeof value === "string" ? value : "";

  return (
    <Switch
      value={current}
      checked={value as boolean}
      onCheckedChange={(next) => {
        onChange ? onChange(next) : undefined; // local state
        console.log("checked:", next); // your callback
      }}
    ></Switch>
  );
};
