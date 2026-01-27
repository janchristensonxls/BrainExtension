import type {
  ItemPropertyDefinitionValue,
  PropertyValue,
} from "@/coTypes/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type EnumOptions = { values: string[] };

function safeParseOptions(json?: string | null): EnumOptions | null {
  if (!json) return null;
  try {
    const obj = JSON.parse(json);
    if (
      obj &&
      Array.isArray(obj.values) &&
      obj.values.every((v: unknown) => typeof v === "string")
    ) {
      return { values: obj.values };
    }
    return null;
  } catch {
    return null;
  }
}

type PropertyPreviewProps = {
  value: PropertyValue;
  propDef: ItemPropertyDefinitionValue;
  onOpenEditor?: () => void;
  onChange?: (v: string) => void;
};

export const EnumPreview: React.FC<PropertyPreviewProps> = ({
  value,
  propDef,
  onChange,
}) => {
  if (value === null || value === undefined) return <span>-</span>;
  const options = safeParseOptions(propDef.editor?.options);
  const interaction = propDef.presentation?.interaction ?? "inlineEditor"; // default enums to inline if you want
  const inline =
    interaction === "inlineEditor" &&
    propDef.editor?.widget === "dropdown" &&
    !!options &&
    !!onChange;

  if (inline) {
    const current = typeof value === "string" ? value : "";

    return (
      //   <select
      //     value={current}
      //     onChange={(e) => onChange(e.target.value)}
      //     style={{
      //       fontSize: 12,
      //       padding: "2px 8px",
      //       borderRadius: 999,
      //       border: "1px solid #d9d9d9",
      //       background: "white",
      //       cursor: "pointer",
      //     }}
      //   >
      //     {current === "" && (
      //       <option value="" disabled>
      //         Select…
      //       </option>
      //     )}
      //     {options.values.map((v) => (
      //       <option key={v} value={v}>
      //         {v}
      //       </option>
      //     ))}
      //   </select>
      // );

      <Select value={current} onValueChange={(val) => onChange(val)}>
        <SelectTrigger className=" min-w-50 inline-flex">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectLabel>Fruits</SelectLabel> */}

          {current === "" && (
            // <option value="" disabled>
            //   Select…
            // </option>
            <SelectItem value="">Select...</SelectItem>
          )}
          {options.values.map((v) => (
            // <option key={v} value={v}>
            //   {v}
            // </option>

            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  // fallback: clickable to open a modal editor (later)
  // const clickable =
  //   interaction !== "none" && interaction !== "inlineEditor" && !!onOpenEditor;

  if (value === null || value === undefined) return <span>-</span>;

  return (
    <span
    // onClick={clickable ? onOpenEditor : undefined}
    // style={{ cursor: clickable ? "pointer" : "default" }}
    >
      {String(value)}
    </span>
  );
};
