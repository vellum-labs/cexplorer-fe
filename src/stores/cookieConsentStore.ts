import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useCookieConsentStore = handlePersistStore<
  { accepted: boolean },
  { setAccepted: (value: boolean) => void }
>(
  "cookie_consent",
  { accepted: false },
  set => ({
    setAccepted: value =>
      set(state => {
        state.accepted = value;
      }),
  }),
);
