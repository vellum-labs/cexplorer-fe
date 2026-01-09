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
        name: t("common:labels.date"),
      },
      {
        key: "hash",
        name: t("common:labels.hash"),
      },
      {
        key: "block",
        name: t("common:labels.block"),
      },
      {
        key: "total_output",
        name: t("common:labels.totalOutput"),
      },
      {
        key: "donation",
        name: t("transactions.table.treasuryDonation"),
      },
      {
        key: "fee",
        name: t("common:labels.fee"),
      },
      {
        key: "size",
        name: t("common:labels.size"),
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
