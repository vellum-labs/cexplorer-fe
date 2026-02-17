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

    
    Object.assign(mockWalletStoreState, {
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
      setWalletState: vi.fn(),
    });

    
    mockAuthTokensState.tokens = {};

    
    originalLocation = window.location;
  });

  afterEach(() => {
    vi.useRealTimers();
   
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


  it("returns both modals closed when no URL action", () => {
    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(false);
    expect(result.current.showDelegationModal).toBe(false);
  });

 

  it("shows wallet modal when URL has action=delegate and wallet is not connected", () => {
    setUrlAction("delegate");

    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);
    expect(result.current.showDelegationModal).toBe(false);
  });

  

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

  
  it("should NOT open delegation modal when wallet instance is null (URL action)", () => {
    setUrlAction("delegate");

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null, 
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    const { result } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showDelegationModal).toBe(false);
    expect(result.current.showWalletModal).toBe(true);
  });

  it("should NOT resolve pending delegation without wallet instance", () => {
    setUrlAction("delegate");

    const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null,
    });
    mockAuthTokensState.tokens = {
      [persistedWalletState.address]: { token: "auth-token-123" },
    };

    rerender();

   expect(result.current.showDelegationModal).toBe(false);
  });

  
  it("does NOT resolve pending delegation when auth token is missing", () => {
    setUrlAction("delegate");

    const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);

    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    rerender();

    expect(result.current.showDelegationModal).toBe(false);
  });

  it("resolves pending delegation when wallet connects and auth token arrives", () => {
    setUrlAction("delegate");

   const { result, rerender } = renderHook(() => useDelegateAction());

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showWalletModal).toBe(true);
    expect(result.current.showDelegationModal).toBe(false);

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
