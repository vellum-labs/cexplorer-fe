import { handleCreateStore } from "@/lib/handleCreateStore";

export const useNotFound = handleCreateStore<
  { notFound: boolean },
  {
    setNotFound: (value: boolean) => void;
  }
>("not_found", { notFound: false }, set => ({
  setNotFound: value =>
    set(state => {
      state.notFound = value;
    }),
}));
