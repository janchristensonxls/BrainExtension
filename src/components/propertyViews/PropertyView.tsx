/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import {
  type ItemPropertyDefinitionValue,
  type ItemValue,
  itemHasLoadedValues,
  type PropertyValue,
} from "@/coTypes/data";
import { propertyTypeRegistry } from "../propertyTypeConfigs";

type PropertyViewProps = {
  item: ItemValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: (item: ItemValue, def: ItemPropertyDefinitionValue) => void;
  onChangeProperty?: (
    item: ItemValue,
    key: string,
    value: PropertyValue,
  ) => void;
};

export const PropertyView: React.FC<PropertyViewProps> = ({
  item,
  propDef,
  onOpenEditor,
  onChangeProperty,
}) => {
  if (!itemHasLoadedValues(item)) return <>Loading...</>; //This ensures that the values are loaded (co.record is lazy and can be NotLoaded until resolved.)

  const value = item.values[propDef.key];
  const typeConfig = propertyTypeRegistry[propDef.type];
  const Preview = typeConfig.preview;

  const clickable =
    propDef.presentation?.interaction &&
    propDef.presentation.interaction !== "none" &&
    !!onOpenEditor;

  const handleClick = () => {
    if (clickable && onOpenEditor) onOpenEditor(item, propDef);
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
          onOpenEditor={
            onOpenEditor ? () => onOpenEditor(item, propDef) : undefined
          }
          onChange={
            onChangeProperty
              ? (v) => onChangeProperty(item, propDef.key, v)
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
          onOpenEditor={
            onOpenEditor ? () => onOpenEditor(item, propDef) : undefined
          }
          onChange={
            onChangeProperty
              ? (v) => onChangeProperty(item, propDef.key, v)
              : undefined
          }
        />
      </>
    ));

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {content}
    </div>
  );
};
