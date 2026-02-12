import type { TxListTableColumns } from "@/types/tableTypes";
import type { TxBasicInfo } from "@/types/txTypes";
import type { Dispatch, SetStateAction } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { ToggleButton } from "@/components/global/ToggleButton";

import { useFetchMiscBasic } from "@/services/misc";
import { useFetchTxList } from "@/services/tx";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useTxListTableStore } from "@/stores/tables/txListTableStore";
import { useEffect, useState } from "react";
import { useMiscConst } from "../useMiscConst";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useSearchTable } from "./useSearchTable";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { isHex } from "@/utils/isHex";

interface UseTxList {
  specifiedParams: string | true | undefined;
  totalItems: number;
  txListQuery: ReturnType<typeof useFetchTxList>;
  columns: any[];
  items: TxBasicInfo[] | undefined;
  tableSearch: string;
  setTableSearch: Dispatch<SetStateAction<string>>;
  columnsVisibility: TxListTableColumns;
  setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
}

interface UseTxListArgs {
  page: number | undefined;
  address?: string;
  asset?: string;
  stake?: string;
  script?: string;
  isDonationPage?: boolean;
  policyId?: string;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
}

export const useTxList = ({
  page,
  address,
  asset,
  isDonationPage,
  policyId,
  script,
  stake,
  storeKey,
  overrideRows,
  overrideTableSearch,
}: UseTxListArgs): UseTxList => {
  const { t } = useAppTranslation("pages");
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { rows, columnsVisibility, setColumnVisibility } =
    useTxListTableStore(storeKey)();

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const [totalItems, setTotalItems] = useState(0);

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const txListQuery = useFetchTxList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : debouncedTableSearch
        ? 0
        : overrideRows
          ? (page ?? 1) * overrideRows - overrideRows
          : (page ?? 1) * rows - rows,
    overrideTableSearch
      ? overrideTableSearch
      : isHex(debouncedTableSearch)
        ? debouncedTableSearch
        : undefined,
    isHex(debouncedTableSearch)
      ? undefined
      : stake
        ? undefined
        : address
          ? debouncedTableSearch
            ? undefined
            : address
          : undefined,
    isHex(debouncedTableSearch) ? undefined : stake ? stake : undefined,
    isHex(debouncedTableSearch) ? undefined : asset ? asset : undefined,
    isHex(debouncedTableSearch) ? undefined : script ? script : undefined,
    isDonationPage ? 1 : undefined,
    isHex(debouncedTableSearch) ? undefined : policyId ? policyId : undefined,
  );

  const totalTxs = txListQuery.data?.pages[0].data.count;
  const items = txListQuery.data?.pages.flatMap(page => page.data.data);
  const specifiedParams =
    address || asset || stake || script || isDonationPage || policyId;

  const columns = [
    {
      key: "date",
      render: item => <DateCell time={item?.block?.time} />,
      jsonFormat: item => {
        if (!item?.block?.time) {
          return "-";
        }

        return item?.block?.time;
      },
      title: t("common:labels.date"),
      visible: columnsVisibility.date,
      widthPx: 60,
    },
    {
      key: "hash",
      render: item => <HashCell hash={item.hash} />,
      jsonFormat: item => {
        if (!item?.hash) {
          return "-";
        }

        return item?.hash;
      },
      title: t("common:labels.hash"),
      visible: columnsVisibility.hash,
      widthPx: 120,
    },
    {
      key: "block",
      render: item => (
        <div className='flex items-center justify-end gap-[2px] text-primary'>
          <EpochCell no={item?.block?.epoch_no} />
          /
          <BlockCell hash={item?.block?.hash} no={item?.block?.no ?? 0} />
        </div>
      ),
      jsonFormat: item =>
        formatNumber(item?.block?.epoch_no ?? 0) +
        " / " +
        formatNumber(item?.block?.no ?? 0),
      title: (
        <p className='w-full text-right'>{t("common:labels.epochBlock")}</p>
      ),
      visible: columnsVisibility.block,
      widthPx: 65,
    },
    {
      key: "total_output",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.out_sum ?? 0} />
        </span>
      ),
      title: (
        <p className='w-full text-right'>{t("common:labels.totalOutput")}</p>
      ),
      visible: columnsVisibility.total_output,
      widthPx: 75,
    },
    {
      key: "donation",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.treasury_donation ?? 0} />
        </span>
      ),
      title: (
        <p className='w-full text-right'>
          {t("transactions.table.treasuryDonation")}
        </p>
      ),
      visible: isDonationPage || columnsVisibility.donation,
      widthPx: 80,
    },
    {
      key: "fee",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.fee ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>{t("common:labels.fee")}</p>,
      visible: columnsVisibility.fee,
      widthPx: 75,
    },
    {
      key: "size",
      render: item => (
        <SizeCell
          size={item.size}
          maxSize={miscConst?.epoch_param.max_tx_size ?? 0}
        />
      ),

      jsonFormat: item => {
        const elapsedPercentage =
          (item?.size * 100) / (miscConst?.epoch_param?.max_tx_size ?? 0);

        return (
          "Size: " +
          ((item?.size ?? 0) / 1024).toFixed(2) +
          "kB" +
          " Percentage: " +
          (elapsedPercentage ?? 0).toFixed(2) +
          "%"
        );
      },
      title: <p className='w-full text-right'>{t("common:labels.size")}</p>,
      visible: columnsVisibility.size,
      widthPx: 70,
    },
    {
      key: "script_size",
      render: item => (
        <span className='flex justify-end'>
          {formatNumber(item?.script_size)}
        </span>
      ),
      jsonFormat: item => {
        return item?.script_size;
      },
      title: (
        <p className='w-full text-right'>
          {t("transactions.table.scriptSize")}
        </p>
      ),
      visible: columnsVisibility.script_size,
      widthPx: 50,
    },
    {
      key: "toggle",
      render: (_item: TxBasicInfo, toggle?: () => void) => (
        <div className='flex w-full justify-end'>
          <ToggleButton toggle={toggle} />
        </div>
      ),
      title: "",
      visible: true,
      widthPx: 10,
      toggleCell: true,
    },
  ];

  useEffect(() => {
    if (totalTxs && totalTxs !== totalItems) {
      setTotalItems(totalTxs);
    }
  }, [totalTxs, totalItems]);

  return {
    specifiedParams,
    totalItems,
    txListQuery,
    columns,
    items,
    tableSearch,
    columnsVisibility,
    setColumnVisibility,
    setTableSearch,
  };
};
