import { useEffect, useState } from "react";

export function useSubscribeToCoValue<
  T extends {
    $jazz: {
      subscribe: (cb: (val: T) => void) => () => void;
    };
  },
>(val: T) {
  const [value, setValue] = useState(val);

  useEffect(() => val.$jazz.subscribe((v) => setValue(v)), [val.$jazz]);

  return value;
}
