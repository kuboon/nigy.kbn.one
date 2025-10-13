import { HTMLAttributes } from "preact";
import { IS_BROWSER } from "fresh/runtime";

export function Button(
  props: HTMLAttributes<HTMLButtonElement> & { disabled?: boolean },
) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
    />
  );
}
