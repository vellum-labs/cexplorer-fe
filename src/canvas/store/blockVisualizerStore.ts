import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

interface BlockVisualizerState {
  isVisible: boolean;
}

interface BlockVisualizerActions {
  setIsVisible: (value: boolean) => void;
}

export const useBlockVisualizerStore = handlePersistStore<
  BlockVisualizerState,
  BlockVisualizerActions
>(
  "block_visualizer_store",
  { isVisible: true },
  set => ({
    setIsVisible: value =>
      set(state => {
        state.isVisible = value;
      }),
  }),
);
