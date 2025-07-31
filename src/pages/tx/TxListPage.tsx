import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import type { TxListTableColumns } from "@/types/tableTypes";
import type { FC } from "react";
import { txListTableOptions } from "@/constants/tables/txListTableOptions";
import { useTxList } from "@/hooks/tables/useTxList";
import { useTxListTableStore } from "@/stores/tables/txListTableStore";
import { formatNumber } from "@/utils/format/format";
import { useSearch } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";

interface TxListPageProps {
  address?: string;
  asset?: string;
  stake?: string;
  script?: string;
  isDonationPage?: boolean;
  policyId?: string;
}

export const TxListPage: FC<TxListPageProps> = ({
  address,
  asset,
  stake,
  script,
  isDonationPage,
  policyId,
}) => {
  const { page } = useSearch({
    from:
      stake && !address
        ? "/stake/$stakeAddr"
        : isDonationPage
          ? "/treasury/donation"
          : address
            ? "/address/$address"
            : script
              ? "/script/$hash"
              : asset
                ? "/asset/$fingerprint"
                : policyId
                  ? "/policy/$policyId"
                  : "/tx/",
  });

  const {
    specifiedParams,
    totalItems,
    txListQuery,
    columns,
    items,
    tableSearch,
    setTableSearch,
  } = useTxList({
    page,
    address,
    asset,
    isDonationPage,
    policyId,
    script,
    stake,
  });

  const {
    columnsVisibility,
    rows,
    columnsOrder,
    setColumnVisibility,
    setRows,
    setColumsOrder,
  } = useTxListTableStore()();

  return (
    <PageBase
      showMetadata={!specifiedParams}
      metadataTitle='transactionList'
      showHeader={!specifiedParams}
      adsCarousel={!specifiedParams}
      title='Transactions'
      breadcrumbItems={[{ label: "Transactions" }]}
    >
      <section
        className={`flex w-full max-w-desktop flex-col ${specifiedParams ? "" : "px-mobile pb-5 md:px-desktop"}`}
      >
        <div className='mb-4 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap'>
            {totalItems === 0 &&
            (txListQuery.isLoading || txListQuery.isFetching) ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : totalItems > 0 ? (
              <h3 className='basis-[230px] text-nowrap'>
                Total of {formatNumber(totalItems)} transactions
              </h3>
            ) : (
              ""
            )}
            <div className='flex justify-end max-[435px]:w-full md:hidden'>
              <div className='flex items-center gap-2 md:hidden'>
                <ExportButton columns={columns} items={items} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  columnsOptions={txListTableOptions.map(item => {
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

          <div className='flex gap-2'>
            <TableSearchInput
              placeholder='Search by tx hash...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
            <div className='hidden items-center gap-2 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={txListTableOptions.map(item => {
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
          minContentWidth={1200}
          scrollable
          query={txListQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof TxListTableColumns) -
              columnsOrder.indexOf(b.key as keyof TxListTableColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
