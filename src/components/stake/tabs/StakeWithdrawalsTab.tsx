import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { stakeWithdrawalTableOptions } from "@/constants/tables/stakeWithdrawalsTableOptions";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { useFetchWithdrawals } from "@/services/account";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useStakeWithdrawalsTableStore } from "@/stores/tables/stakeWithdrawalsTableStore";
import type { Withdrawal } from "@/types/accountTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { StakeWithdrawalsColumns, TableColumns } from "@/types/tableTypes";
import {
  formatNumber,
  formatString,
  DateCell,
} from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  view: string;
  miscConst: MiscConstResponseData | undefined;
}

export const StakeWithdrawalsTab = ({ view, miscConst }: Props) => {
  const { t } = useAppTranslation("pages");
  const {
    columnsOrder,
    columnsVisibility,
    setColumnVisibility,
    setColumsOrder,
    rows,
    setRows,
  } = useStakeWithdrawalsTableStore();
  const { page } = useSearch({ from: "/stake/$stakeAddr" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const query = useFetchWithdrawals(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    view,
  );
  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const items = query.data?.pages
    .flatMap(page => page.data.data)
    .filter(item => item.tx.hash.includes(debouncedTableSearch));

  const columns: TableColumns<Withdrawal> = [
    {
      key: "date",
      render: item => <DateCell time={item?.block.time} />,
      jsonFormat: item => {
        if (!item?.block.time) {
          return "-";
        }

        return item?.block.time;
      },
      title: t("common:labels.date"),
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "hash",
      render: item => (
        <p
          className='flex items-center gap-1 text-primary'
          title={item.tx.hash}
        >
          <Link
            to='/tx/$hash'
            params={{ hash: item.tx.hash }}
            className='flex justify-end text-primary'
          >
            {formatString(item.tx.hash, "long")}
          </Link>
          <Copy copyText={item?.tx?.hash} className='stroke-grayText' />
        </p>
      ),
      jsonFormat: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return item?.tx?.hash;
      },
      title: t("common:labels.hash"),
      visible: columnsVisibility.tx_hash,
      widthPx: 80,
    },
    {
      key: "block",
      render: item => {
        return (
          <div className='flex items-center justify-end gap-[2px] text-primary'>
            <EpochCell no={item?.block?.epoch_no} />
            /
            <BlockCell hash={item?.block?.hash} no={item?.block?.no ?? 0} />
          </div>
        );
      },
      jsonFormat: item => {
        return (item?.block?.epoch_no ?? "-") + " / " + item?.block?.epoch_no;
      },
      title: (
        <p className='w-full text-right'>
          {t("stake.detailPage.withdrawalsTable.epochBlock")}
        </p>
      ),
      visible: columnsVisibility.block,
      widthPx: 55,
    },
    {
      key: "total_output",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item?.tx?.out_sum} />
        </p>
      ),
      title: (
        <p className='w-full text-right'>
          {t("stake.detailPage.withdrawalsTable.totalOutput")}
        </p>
      ),
      visible: columnsVisibility.total_output,
      widthPx: 55,
    },
    {
      key: "fee",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.tx?.fee} />
        </p>
      ),
      title: <p className='w-full text-right'>{t("common:labels.fee")}</p>,
      visible: columnsVisibility.fee,
      widthPx: 50,
    },
    {
      key: "amount",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item?.amount} />
        </p>
      ),
      title: <p className='w-full text-right'>{t("common:labels.amount")}</p>,
      visible: columnsVisibility.amount,
      widthPx: 50,
    },
    {
      key: "size",
      render: item => {
        const elapsedPercentage =
          (item?.tx.size * 100) / (miscConst?.epoch_param?.max_tx_size ?? 0);

        return (
          <div className='flex flex-col gap-1.5'>
            <span className='text-right'>
              {((item?.tx.size ?? 0) / 1024).toFixed(2)}kB
            </span>
            <div className='flex items-center justify-end gap-1'>
              <div className='relative h-3 w-2/3 overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                <span className='absolute -top-1 left-[45%] z-10 w-12 -translate-x-1/2 text-right text-[9px] font-semibold text-black'>
                  {(elapsedPercentage ?? 0).toFixed(2)}%
                </span>
                <span
                  className='absolute left-0 block h-3 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{
                    width: `${elapsedPercentage ?? 0}%`,
                  }}
                ></span>
              </div>
            </div>
          </div>
        );
      },
      jsonFormat: item => {
        const elapsedPercentage =
          (item?.tx.size * 100) / (miscConst?.epoch_param?.max_tx_size ?? 0);

        return (
          "Size: " +
          ((item?.tx.size ?? 0) / 1024).toFixed(2) +
          "kB" +
          " Percentage: " +
          (elapsedPercentage ?? 0).toFixed(2) +
          "%"
        );
      },
      title: <p className='w-full text-right'>{t("common:labels.size")}</p>,
      visible: columnsVisibility.size,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    setTotalItems(query.data?.pages[0].data.count ?? 0);
  }, [query.data?.pages[0].data.count]);

  return (
    <section className={`flex w-full max-w-desktop flex-col`}>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {totalItems === undefined ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px] text-nowrap'>
              {t("common:phrases.totalOf")} {formatNumber(totalItems)}{" "}
              {t("stake.detailPage.withdrawalsTable.withdrawals")}
            </h3>
          )}
          <div className='flex justify-end max-[435px]:w-full md:hidden'>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                rowsLabel={t("common:table.rows")}
                columnsOptions={stakeWithdrawalTableOptions.map(item => {
                  return {
                    label: t(`common:tableSettings.${item.key}`),
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                })}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder={t(
              "stake.detailPage.withdrawalsTable.searchPlaceholder",
            )}
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full'
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={stakeWithdrawalTableOptions.map(item => {
                return {
                  label: t(`common:tableSettings.${item.key}`),
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      </div>
      <GlobalTable
        type='infinite'
        scrollable
        minContentWidth={1100}
        query={query}
        items={items}
        itemsPerPage={rows}
        currentPage={page ?? 1}
        rowHeight={69}
        totalItems={totalItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof StakeWithdrawalsColumns) -
            columnsOrder.indexOf(b.key as keyof StakeWithdrawalsColumns)
          );
        })}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("common:table.displaying", { count, total })
        }
        noItemsLabel={t("common:table.noItems")}
      />
    </section>
  );
};
