import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
  TagsData,
} from "@/coTypes/data";
import { Project } from "@/coTypes/data";
import { useSuspenseCoState } from "jazz-tools/react";
import { TagInput, type TagOption } from "../ui/tag-input";

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  projectId?: string;
  onOpenEditor?: () => void;
  onChange?: (v: PropertyValue) => void;
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

function isTagsData(value: unknown): value is TagsData {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const TagsPreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  projectId,
  onChange,
}) => {
  const tags = normalizeTags(value);
  const interaction = propDef.presentation?.interaction ?? "inlineEditor";
  const widget = propDef.editor?.widget ?? "tagInput";
  const inline =
    interaction === "inlineEditor" &&
    widget === "tagInput" &&
    !!onChange &&
    !!projectId;

  if (inline) {
    return (
      <TagsInlineEditor
        projectId={projectId}
        propDef={propDef}
        tags={tags}
        onChange={onChange}
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

function TagsInlineEditor({
  projectId,
  propDef,
  tags,
  onChange,
}: {
  projectId: string;
  propDef: ItemPropertyDefinitionValue;
  tags: string[];
  onChange: (v: PropertyValue) => void;
}) {
  const project = useSuspenseCoState(Project, projectId, {
    resolve: {
      projectValues: {
        $each: true,
      },
    },
  });

  const currentTagData = project.projectValues?.[propDef.key];
  const tagData: TagsData = isTagsData(currentTagData) ? currentTagData : {};
  const options: TagOption[] = Object.keys(tagData).map((tagName) => ({
    value: tagName,
    label: tagName,
  }));
  const selectedTags: TagOption[] = tags.map((tagName) => ({
    value: tagName,
    label: tagName,
  }));

  const handleTagsChange = (nextTags: TagOption[]) => {
    const nextTagNames = nextTags.map((tag) => tag.label.trim()).filter(Boolean);
    onChange(nextTagNames);

    const nextTagData = { ...tagData };
    for (const tagName of nextTagNames) {
      if (!nextTagData[tagName]) {
        nextTagData[tagName] = {};
      }
    }

    if (project.$jazz.loadingState !== "loaded") {
      return;
    }

    if (!project.projectValues) {
      project.$jazz.set("projectValues", {});
    }

    if (project.projectValues?.$jazz.loadingState === "loaded") {
      project.projectValues.$jazz.set(propDef.key, nextTagData);
    }
  };

  return (
    <TagInput
      options={options}
      selectedTags={selectedTags}
      onTagsChange={handleTagsChange}
      placeholder="Add tags"
      allowCreate={true}
    />
  );
}
