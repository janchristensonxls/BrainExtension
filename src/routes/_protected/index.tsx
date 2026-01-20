import { createFileRoute } from "@tanstack/react-router";
import { useAccount, useCoState } from "jazz-tools/react-core";
import { ButtonLink } from "@/components/elements/ButtonLink";
import { Button } from "@/components/ui/button";
import { isCompletedPropertyDefinition } from "@/coTypes/PropertyDefinitions/isCompletedPropertyDefinition";
import { statusPropertyDefinition } from "@/coTypes/PropertyDefinitions/statusPropertyDefinition";
import { MyAppAccount } from "@/schema";

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

  if (!me.$isLoaded) {
    return <div>Loading…</div>;
  }

  const addProject = () => {
    const projectName = prompt("Enter project name:");
    if (projectName) {
      me.root.myProjects.$jazz.push({
        name: projectName,
        items: [],
        propertyDefinitions: [
          statusPropertyDefinition,
          isCompletedPropertyDefinition,
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
            <li key={project.$jazz._instanceID}>
              <ButtonLink
                to="/$projectId"
                params={{ projectId: project.$jazz.id }}
              >
                {project.$jazz.id} :{project.name}
              </ButtonLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
