import type React from "react";
import type {
  ItemPropertyDefinitionValue,
  ItemValue,
  ViewDefinitionValue,
} from "@/coTypes/data";
import { PropertyView } from "../propertyViews/PropertyView";

type TableViewProps = {
  items: readonly ItemValue[];
  propertyDefinitions: readonly ItemPropertyDefinitionValue[];
  view: ViewDefinitionValue;
  projectId: string;
};

export const TableView: React.FC<TableViewProps> = ({
  items,
  propertyDefinitions,
  view,
  projectId,
}) => {
  const visibleKeys = view.visiblePropertyKeys ?? [];
  const columns =
    visibleKeys.length > 0
      ? propertyDefinitions.filter((def) => visibleKeys.includes(def.key))
      : propertyDefinitions;

  return (
    <div className="overflow-visible rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Title</th>
            {columns.map((def) => (
              <th
                key={def.$jazz.id ?? def.key}
                className="px-3 py-2 text-left font-medium"
              >
                {def.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item) => item.values.$isLoaded)
            .map((item) => (
              <tr key={item.$jazz._instanceID} className="border-t">
                <td className="px-3 py-2 font-medium">
                  {item.title || "(untitled)"}
                </td>
                {columns.map((def) => (
                  <td key={def.$jazz.id ?? def.key} className="px-3 py-2">
                    <PropertyView
                      valuesId={item.values.$jazz.id}
                      propDef={def}
                      projectId={projectId}
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
