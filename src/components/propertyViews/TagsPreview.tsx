import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { Input } from "../ui/input";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: string[]) => void;
};

function normalizeTags(value: PropertyValue): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag) => typeof tag === "string");
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

export const TagsPreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  onChange,
}) => {
  const tags = normalizeTags(value);
  const interaction = propDef.presentation?.interaction ?? "inlineEditor";
  const widget = propDef.editor?.widget ?? "tagInput";
  const inline =
    interaction === "inlineEditor" && widget === "tagInput" && !!onChange;

  if (inline) {
    return (
      <Input
        value={tags.join(", ")}
        onChange={(event) => {
          const next = event.target.value;
          const parsed = next
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
          onChange(parsed);
        }}
        className="h-8 text-sm"
        placeholder="Add tags"
      />
    );
  }

  if (tags.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
