import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "jazz-tools/react-core";
import { useState } from "react";
import { ButtonLink } from "@/components/elements/ButtonLink";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput, type TagOption } from "@/components/ui/tag-input";
import { descriptionPropertyDefinition } from "@/coTypes/PropertyDefinitions/descriptionPropertyDefinition";
import { dueDatePropertyDefinition } from "@/coTypes/PropertyDefinitions/dueDatePropertyDefinition";
import { estimatePropertyDefinition } from "@/coTypes/PropertyDefinitions/estimatePropertyDefinition";
import { isCompletedPropertyDefinition } from "@/coTypes/PropertyDefinitions/isCompletedPropertyDefinition";
import { statusPropertyDefinition } from "@/coTypes/PropertyDefinitions/statusPropertyDefinition";
import { tagsPropertyDefinition } from "@/coTypes/PropertyDefinitions/tagsPropertyDefinition";
import { MyAppAccount } from "@/schema";

const frameworkOptions: TagOption[] = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "vue", label: "Vue" },
  { value: "nuxt", label: "Nuxt" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const skillOptions: TagOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
];

export const Route = createFileRoute("/_protected/")({
  component: IndexComponent,
});

function IndexComponent() {
  const me = useAccount(MyAppAccount, {
    resolve: {
      root: {
        myProjects: { $each: true }, // or `true` if you want shallow refs
      },
    },
  });

  const [selectedFrameworks, setSelectedFrameworks] = useState<TagOption[]>([
    { value: "react", label: "React" },
  ]);
  const [selectedSkills, setSelectedSkills] = useState<TagOption[]>([]);

  if (!me.$isLoaded) {
    return <div>Loading…</div>;
  }

  const addProject = () => {
    const projectName = prompt("Enter project name:");
    if (projectName) {
      me.root.myProjects.$jazz.push({
        name: projectName,
        items: [],
        propertyDefinitions: [statusPropertyDefinition, isCompletedPropertyDefinition, descriptionPropertyDefinition, estimatePropertyDefinition, dueDatePropertyDefinition, tagsPropertyDefinition],
        views: [
          {
            name: "Table",
            type: "table",
            visiblePropertyKeys: ["status", "isCompleted", "description", "estimate", "dueDate", "tags"],
          },
        ],
        description: "",
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <Button onClick={addProject}>Add Project</Button>
      </div>

      {me.root.myProjects.length === 0 ? (
        <div>You have no projects yet.</div>
      ) : (
        <ul>
          {me.root.myProjects.map((project) => (
            <li key={project.$jazz.id}>
              <ButtonLink to="/$projectId" params={{ projectId: project.$jazz.id }}>
                {project.$jazz.id} :{project.name}
              </ButtonLink>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2 className="text-lg font-semibold my-4">Component test</h2>

        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <Label>Skills</Label>
            <TagInput
              options={skillOptions}
              selectedTags={selectedSkills}
              onTagsChange={setSelectedSkills}
              placeholder="Search skills or add new..."
              allowCreate={true}
            />
          </div>

          <div className="space-y-2">
            <Label>Frameworks</Label>
            <TagInput
              options={frameworkOptions}
              selectedTags={selectedFrameworks}
              onTagsChange={setSelectedFrameworks}
              placeholder="Search frameworks..."
              allowCreate={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
