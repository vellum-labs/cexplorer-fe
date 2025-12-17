import type { Dispatch, SetStateAction } from "react";

import { useNavigate, useRouter } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { useState } from "react";

export const Shortcuts = {
  HOMEPAGE: "g+h",
  TX: "g+t",
  BLOCKS: "g+b",
  EPOCHS: "g+e",
  POOLS: "g+p",
  DREPS: "g+d",
  ASSETS: "g+a",
  GOV: "g+o",
  HELP: "?",
  SEARCH: "/",
  REFRESH: "r",
  NEXT: "j",
  PREVIOUS: "k",
} as const;

export type ShortcutKey = keyof typeof Shortcuts;
export type Shortcut = (typeof Shortcuts)[ShortcutKey];

interface UseShortcutsReturn {
  openHelp: boolean;
  setOpenHelp: Dispatch<SetStateAction<boolean>>;
}

export const useShortcuts = (): UseShortcutsReturn => {
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  const navigate = useNavigate();
  const router = useRouter();

  useHotkeys(
    Object.values(Shortcuts),
    (_, hotkeysEvent) => {
      switch (hotkeysEvent.hotkey as Shortcut) {
        case Shortcuts.HOMEPAGE:
          navigate({
            to: "/",
          });
          return;
        case Shortcuts.TX:
          navigate({
            to: "/tx",
          });
          return;
        case Shortcuts.BLOCKS:
          navigate({
            to: "/block",
          });
          return;
        case Shortcuts.EPOCHS:
          navigate({
            to: "/epoch",
          });
          return;
        case Shortcuts.POOLS:
          navigate({
            to: "/pool",
          });
          return;
        case Shortcuts.DREPS:
          navigate({
            to: "/drep",
          });
          return;
        case Shortcuts.ASSETS:
          navigate({
            to: "/asset",
          });
          return;
        case Shortcuts.GOV:
          navigate({
            to: "/gov/action",
          });
          return;
        case Shortcuts.HELP: {
          setOpenHelp(open => !open);
          return;
        }
        case Shortcuts.SEARCH: {
          const search = document.querySelector(
            "search input",
          ) as HTMLInputElement;

          if (search) {
            search.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            search.focus({ preventScroll: true });
          }

          return;
        }
        case Shortcuts.REFRESH:
          window.location.reload();
          return;
        case Shortcuts.NEXT:
          router.history.forward();
          return;
        case Shortcuts.PREVIOUS:
          router.history.back();
          return;
      }
    },
    { useKey: true, preventDefault: true },
  );

  return {
    openHelp,
    setOpenHelp,
  };
};
