import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  persistedWalletState,
  createMockBrowserWallet,
} from "../fixtures/wallet";

// --- Hoisted mocks (declared before vi.mock factories run) ---

const {
  mockSetIsOpen,
  mockSetWatchlist,
  mockToast,
  mockBrowserWalletEnable,
} = vi.hoisted(() => ({
  mockSetIsOpen: vi.fn(),
  mockSetWatchlist: vi.fn(),
  mockToast: Object.assign(vi.fn(), { error: vi.fn() }),
  mockBrowserWalletEnable: vi.fn(),
}));

// --- Store mocks (imported for their side-effects of calling vi.mock) ---

import { mockWalletStoreState } from "../mocks/walletStore";
import { mockAuthTokensState } from "../mocks/authTokensStore";

// --- Additional mocks ---

vi.mock("@/stores/states/walletConfigModalState", () => ({
  useWalletConfigModalState: vi.fn(() => ({
    isOpen: false,
    setIsOpen: mockSetIsOpen,
  })),
}));

vi.mock("@/stores/watchlistStore", () => ({
  useWatchlistStore: vi.fn(() => ({
    watchlist: [],
    setWatchlist: mockSetWatchlist,
  })),
}));

vi.mock("@/hooks/useAuthToken", () => ({
  useAuthToken: vi.fn(() => undefined),
}));

vi.mock("@/services/user", () => ({
  useFetchWatchlist: vi.fn(() => ({ data: undefined })),
}));

vi.mock("sonner", () => ({
  toast: mockToast,
}));

vi.mock("@/constants/confVariables", () => ({
  network: "mainnet",
}));

vi.mock("@meshsdk/core", () => ({
  BrowserWallet: {
    enable: (...args: any[]) => mockBrowserWalletEnable(...args),
  },
}));

// --- Import under test ---

import { useConnectWallet } from "@/hooks/useConnectWallet";

describe("useConnectWallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset wallet store to disconnected state
    Object.assign(mockWalletStoreState, {
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
      setWalletState: vi.fn(),
    });

    mockAuthTokensState.tokens = {};
    localStorage.clear();
  });

  // ===== Reconnection logic =====

  it("reconnects wallet when walletType is stored but wallet is null", async () => {
    const mockWallet = createMockBrowserWallet();
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null,
    });

    renderHook(() => useConnectWallet());

    await waitFor(() => {
      expect(mockBrowserWalletEnable).toHaveBeenCalledWith("lace");
      expect(mockWalletStoreState.setWalletState).toHaveBeenCalledWith({
        wallet: mockWallet,
      });
    });
  });

  it("resets state when reconnection fails", async () => {
    mockBrowserWalletEnable.mockRejectedValue(new Error("Extension not found"));

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null,
    });

    renderHook(() => useConnectWallet());

    await waitFor(() => {
      expect(mockBrowserWalletEnable).toHaveBeenCalledWith("lace");
      expect(mockWalletStoreState.setWalletState).toHaveBeenCalledWith({
        address: undefined,
        stakeKey: undefined,
        walletType: undefined,
        disabledExt: false,
        wallet: null,
      });
    });
  });

  it("does NOT attempt reconnection when wallet is already present", () => {
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    renderHook(() => useConnectWallet());

    expect(mockBrowserWalletEnable).not.toHaveBeenCalled();
  });

  it("does NOT attempt reconnection when walletType is undefined", () => {
    renderHook(() => useConnectWallet());

    expect(mockBrowserWalletEnable).not.toHaveBeenCalled();
  });

  // ===== Connect function =====

  it("connects wallet and sets full state", async () => {
    const mockWallet = createMockBrowserWallet();
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connect("lace");
    });

    expect(mockBrowserWalletEnable).toHaveBeenCalledWith("lace");
    expect(mockWalletStoreState.setWalletState).toHaveBeenCalledWith(
      expect.objectContaining({
        walletType: "lace",
        wallet: mockWallet,
        disabledExt: false,
      }),
    );
  });

  it("rejects testnet wallet on mainnet", async () => {
    const mockWallet = createMockBrowserWallet({
      getUsedAddresses: vi
        .fn()
        .mockResolvedValue(["addr_test1qztestaddress..."]),
    });
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connect("lace");
    });

    expect(mockToast).toHaveBeenCalledWith(
      "Please use a mainnet wallet to connect to the mainnet Cexplorer",
      expect.any(Object),
    );
    expect(mockWalletStoreState.setWalletState).toHaveBeenCalledWith({
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
    });
  });

  it("opens wallet config modal when no auth token exists", async () => {
    const mockWallet = createMockBrowserWallet();
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);
    mockAuthTokensState.tokens = {};

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connect("lace");
    });

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it("does NOT open wallet config modal when auth token exists", async () => {
    const addr =
      "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjc7";
    const mockWallet = createMockBrowserWallet();
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);
    mockAuthTokensState.tokens = { [addr]: { token: "existing-token" } };

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connect("lace");
    });

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  // ===== Disconnect function =====

  it("disconnect clears state and removes localStorage", () => {
    localStorage.setItem("wallet-store", "some-data");

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    const { result } = renderHook(() => useConnectWallet());

    act(() => {
      result.current.disconnect();
    });

    expect(mockWalletStoreState.setWalletState).toHaveBeenCalledWith({
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
    });
    expect(localStorage.getItem("wallet-store")).toBeNull();
  });

  // ===== Error when no address found =====

  it("shows error when wallet has no addresses", async () => {
    const mockWallet = createMockBrowserWallet({
      getUsedAddresses: vi.fn().mockResolvedValue([]),
      getUnusedAddresses: vi.fn().mockResolvedValue([]),
    });
    mockBrowserWalletEnable.mockResolvedValue(mockWallet);

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connect("lace");
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "No address found in wallet. Please ensure your wallet has an address.",
    );
  });
});
