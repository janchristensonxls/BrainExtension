import { createFileRoute } from "@tanstack/react-router";
import { co } from "jazz-tools";
import { useCoState } from "jazz-tools/react-core";
import { ItemCard } from "@/components/ItemCard";
import { TableView } from "@/components/views/TableView";
import { Button } from "@/components/ui/button";
import { type ItemValue, Project, type PropertyValue } from "@/coTypes/data";
import { handlePageLoad } from "@/utils/handlePageLoad";

export const Route = createFileRoute("/_protected/$projectId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    Project.load(params.projectId, {
      resolve: {
        items: {
          $each: true,
        },
      },
    });
  },
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const project = useCoState(Project, projectId, {
    resolve: { items: { $each: true }, propertyDefinitions: { $each: true } },
  });

  if (!project.$isLoaded) {
    return handlePageLoad(project);
  }

  const handleAddItem = () => {
    const itemName = prompt("Enter item name:");
    if (itemName) {
      const rndStatus = ["New", "In progress", "Blocked", "Done"][
        Math.floor(Math.random() * 4)
      ];
      project.items.$jazz.push({
        title: itemName,
        values: { status: rndStatus, isCompleted: false },
      });
    }
  };
  const handleMakePublic = () => {
    project.$jazz.owner.makePublic("writer");
  };

  const handleAddMember = async () => {
    const memberId = prompt("Enter member Id:");
    const account = await co.account().load(memberId ?? "");
    if (account.$isLoaded) {
      project.$jazz.owner.addMember(account, "writer");
    }
  };

  const onItemPropertyChanged = (
    item: ItemValue,
    key: string,
    value: PropertyValue,
  ) => {
    console.log("Changing item property", key, "to", value);
    item.$jazz.set("values", {
      ...item.values,
      [key]: value,
    });
  };

  return (
    <div>
      {project.name}
      <div>
        <Button onClick={handleMakePublic}>Make public!</Button>

        <Button onClick={handleAddMember}>Add someone</Button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Items </h2>
        <Button onClick={handleAddItem}>Add Item</Button>
        {project.views?.[0]?.type === "table" && (
          <div className="mt-4">
            <TableView
              items={project.items}
              propertyDefinitions={project.propertyDefinitions}
              view={project.views[0]}
              onOpenPropertyEditor={() => {}}
              onChangeProperty={onItemPropertyChanged}
            />
          </div>
        )}
        {project.items.length > 0 ? (
          <div style={{ maxWidth: 400, marginTop: 16 }}>
            {project.items
              .filter((item) => item.$isLoaded)
              .map((item) => (
                <div className="mb-2" key={item.$jazz._instanceID}>
                  <ItemCard
                    item={item}
                    propertyDefinitions={project.propertyDefinitions}
                    onOpenPropertyEditor={() => {}}
                    onChangeProperty={onItemPropertyChanged}
                  />
                </div>
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No items found</p>
        )}
      </div>
    </div>
  );
}
