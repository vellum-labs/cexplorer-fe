import type { TxInfo } from "@/types/txTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

export type UtxoSearchMatchType =
  | "payment_address"
  | "payment_credential"
  | "stake_address"
  | "tx_hash"
  | "consumed_by"
  | "index"
  | "value"
  | "asset";

export interface UtxoSearchResult {
  matches: boolean;
  matchTypes: UtxoSearchMatchType[];
}

export const filterUtxoBySearch = (
  utxo: TxInfo,
  searchQuery: string,
): UtxoSearchResult => {
  if (!searchQuery || searchQuery.trim() === "")
    return { matches: true, matchTypes: [] };

  const query = searchQuery.toLowerCase().trim();
  const matchTypes: UtxoSearchMatchType[] = [];

  if (utxo.payment_addr_bech32?.toLowerCase().includes(query))
    matchTypes.push("payment_address");

  if (utxo.payment_addr_cred?.toLowerCase().includes(query))
    matchTypes.push("payment_credential");

  if (isValidAddress(utxo.payment_addr_bech32)) {
    const stakeAddr = Address.from(utxo.payment_addr_bech32).rewardAddress;
    if (stakeAddr?.toLowerCase().includes(query))
      matchTypes.push("stake_address");
  }

  if (
    utxo.stake_addr?.toLowerCase().includes(query) &&
    !matchTypes.includes("stake_address")
  )
    matchTypes.push("stake_address");

  if (utxo.tx_hash?.toLowerCase().includes(query)) matchTypes.push("tx_hash");

  if (utxo.consumed_utxo?.toLowerCase().includes(query))
    matchTypes.push("consumed_by");

  if (utxo.tx_index?.toString().includes(query)) matchTypes.push("index");

  const formattedValue = lovelaceToAda(utxo.value ?? 0);
  if (formattedValue.toLowerCase().includes(query)) matchTypes.push("value");

  return { matches: matchTypes.length > 0, matchTypes };
};
