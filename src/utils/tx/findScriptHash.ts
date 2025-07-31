import type { TxDetailData, TxInfo } from "@/types/txTypes";

export const FindScriptHash = (
  tx: TxInfo,
  txDetail: TxDetailData,
): string | undefined => {
  if (tx.reference_script?.hash) return tx.reference_script.hash;
  if (txDetail.plutus_contracts.some(contract => contract.script_hash)) {
    return txDetail.plutus_contracts.find(contract => contract.script_hash)
      ?.script_hash;
  }

  return undefined;
};
