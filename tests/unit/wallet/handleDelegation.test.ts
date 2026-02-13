import { vi, describe, it, expect, beforeEach } from "vitest";
import { createMockBrowserWallet } from "../fixtures/wallet";

// --- Mocks ---

const mockCallDelegationToast = vi.fn();
vi.mock("@/utils/error/callDelegationToast", () => ({
  callDelegationToast: (...args: any[]) => mockCallDelegationToast(...args),
}));

const mockSendDelegationInfo = vi.fn();
vi.mock("@/services/tool", () => ({
  sendDelegationInfo: (...args: any[]) => mockSendDelegationInfo(...args),
}));

const mockValidateDonationNetwork = vi.fn().mockResolvedValue({ valid: true });
vi.mock("@/utils/wallet/validateDonationNetwork", () => ({
  validateDonationNetwork: (...args: any[]) =>
    mockValidateDonationNetwork(...args),
}));

vi.mock("@/constants/confVariables", () => ({
  donationAddress: "addr1_test_donation_address",
}));

const mockComplete = vi.fn().mockResolvedValue("unsigned-tx-hex");
const mockTxBuilder = {
  delegateStakeCertificate: vi.fn().mockReturnThis(),
  voteDelegationCertificate: vi.fn().mockReturnThis(),
  registerStakeCertificate: vi.fn().mockReturnThis(),
  txOut: vi.fn().mockReturnThis(),
  selectUtxosFrom: vi.fn().mockReturnThis(),
  changeAddress: vi.fn().mockReturnThis(),
  complete: mockComplete,
};

vi.mock("@meshsdk/core", () => ({
  BlockfrostProvider: class MockBlockfrostProvider {},
  MeshTxBuilder: class MockMeshTxBuilder {
    delegateStakeCertificate = mockTxBuilder.delegateStakeCertificate;
    voteDelegationCertificate = mockTxBuilder.voteDelegationCertificate;
    registerStakeCertificate = mockTxBuilder.registerStakeCertificate;
    txOut = mockTxBuilder.txOut;
    selectUtxosFrom = mockTxBuilder.selectUtxosFrom;
    changeAddress = mockTxBuilder.changeAddress;
    complete = mockTxBuilder.complete;
  },
}));

// --- Import under test ---

import { handleDelegation } from "@/utils/wallet/handleDelegation";

// --- Tests ---

