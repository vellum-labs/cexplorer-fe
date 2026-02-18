import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

interface TxVisualizerState {
  isVisible: boolean;
}

interface TxVisualizerActions {
  setIsVisible: (value: boolean) => void;
}

export const useTxVisualizerStore = handlePersistStore<
  TxVisualizerState,
  TxVisualizerActions
>(
  "tx_visualizer_store",
  { isVisible: true },
  set => ({
    setIsVisible: value =>
      set(state => {
        state.isVisible = value;
      }),
  }),
);
