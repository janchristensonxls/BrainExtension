import { useSuspenseCoState } from "jazz-tools/react-core";
import type React from "react";
import { computeItemDecorations, Item as ItemCoType, type ItemPropertyDefinitionValue } from "@/coTypes/data";
import { PropertyView } from "./propertyViews/PropertyView";
import { Item } from "./ui/item";

// Helper type: valid presentation regions
type PropertyRegion = NonNullable<ItemPropertyDefinitionValue["presentation"]>["region"];

function getPropsByRegion(defs: readonly ItemPropertyDefinitionValue[], region: PropertyRegion) {
  return defs.filter((d) => d.presentation && d.presentation.region === region).sort((a, b) => (a.presentation?.order ?? 0) - (b.presentation?.order ?? 0));
}

export interface ItemCardProps {
  itemId: string;
  projectId: string;
  propertyDefinitions: readonly ItemPropertyDefinitionValue[];
}

export const ItemCard: React.FC<ItemCardProps> = ({
  itemId,
  projectId,
  propertyDefinitions,
}) => {
  const item = useSuspenseCoState(ItemCoType, itemId, {
    resolve: {
      values: {
        $each: true,
      },
    },
  });
  const headerProps = getPropsByRegion(propertyDefinitions, "header");
  const subtitleProps = getPropsByRegion(propertyDefinitions, "subtitle");
  const badgesProps = getPropsByRegion(propertyDefinitions, "badges");
  const bodyProps = getPropsByRegion(propertyDefinitions, "body");
  const sidebarProps = getPropsByRegion(propertyDefinitions, "sidebar");

  if (!item.$isLoaded) {
    //This ensures that the values are loaded (co.record is lazy and can be NotLoaded until resolved.)
    // You can render a skeleton / "loading..."
    return null;
  }

  // ItemValue + ItemPropertyDefinitionValue are structurally compatible
  // with ItemInput / ItemPropertyDefinitionInput, so this just works.
  const decorations = computeItemDecorations(item, propertyDefinitions);

  return (
    <Item
      // style={{
      //   // border: `1px solid ${decorations.borderColor ?? ""}`,
      //   color: decorations.textColor ?? "",
      //   display: "flex",
      // }}
      variant={"muted"}
      style={{
        // border: `1px solid ${decorations.borderColor ?? ""}`,
        color: decorations.textColor ?? "",
        display: "flex",
      }}
      className="p-0 overflow-visible"
    >
      {/* Left colored bar */}
      <div
        className="self-stretch"
        style={{
          width: 8,
          backgroundColor: decorations.leftBarColor ?? "transparent",
        }}
      />

      {/* Main content */}
      <div style={{ padding: 8, flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                marginBottom: headerProps.length ? 2 : 4,
              }}
            >
              {item.title || "(untitled)"}
              {/* or item.title ?? item.$jazz.id */}
            </div>

            {/* Header region properties (compact inline) */}
            {headerProps.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 12,
                }}
              >
                {headerProps.map((propDef) => (
                  <PropertyView
                    key={propDef.$jazz._instanceID ?? propDef.key}
                    valuesId={item.values.$jazz.id}
                    propDef={propDef}
                    projectId={projectId}
                  />
                ))}
              </div>
            )}

            {/* Subtitle region */}
            {subtitleProps.length > 0 && (
              <div
                style={{
                  marginTop: 4,
                  color: "#666",
                  fontSize: 12,
                }}
              >
                {subtitleProps.map((propDef) => (
                  <div key={propDef.$jazz.id ?? propDef.key}>
                    <PropertyView
                      valuesId={item.values.$jazz.id}
                      propDef={propDef}
                      projectId={projectId}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar region (right side facts) */}
          {sidebarProps.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginLeft: 8,
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {sidebarProps.map((propDef) => (
                <PropertyView
                  key={propDef.$jazz.id ?? propDef.key}
                  valuesId={item.values.$jazz.id}
                  propDef={propDef}
                  projectId={projectId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Badges row */}
        {(badgesProps.length > 0 || decorations.badges.length > 0) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {badgesProps.map((propDef) => (
              <PropertyView
                key={propDef.$jazz.id ?? propDef.key}
                valuesId={item.values.$jazz.id}
                propDef={propDef}
                projectId={projectId}
              />
            ))}
            {decorations.badges.map((b) => (
              <span
                key={b.text}
                style={{
                  padding: "0 8px",
                  borderRadius: 999,
                  backgroundColor: b.color ?? "#f0f0f0",
                  fontSize: 11,
                  lineHeight: "20px",
                }}
              >
                {b.icon && (
                  <i className="{b.icon}" style={{ marginRight: 4 }}>
                    {b.icon}
                  </i>
                  // <DynamicIcon name="camera" color="red" size={48} />
                )}
                {/* {b.text} */}
              </span>
            ))}
          </div>
        )}

        {/* Body region – key/value list */}
        {bodyProps.length > 0 && (
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              rowGap: 4,
            }}
          >
            {bodyProps.map((propDef) => (
              <PropertyView
                key={propDef.$jazz.id ?? propDef.key}
                valuesId={item.values.$jazz.id}
                propDef={propDef}
                projectId={projectId}
              />
            ))}
          </div>
        )}
      </div>
    </Item>
  );
};
