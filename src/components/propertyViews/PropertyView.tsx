import { useSuspenseCoState } from "jazz-tools/react";
import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import { ItemValues } from "@/coTypes/data";
import { propertyTypeRegistry } from "../propertyTypeConfigs";

type PropertyViewProps = {
  valuesId: string;
  propDef: ItemPropertyDefinitionValue;
  projectId?: string;
};

export const PropertyView: React.FC<PropertyViewProps> = ({
  valuesId,
  propDef,
  projectId,
}) => {
  const { $jazz, value } = useSuspenseCoState(ItemValues, valuesId, {
    resolve: {
      $each: true,
    },
    select: (values) => ({
      $jazz: values.$jazz,
      value: values[propDef.key],
    }),
    equalityFn: (a, b) => a.value === b.value,
  });

  const onChangeProperty = (value: PropertyValue) => {
    if ($jazz.loadingState === "loaded") {
      $jazz.set(propDef.key, value);
    }
  };
  const onOpenEditor = () => {};

  if (value === undefined) return <>Loading...</>; //This ensures that the values are loaded (co.record is lazy and can be NotLoaded until resolved.)

  const typeConfig = propertyTypeRegistry[propDef.type];
  const Preview = typeConfig.preview;

  const clickable =
    propDef.presentation?.interaction &&
    propDef.presentation.interaction !== "none" &&
    !!onOpenEditor;

  const handleClick = () => {
    if (clickable && onOpenEditor) onOpenEditor();
  };

  const variant = propDef.presentation?.variant ?? "text";

  const wrapAsChip = (children: React.ReactNode) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 8px",
        borderRadius: 999,
        border: "1px solid #d9d9d9",
        fontSize: 11,
        lineHeight: "20px",
      }}
    >
      {!propDef.presentation?.hideLabel && (
        <span style={{ marginRight: 4 }}>{propDef.label}:</span>
      )}
      {children}
    </div>
  );

  const content =
    Preview &&
    (variant === "chip" ? (
      wrapAsChip(
        <Preview
          value={value}
          propDef={propDef}
          projectId={projectId}
          onOpenEditor={onOpenEditor ? () => onOpenEditor() : undefined}
          onChange={
            onChangeProperty
              ? (v: PropertyValue) => onChangeProperty(v)
              : undefined
          }
        />,
      )
    ) : (
      <>
        {!propDef.presentation?.hideLabel && (
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>
            {propDef.label}:
          </span>
        )}
        <Preview
          value={value}
          propDef={propDef}
          projectId={projectId}
          onOpenEditor={onOpenEditor ? () => onOpenEditor() : undefined}
          onChange={
            onChangeProperty
              ? (v: PropertyValue) => onChangeProperty(v)
              : undefined
          }
        />
      </>
    ));

  return clickable ? (
    <button
      type="button"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        userSelect: "none",
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        textAlign: "inherit",
      }}
    >
      {content}
    </button>
  ) : (
    <div
      style={{
        userSelect: "none",
      }}
    >
      {content}
    </div>
  );
};
