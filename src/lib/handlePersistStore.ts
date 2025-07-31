import type { Draft } from "immer";
import { produce } from "immer";
import type { StoreApi } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SetState<T> = (
  partial: T | Partial<T> | ((state: Draft<T>) => void),
  replace?: boolean,
) => void;

export function handlePersistStore<T extends object, U extends object>(
  name: string,
  state: T,
  actions: (set: SetState<T & U>, get: StoreApi<T & U>["getState"]) => U,
  // storageConfig: PersistOptions<T & U, Partial<T & U>> = {
  //   name: "default-storage",
  // },
) {
  return create<T & U>()(
    persist(
      // devtools(
      (set, get) => ({
        ...state,
        ...actions(
          (partial, replace) =>
            set(
              state =>
                produce(state, draft => {
                  if (typeof partial === "function") {
                    (partial as (state: Draft<T & U>) => void)(draft);
                  } else {
                    Object.assign(draft, partial);
                  }
                }),
              replace,
            ),
          get,
        ),
      }),
      { name },
    ),
    // storageConfig,
    // ),
  );
}
