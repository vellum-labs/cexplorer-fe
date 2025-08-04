import { handlePersistStore } from "../lib/handlePersistStore";

export const useThemeStore = handlePersistStore<
  { theme: "light" | "dark" },
  { toggleTheme: () => void }
>("theme_store", { theme: "dark" }, set => ({
  toggleTheme: () =>
    set(state => {
      state.theme = state.theme === "light" ? "dark" : "light";
    }),
}));
