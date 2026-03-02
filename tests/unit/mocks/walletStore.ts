import { vi } from "vitest";
import type { WalletState } from "@/types/walletTypes";

/**
 * Controllable wallet store mock state.
 * Mutate this object in `beforeEach` to simulate different wallet states.
 *
 * IMPORTANT: Import this file individually — do NOT add it to the barrel
 * (tests/unit/mocks/index.ts). This avoids vi.mock() hoisting conflicts
 * when tests need fine-grained control over wallet state.
 */
export const mockWalletStoreState: WalletState & {
  setWalletState: ReturnType<typeof vi.fn>;
} = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  disabledExt: false,
  wallet: null,
  setWalletState: vi.fn(),
};

vi.mock("@/stores/walletStore", () => ({
  useWalletStore: vi.fn(() => mockWalletStoreState),
}));
