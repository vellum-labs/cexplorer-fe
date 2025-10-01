import { getBrowserTheme } from "@/utils/getBrowserTheme";
import { handlePersistStore } from "../lib/handlePersistStore";

export type Theme = "light" | "dark";

export const useThemeStore = handlePersistStore<
  { theme: Theme },
  { toggleTheme: () => void }
>("theme_store", { theme: getBrowserTheme() ?? "dark" }, set => ({
  toggleTheme: () =>
    set(state => {
      state.theme = state.theme === "light" ? "dark" : "light";
    }),
}));