describe("handleDelegation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockComplete.mockResolvedValue("unsigned-tx-hex");
  });

  // ===== BUG SCENARIO: wallet is null =====

  it("shows 'Wallet not connected' error when wallet is null (pool)", async () => {
    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      null,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage:
        "Wallet not connected. Please connect your wallet first.",
    });
  });

  it("shows 'Wallet not connected' error when wallet is null (drep)", async () => {
    await handleDelegation(
      { type: "drep", ident: "drep1abc123" },
      null,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage:
        "Wallet not connected. Please connect your wallet first.",
    });
  });

  // ===== Validation errors =====

  it("shows 'Missing poolId' error when ident is empty", async () => {
    const wallet = createMockBrowserWallet();
    await handleDelegation({ type: "pool", ident: "" }, wallet as any);

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "Missing poolId.",
    });
  });

  it("shows 'Missing DRep ID' error when drep ident is empty", async () => {
    const wallet = createMockBrowserWallet();
    await handleDelegation({ type: "drep", ident: "" }, wallet as any);

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "Missing DRep ID.",
    });
  });

  it("shows error when wallet has no reward address", async () => {
    const wallet = createMockBrowserWallet({
      getRewardAddresses: vi.fn().mockResolvedValue([]),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "No reward address from wallet.",
    });
  });

  it("shows error when wallet has no UTxOs", async () => {
    const wallet = createMockBrowserWallet({
      getUtxos: vi.fn().mockResolvedValue([]),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage:
        "Wallet has no UTxOs. Fund the wallet (deposit + fees required).",
    });
  });

  // ===== Successful delegation =====

  it("delegates to a pool successfully", async () => {
    const wallet = createMockBrowserWallet();

    const result = await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(wallet.signTx).toHaveBeenCalledWith("unsigned-tx-hex");
    expect(wallet.submitTx).toHaveBeenCalledWith("signed-tx-hex");
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
    expect(mockSendDelegationInfo).toHaveBeenCalledWith(
      "tx-hash-abc123",
      "pool1abc123",
      "delegation",
      0,
    );
    expect(result).toBe("tx-hash-abc123");
  });

  it("delegates to drep_always_abstain", async () => {
    const wallet = createMockBrowserWallet();

    await handleDelegation(
      { type: "drep", ident: "drep_always_abstain" },
      wallet as any,
    );

    expect(mockTxBuilder.voteDelegationCertificate).toHaveBeenCalledWith(
      { alwaysAbstain: null },
      expect.any(String),
    );
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
  });

  it("delegates to drep_always_no_confidence", async () => {
    const wallet = createMockBrowserWallet();

    await handleDelegation(
      { type: "drep", ident: "drep_always_no_confidence" },
      wallet as any,
    );

    expect(mockTxBuilder.voteDelegationCertificate).toHaveBeenCalledWith(
      { alwaysNoConfidence: null },
      expect.any(String),
    );
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
  });

  it("delegates to a regular DRep", async () => {
    const wallet = createMockBrowserWallet();

    await handleDelegation(
      { type: "drep", ident: "drep1xyz789" },
      wallet as any,
    );

    expect(mockTxBuilder.voteDelegationCertificate).toHaveBeenCalledWith(
      { dRepId: "drep1xyz789" },
      expect.any(String),
    );
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
  });

  // ===== Stake key not registered retry =====

  it("retries with registration when stake key is not registered", async () => {
    const wallet = createMockBrowserWallet();

    // First submitTx fails with StakeKeyNotRegisteredDELEG (as plain object so JSON.stringify works)
    wallet.submitTx
      .mockRejectedValueOnce({ message: "StakeKeyNotRegisteredDELEG" })
      .mockResolvedValueOnce("tx-hash-retry");

    const result = await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    // Should have been called twice (first attempt + retry)
    expect(wallet.signTx).toHaveBeenCalledTimes(2);
    expect(mockTxBuilder.registerStakeCertificate).toHaveBeenCalled();
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
    expect(result).toBe("tx-hash-retry");
  });

  // ===== User cancellation =====

  it("shows cancellation toast when user declines signing", async () => {
    const wallet = createMockBrowserWallet({
      signTx: vi.fn().mockRejectedValue(new Error("user declined signing")),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "Transaction cancelled by user",
    });
  });

  it("shows cancellation toast for TxSignError", async () => {
    const wallet = createMockBrowserWallet({
      signTx: vi
        .fn()
        .mockRejectedValue({ message: "cancelled", cause: { failure: { cause: { info: "" } } } }),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "Transaction cancelled by user",
    });
  });

  // ===== Hardware wallet errors =====

  it("shows hardware wallet error for ledger issues", async () => {
    const wallet = createMockBrowserWallet({
      signTx: vi.fn().mockRejectedValue(new Error("device not found")),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage:
        "Hardware wallet connection issue. Please check your device connection.",
    });
  });

  // ===== Donation network validation =====

  it("shows error when donation network validation fails", async () => {
    mockValidateDonationNetwork.mockResolvedValueOnce({
      valid: false,
      message: "Network mismatch: Wallet is on Testnet but donation address is for Mainnet.",
    });

    const wallet = createMockBrowserWallet();

    await handleDelegation(
      { type: "pool", ident: "pool1abc123", donationAmount: 5 },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage:
        "Network mismatch: Wallet is on Testnet but donation address is for Mainnet.",
    });
  });

  // ===== Delegation with donation =====

  it("includes donation output in transaction", async () => {
    const wallet = createMockBrowserWallet();

    await handleDelegation(
      { type: "pool", ident: "pool1abc123", donationAmount: 5 },
      wallet as any,
    );

    expect(mockTxBuilder.txOut).toHaveBeenCalledWith(
      "addr1_test_donation_address",
      [{ unit: "lovelace", quantity: "5000000" }],
    );
    expect(mockCallDelegationToast).toHaveBeenCalledWith({ success: true });
  });

  // ===== Generic failure =====

  it("shows generic pool delegation failure message", async () => {
    const wallet = createMockBrowserWallet({
      signTx: vi.fn().mockRejectedValue({ message: "", cause: {} }),
    });

    await handleDelegation(
      { type: "pool", ident: "pool1abc123" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "Delegation failed. Please try again.",
    });
  });

  it("shows generic DRep delegation failure message", async () => {
    const wallet = createMockBrowserWallet({
      signTx: vi.fn().mockRejectedValue({ message: "", cause: {} }),
    });

    await handleDelegation(
      { type: "drep", ident: "drep1xyz" },
      wallet as any,
    );

    expect(mockCallDelegationToast).toHaveBeenCalledWith({
      errorMessage: "DRep delegation failed. Please try again.",
    });
  });
});
