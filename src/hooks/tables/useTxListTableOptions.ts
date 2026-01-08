import { useMemo } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { BasicTableOptions, TxListTableColumns } from "@/types/tableTypes";

interface TxListOptions {
  key: keyof BasicTableOptions<TxListTableColumns>["columnsVisibility"];
  name: string;
}

export const useTxListTableOptions = () => {
  const { t } = useAppTranslation("pages");

  const txListTableOptions: TxListOptions[] = useMemo(
    () => [
      {
        key: "date",
        name: t("transactions.table.date"),
      },
      {
        key: "hash",
        name: t("transactions.table.hash"),
      },
      {
        key: "block",
        name: t("transactions.table.block"),
      },
      {
        key: "total_output",
        name: t("transactions.table.totalOutput"),
      },
      {
        key: "donation",
        name: t("transactions.table.treasuryDonation"),
      },
      {
        key: "fee",
        name: t("transactions.table.fee"),
      },
      {
        key: "size",
        name: t("transactions.table.size"),
      },
      {
        key: "script_size",
        name: t("transactions.table.scriptSize"),
      },
    ],
    [t]
  );

  return txListTableOptions;
};
