import { createFileRoute } from "@tanstack/react-router";
import { co } from "jazz-tools";
import { useSuspenseCoState } from "jazz-tools/react-core";
import { PlusCircleIcon, Share2Icon } from "lucide-react";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { TableView } from "@/components/views/TableView";
import { type ItemValue, Project, type PropertyValue } from "@/coTypes/data";

let test: any = null;
export const Route = createFileRoute("/_protected/$projectId")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const project = useSuspenseCoState(Project, projectId, {
    resolve: {
      items: { $each: true },
      propertyDefinitions: { $each: true },
      views: { $each: true },
    },
  });

  const handleAddItem = () => {
    const itemName = prompt("Enter item name:");
    if (itemName) {
      const rndStatus = ["New", "In progress", "Blocked", "Done"][Math.floor(Math.random() * 4)];
      project.items.$jazz.push({
        title: itemName,
        values: {
          status: rndStatus,
          isCompleted: false,
          description: "",
          estimate: 0,
          dueDate: null,
          tags: [],
        },
      });
    }
  };

  const handleAddMember = async () => {
    const memberId = prompt("Enter member Id:");
    const account = await co.account().load(memberId ?? "");
    if (account.$isLoaded) {
      project.$jazz.owner.addMember(account, "writer");
    }
  };

  const onItemPropertyChanged = (item: ItemValue, key: string, value: PropertyValue) => {
    console.log("Changing item property", key, "to", value);
    // item.$jazz.set("values", {
    //   ...item.values,
    //   [key]: value,
    // });
    if (item.values.$isLoaded) {
      item.values.$jazz.set(key, value);
      if (test === null) {
        test = item.values;
      } else {
        if (test !== item.values) {
          console.log(item.values);
        }
      }
    }
  };

  return (
    <div className="p-4 grid gap-2">
      <div className="flex gap-4 mb-4">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <Button onClick={handleAddMember} variant="ghost" size="icon">
          <Share2Icon />
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button onClick={handleAddItem} variant="ghost" size="icon">
          <PlusCircleIcon />
        </Button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Items </h2>
        <Button onClick={handleAddItem}>Add Item</Button>
        {project.views?.[0]?.type === "table" && (
          <div className="mt-4">
            <TableView items={project.items} propertyDefinitions={project.propertyDefinitions} view={project.views[0]} onOpenPropertyEditor={() => {}} onChangeProperty={onItemPropertyChanged} />
          </div>
        )}
        {project.items.length > 0 ? (
          <div style={{ maxWidth: 400, marginTop: 16 }}>
            {project.items
              .filter((item) => item.$isLoaded)
              .map((item) => (
                <div className="mb-2" key={item.$jazz._instanceID}>
                  <ItemCard item={item} propertyDefinitions={project.propertyDefinitions} onOpenPropertyEditor={() => {}} onChangeProperty={onItemPropertyChanged} />
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
