import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

// --- Hoisted mocks ---

const { mockHandleDelegation } = vi.hoisted(() => ({
  mockHandleDelegation: vi.fn(),
}));

// --- Store mocks ---

import { mockWalletStoreState } from "../../../mocks/walletStore";
import "../../../mocks/useAppTranslation";

// --- Module mocks ---

vi.mock("@/utils/wallet/handleDelegation", () => ({
  handleDelegation: (...args: any[]) => mockHandleDelegation(...args),
}));

vi.mock("@/constants/confVariables", () => ({
  jamUrl: "https://jam.example.com/",
}));

// Stub child components
vi.mock("@/components/wallet/ConnectWalletModal", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="ConnectWalletModal">
      <button data-testid="close-wallet-modal" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

vi.mock("@/components/wallet/DelegationConfirmModal", () => ({
  DelegationConfirmModal: ({
    onConfirm,
    onCancel,
    info,
  }: {
    onConfirm: (amount: number) => void;
    onCancel: () => void;
    info: any;
  }) => (
    <div data-testid="DelegationConfirmModal" data-ident={info.ident}>
      <button
        data-testid="confirm-delegation"
        onClick={() => onConfirm(0)}
      >
        Confirm
      </button>
      <button data-testid="cancel-delegation" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

vi.mock("@/components/global/watchlist/WatchlistStar", () => ({
  WatchlistStar: () => <div data-testid="WatchlistStar" />,
}));

// SDK stubs
vi.mock("@vellumlabs/cexplorer-sdk", () => {
  const stub = (name: string) => {
    const Comp = ({ children, ...props }: { children?: ReactNode; [k: string]: any }) => {
      const filtered: Record<string, any> = {};
      for (const [key, value] of Object.entries(props)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          filtered[`data-${key.toLowerCase()}`] = String(value);
        }
      }
      return <div data-testid={name} {...filtered}>{children}</div>;
    };
    Comp.displayName = name;
    return Comp;
  };

  return {
    Button: ({ label, onClick, ...props }: any) => (
      <button data-testid={`Button-${label}`} onClick={onClick}>
        {label}
      </button>
    ),
    ShareButton: stub("ShareButton"),
    LoadingSkeleton: stub("LoadingSkeleton"),
  };
});

vi.mock("lucide-react", () => ({
  ShoppingBasket: () => <span data-testid="ShoppingBasket" />,
}));

// --- Import under test ---

import { WatchlistSection } from "@/components/global/watchlist/WatchlistSection";
import { createMockBrowserWallet, persistedWalletState } from "../../../fixtures/wallet";
import { createMockQueryResult } from "../../../mocks/services";

describe("WatchlistSection", () => {
  const defaultPoolQuery = {
    ...createMockQueryResult({
      data: {
        pool_name: { name: "Test Pool", ticker: "TST" },
        pool_id: "pool1abc123",
      },
    }),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleDelegation.mockResolvedValue("tx-hash");

    // Reset wallet store
    Object.assign(mockWalletStoreState, {
      address: undefined,
      stakeKey: undefined,
      walletType: undefined,
      disabledExt: false,
      wallet: null,
      setWalletState: vi.fn(),
    });
  });

  // ===== BUG SCENARIO =====

  it("shows ConnectWalletModal when address+walletType exist but wallet is null", () => {
    // Bug state: localStorage restored address+walletType, wallet not yet reconnected
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: null,
    });

    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={false}
        poolDetailQuery={defaultPoolQuery}
      />,
    );

    const delegateBtn = screen.getByTestId(
      "Button-global.watchlist.delegate",
    );
    fireEvent.click(delegateBtn);

    // Should show connect modal, NOT delegation modal
    expect(screen.getByTestId("ConnectWalletModal")).toBeInTheDocument();
    expect(
      screen.queryByTestId("DelegationConfirmModal"),
    ).not.toBeInTheDocument();
  });

  // ===== Fully connected =====

  it("shows DelegationConfirmModal when wallet is fully connected", () => {
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={false}
        poolDetailQuery={defaultPoolQuery}
      />,
    );

    const delegateBtn = screen.getByTestId(
      "Button-global.watchlist.delegate",
    );
    fireEvent.click(delegateBtn);

    expect(
      screen.getByTestId("DelegationConfirmModal"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("ConnectWalletModal"),
    ).not.toBeInTheDocument();
  });

  // ===== Delegation confirm calls handleDelegation =====

  it("calls handleDelegation with wallet instance on confirm", async () => {
    const wallet = createMockBrowserWallet();
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet,
    });

    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={false}
        poolDetailQuery={defaultPoolQuery}
      />,
    );

    // Open delegation modal
    fireEvent.click(
      screen.getByTestId("Button-global.watchlist.delegate"),
    );

    // Confirm delegation
    fireEvent.click(screen.getByTestId("confirm-delegation"));

    expect(mockHandleDelegation).toHaveBeenCalledWith(
      {
        type: "pool",
        ident: "pool1abc123",
        donationAmount: 0,
      },
      wallet,
    );
  });

  // ===== Pool retired hides delegate button =====

  it("does not show delegate button when pool is retired", () => {
    Object.assign(mockWalletStoreState, {
      ...persistedWalletState,
      wallet: createMockBrowserWallet(),
    });

    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={false}
        poolDetailQuery={defaultPoolQuery}
        isPoolRetiredOrRetiring={true}
      />,
    );

    expect(
      screen.queryByTestId("Button-global.watchlist.delegate"),
    ).not.toBeInTheDocument();
  });

  // ===== Loading state =====

  it("renders skeletons when loading", () => {
    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={true}
        poolDetailQuery={defaultPoolQuery}
      />,
    );

    const skeletons = screen.getAllByTestId("LoadingSkeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });

  // ===== Not connected at all =====

  it("shows ConnectWalletModal when completely disconnected", () => {
    render(
      <WatchlistSection
        ident="pool1abc123"
        isLoading={false}
        poolDetailQuery={defaultPoolQuery}
      />,
    );

    const delegateBtn = screen.getByTestId(
      "Button-global.watchlist.delegate",
    );
    fireEvent.click(delegateBtn);

    expect(screen.getByTestId("ConnectWalletModal")).toBeInTheDocument();
  });
});
