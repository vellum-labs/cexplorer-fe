import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { mockWalletStoreState } from "../mocks/walletStore";
import { mockAuthTokensState } from "../mocks/authTokensStore";
import {
  persistedWalletState,
  createMockBrowserWallet,
} from "../fixtures/wallet";

import { useDelegateAction } from "@/hooks/useDelegateAction";

describe("useDelegateAction", () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset wallet store to disconnected state
    Object.assign(mockWalletStoreState, {
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
      setWalletState: vi.fn(),
    });

    // Reset auth tokens to empty
    mockAuthTokensState.tokens = {};

    // Save original location
    originalLocation = window.location;
  });

  afterEach(() => {
    vi.useRealTimers();
    // Restore location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  const setUrlAction = (action: string) => {
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: `?action=${action}`,
        href: `http://localhost/pool/pool1abc?action=${action}`,
      },
      writable: true,
    });
    window.history.replaceState = vi.fn();
  };

  // ===== No URL action =====

  it("returns both modals closed when no URL action", () => {
    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(false);
    expect(result.current.showDelegationModal).toBe(false);
  });

  // ===== URL action=delegate, wallet NOT connected =====

  it("shows wallet modal when URL has action=delegate and wallet is not connected", () => {
    setUrlAction("delegate");

    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);
    expect(result.current.showDelegationModal).toBe(false);
  });

  // ===== URL action=delegate, wallet connected =====

  it("shows delegation modal when URL has action=delegate and wallet is connected", () => {
    setUrlAction("delegate");

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(false);
    expect(result.current.showDelegationModal).toBe(true);
  });

  // ===== BUG: wallet=null should NOT open delegation modal =====
  // Trello: "Delegation failed — Wallet not connected" when wallet IS connected
  // Root cause: useDelegateAction checks address && walletType && hasAuthToken
  // but NOT wallet. After page reload, wallet is null until BrowserWallet.enable()
  // completes. This test asserts the CORRECT behavior.
  // Remove .fails after fixing useDelegateAction.ts:37 to include `&& wallet`

  it("should NOT open delegation modal when wallet instance is null (URL action)", () => {
    setUrlAction("delegate");

    // Bug state: localStorage restored address+walletType, but wallet hasn't reconnected yet
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null, // BrowserWallet not yet reconnected
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // EXPECTED (correct) behavior: do NOT open delegation modal without wallet instance
    expect(result.current.showDelegationModal).toBe(false);
    expect(result.current.showWalletModal).toBe(true);
  });

  it("should NOT resolve pending delegation without wallet instance", () => {
    setUrlAction("delegate");

    // Start disconnected
    const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);

    // Simulate: address+walletType+token restored from localStorage, but wallet still null
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null,
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    rerender();

    // EXPECTED: delegation modal should NOT open without a live wallet instance
    expect(result.current.showDelegationModal).toBe(false);
  });

  // ===== Pending delegation resolves =====

  it("does NOT resolve pending delegation when auth token is missing", () => {
    setUrlAction("delegate");

    // Start with no wallet
    const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);

    // Simulate wallet connect (address+walletType set) but no auth token
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    rerender();

    // Without auth token, delegation modal should not open
    expect(result.current.showDelegationModal).toBe(false);
  });

  it("resolves pending delegation when wallet connects and auth token arrives", () => {
    setUrlAction("delegate");

    // Start with no wallet
    const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);
    expect(result.current.showDelegationModal).toBe(false);

    // Simulate wallet connect + auth token arrival
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    rerender();

    expect(result.current.showDelegationModal).toBe(true);
  });

  // ===== Setters work =====

  it("allows setting showWalletModal externally", () => {
    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      result.current.setShowWalletModal(true);
    });

    expect(result.current.showWalletModal).toBe(true);
  });

  it("allows setting showDelegationModal externally", () => {
    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      result.current.setShowDelegationModal(true);
    });

    expect(result.current.showDelegationModal).toBe(true);
  });
});
