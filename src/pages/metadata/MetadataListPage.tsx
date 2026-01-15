import type { MetadataTxListItem } from "@/types/metadataTypes";
import type {
  MetadataTxListTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Info } from "lucide-react";

import { useFetchMetadataTxList } from "@/services/metadata";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useMetadataTxListTableStore } from "@/stores/tables/metadataTxListTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import { MetadataCell } from "@/components/metadata/MetadataCell";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";
import { metadataTxListTableOptions } from "@/constants/tables/metadataTxListTableOptions";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { findLabel } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { isHex } from "@/utils/isHex";
import { isTextNumeric } from "@/utils/isTextNumeric";
import { slotToDate } from "@/utils/slotToDate";
import { format } from "date-fns";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const MetadataListPage: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/metadata/" });

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useMetadataTxListTableStore();

  const [
    { debouncedTableSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["hash", "key"],
  });

  const [totalItems, setTotalItems] = useState(0);

  const metadataQuery = useFetchMetadataTxList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    searchPrefix === "hash" && debouncedTableSearch
      ? debouncedTableSearch
      : undefined,
    searchPrefix === "key" && debouncedTableSearch
      ? +debouncedTableSearch
      : undefined,
  );

  const totalTxs = metadataQuery.data?.pages[0].data.count;
  const items = metadataQuery.data?.pages.flatMap(page => page.data.data);

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const columns: TableColumns<MetadataTxListItem> = [
    {
      key: "key",
      render: item => {
        if (!item?.tx?.slot_no) {
          return "-";
        }

        return (
          <DateCell
            time={format(
              slotToDate(
                item?.tx?.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 60,
    },
    {
      key: "key",
      render: item => {
        const label = findLabel("metadatum", item?.key, miscConst);

        return (
          <div className='flex items-center gap-1/2'>
            <p title={String(item?.key)}>
              {item?.key ? formatNumber(item.key) : "-"}
            </p>
            {label && (
              <Tooltip
                content={<p className='w-[120px] text-center'>{label}</p>}
              >
                <Info size={12} />
              </Tooltip>
            )}
          </div>
        );
      },
      title: <p>Key</p>,
      visible: columnsVisibility.key,
      widthPx: 60,
    },
    {
      key: "hash",
      render: item => (
        <div className='flex items-center gap-1'>
          <Link
            to='/tx/$hash'
            params={{
              hash: item?.tx?.hash,
            }}
            title={String(item?.tx?.hash)}
            className='text-primary'
          >
            {item?.tx?.hash ? formatString(item?.tx?.hash, "long") : "-"}
          </Link>
          {item?.tx?.hash && (
            <Copy copyText={item?.tx?.hash} className='translate-y-[2px]' />
          )}
        </div>
      ),
      jsonFormat: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: <p>TX Hash</p>,
      visible: columnsVisibility.hash,
      widthPx: 60,
    },
    {
      key: "size",
      render: item => (
        <SizeCell
          maxSize={miscConst?.epoch_param.max_tx_size ?? 0}
          size={item.size}
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
      title: <p className='w-full text-right'>Size</p>,
      visible: columnsVisibility.size,
      widthPx: 30,
    },
    {
      key: "md",
      render: item => <MetadataCell metadata={item.md} />,
      jsonFormat: item => {
        if (!item.md) {
          return "-";
        }

        return JSON.stringify(item.md);
      },
      title: <p className='w-full text-right'>Metadata</p>,
      visible: columnsVisibility.md,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalTxs && totalTxs !== totalItems) {
      setTotalItems(totalTxs);
    }
  }, [totalTxs, totalItems]);

  return (
    <PageBase
      metadataTitle='metadataTxList'
      title='Metadata Transactions List'
      breadcrumbItems={[{ label: "Metadata Transactions List" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
            {metadataQuery.isLoading || metadataQuery.isFetching ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : totalItems > 0 ? (
              <h3 className='basis-[230px] text-nowrap'>
                Total of {formatNumber(totalItems)} transactions
              </h3>
            ) : (
              ""
            )}
            <div className='flex w-full justify-end md:hidden'>
              <div className='flex items-center gap-1 md:hidden'>
                <ExportButton columns={columns} items={items} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  columnsOptions={metadataTxListTableOptions.map(item => {
                    return {
                      label: item.name,
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
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              prefixes={[
                {
                  key: "hash",
                  name: "Hash",
                  show: tableSearch.length < 1 || isHex(tableSearch),
                },
                {
                  key: "key",
                  name: "Key",
                  show: isTextNumeric(tableSearch),
                },
              ]}
              searchPrefix={searchPrefix}
              setSearchPrefix={setSearchPrefix}
            />
            <div className='hidden items-center gap-1 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={metadataTxListTableOptions.map(item => {
                  return {
                    label: item.name,
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
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={metadataQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof MetadataTxListTableColumns) -
              columnsOrder.indexOf(b.key as keyof MetadataTxListTableColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
