import {
  type ItemPropertyDefinitionValue,
  type ItemValue,
  itemHasLoadedValues,
} from "@/coTypes/data";

export function PropertyEditor({
  item,
  def,
}: {
  item: ItemValue;
  def: ItemPropertyDefinitionValue;
}) {
  if (!itemHasLoadedValues(item)) {
    //This ensures that the values are loaded (co.record is lazy and can be NotLoaded until resolved.)
    // You can render a skeleton / "loading..."
    return null;
  }

  const value = item.values[def.key];

  switch (def.editor?.widget) {
    // case "dropdown":
    //   return <Select label={def.label} value={value} options={def.editor.options.values} />;
    // case "datePicker":
    //   return <DateInput label={def.label} value={value as Date} />;
    // case "colorPicker":
    //   return <ColorPicker label={def.label} value={value as string} />;
    // ...
    default:
      //   return <TextField label={def.label} value={String(value ?? "")} />;
      return <div>Unsupported editor for property "{def.label}"</div>;
  }
}
