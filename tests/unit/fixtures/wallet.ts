import { vi } from "vitest";

/**
 * Factory for creating a mock BrowserWallet instance.
 * Override any method by passing it in `overrides`.
 */
export const createMockBrowserWallet = (
  overrides: Record<string, any> = {},
) => ({
  getRewardAddresses: vi
    .fn()
    .mockResolvedValue([
      "stake1uyehkqvz7w5hn7g5370scz0g5c7gy3y5owgcfz3cqkzyaqxsm7lt",
    ]),
  getUtxos: vi.fn().mockResolvedValue([
    {
      output: {
        amount: [{ unit: "lovelace", quantity: "10000000" }],
      },
    },
  ]),
  getChangeAddress: vi
    .fn()
    .mockResolvedValue(
      "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjc7",
    ),
  getUsedAddresses: vi
    .fn()
    .mockResolvedValue([
      "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjc7",
    ]),
  getUnusedAddresses: vi.fn().mockResolvedValue([]),
  signTx: vi.fn().mockResolvedValue("signed-tx-hex"),
  submitTx: vi.fn().mockResolvedValue("tx-hash-abc123"),
  getNetworkId: vi.fn().mockResolvedValue(1),
  getBalance: vi.fn().mockResolvedValue("10000000"),
  getCollateral: vi.fn().mockResolvedValue([]),
  signData: vi.fn().mockResolvedValue({ signature: "sig", key: "key" }),
  ...overrides,
});

/** State matching what localStorage restores after page reload (no wallet instance). */
export const persistedWalletState = {
  address:
    "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjc7",
  stakeKey:
    "stake1uyehkqvz7w5hn7g5370scz0g5c7gy3y5owgcfz3cqkzyaqxsm7lt",
  walletType: "lace" as const,
  disabledExt: false,
};

/** Fully connected wallet state (with BrowserWallet instance). */
export const createFullWalletState = () => ({
  ...persistedWalletState,
  wallet: createMockBrowserWallet(),
});

/**
 * Bug state: localStorage restored address+walletType,
 * but wallet instance is still null (reconnection not yet completed).
 */
export const bugWalletState = {
  ...persistedWalletState,
  wallet: null,
};
