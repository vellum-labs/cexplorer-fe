import { describe, it, expect, beforeEach } from "vitest";
import { useWalletStore } from "@/stores/walletStore";

describe("walletStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useWalletStore.setState({
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
    });
    localStorage.clear();
  });

  it("has wallet as null in initial state", () => {
    const state = useWalletStore.getState();
    expect(state.wallet).toBeNull();
  });

  it("has address as undefined in initial state", () => {
    const state = useWalletStore.getState();
    expect(state.address).toBeUndefined();
  });

  it("updates wallet via setWalletState", () => {
    const mockWallet = { fake: true } as any;
    useWalletStore.getState().setWalletState({ wallet: mockWallet });

    expect(useWalletStore.getState().wallet).toBe(mockWallet);
  });

  it("updates address and walletType via setWalletState", () => {
    useWalletStore.getState().setWalletState({
      address: "addr1test...",
      walletType: "lace",
      stakeKey: "stake1test...",
    });

    const state = useWalletStore.getState();
    expect(state.address).toBe("addr1test...");
    expect(state.walletType).toBe("lace");
    expect(state.stakeKey).toBe("stake1test...");
  });

  it("does NOT persist wallet to localStorage (wallet excluded from partialize)", () => {
    const mockWallet = { fake: true } as any;

    useWalletStore.getState().setWalletState({
      address: "addr1test...",
      walletType: "lace",
      wallet: mockWallet,
    });

    // Read from localStorage
    const stored = localStorage.getItem("wallet-store");
    expect(stored).toBeTruthy();

    // wallet should NOT appear in persisted data
    expect(stored).not.toContain('"fake"');
    // address and walletType should be persisted
    expect(stored).toContain("addr1test...");
    expect(stored).toContain("lace");
  });

  it("persists address, stakeKey, walletType, disabledExt", () => {
    useWalletStore.getState().setWalletState({
      address: "addr1abc",
      stakeKey: "stake1xyz",
      walletType: "eternl",
      disabledExt: true,
    });

    const stored = localStorage.getItem("wallet-store");
    expect(stored).toContain("addr1abc");
    expect(stored).toContain("stake1xyz");
    expect(stored).toContain("eternl");
  });

  it("partial update does not clear other fields", () => {
    useWalletStore.getState().setWalletState({
      address: "addr1test...",
      walletType: "lace",
    });

    useWalletStore.getState().setWalletState({
      stakeKey: "stake1new...",
    });

    const state = useWalletStore.getState();
    expect(state.address).toBe("addr1test...");
    expect(state.walletType).toBe("lace");
    expect(state.stakeKey).toBe("stake1new...");
  });
});
