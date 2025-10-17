import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAuthTokensStore = handlePersistStore<
  {
    tokens: Record<string, { token: string }>;
  },
  {
    setTokens: (tokens: Record<string, { token: string }>) => void;
  }
>(
  "auth_tokens_store",
  {
    tokens: {},
  },
  set => ({
    setTokens: tokens =>
      set(state => {
        state.tokens = tokens;
      }),
  }),
);
