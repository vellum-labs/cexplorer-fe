import type { RefObject } from "react";

import { useEffect } from "react";

export const useClickOutsideGroup = (
  refs: RefObject<HTMLElement>[],
  onClickOutside: () => void,
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        refs.every(ref => {
          const node = ref.current;
          return node && !node.contains(e.target as Node);
        })
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [refs, onClickOutside]);
};
