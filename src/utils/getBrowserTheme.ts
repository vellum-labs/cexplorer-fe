import type { Theme } from "@/stores/themeStore";

export const getBrowserTheme = (): Theme | undefined => {
  if (!window.matchMedia) {
    return undefined;
  }

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const lightQuery = window.matchMedia("(prefers-color-scheme: light)");

  if (darkQuery.matches) return "dark";
  if (lightQuery.matches) return "light";

  return undefined;
};
