import { Buffer } from "buffer";
import type { WalletApi } from "lucid-cardano";
import { C } from "lucid-cardano";

export async function getWalletBalance(walletApi: WalletApi) {
  const balance = await walletApi.getBalance();
  return C.Value.from_bytes(Buffer.from(balance, "hex"));
}
