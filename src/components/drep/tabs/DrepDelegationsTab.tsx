import AddressCell from "@/components/address/AddressCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { HashCell } from "@/components/tx/HashCell";
import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { drepDelegationsTableOptions } from "@/constants/tables/drepDelegationsTableOptions";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchDrepDelegations } from "@/services/drepDelegations";
import { useFetchMiscBasic } from "@/services/misc";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useDrepDelegationsTableStore } from "@/stores/tables/drepDelegationsTableStore";
import type { DrepDelegationData } from "@/types/delegationTypes";
import type { DrepDelegationsColumns, TableColumns } from "@/types/tableTypes";
import { slotToDate } from "@/utils/slotToDate";
import { useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const DrepDelegationsTab = () => {
  const { page } = useSearch({ from: "/drep/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useDrepDelegationsTableStore();

  const delegationQuery = useFetchDrepDelegations(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
  );
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);
  const [totalItems, setTotalItems] = useState(0);
  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = delegationQuery.data?.pages[0].data.count;

  const delegationColumns: TableColumns<DrepDelegationData> = [
    {
      key: "date",
      render: item => {
        return (
          <DateCell
            time={format(
              slotToDate(
                item.tx?.slot_no,
                miscConst?.epoch_stat?.pots?.slot_no ?? 0,
                miscConst?.epoch_stat?.epoch?.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      jsonFormat: item => {
        if (
          !format(
            slotToDate(
              item.tx?.slot_no,
              miscConst?.epoch_stat?.pots?.slot_no ?? 0,
              miscConst?.epoch_stat?.epoch?.start_time ?? "",
            ),
            "yyy-MM-dd HH:mm:ss",
          )
        ) {
          return "-";
        }

        return format(
          slotToDate(
            item.tx?.slot_no,
            miscConst?.epoch_stat?.pots?.slot_no ?? 0,
            miscConst?.epoch_stat?.epoch?.start_time ?? "",
          ),
          "yyy-MM-dd HH:mm:ss",
        );
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 55,
    },
    {
      key: "address",
      render: item => (
        <AddressCell
          enableHover
          address={item.view}
          amount={item.active_stake}
        />
      ),
      jsonFormat: item => {
        if (!item.view) {
          return "-";
        }

        return item.view;
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 90,
    },
    {
      key: "amount",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          <AdaWithTooltip data={item?.live_stake ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>Amount</span>
        </div>
      ),
      visible: columnsVisibility.amount,
      widthPx: 50,
    },
    {
      key: "delegation",
      render: item => (
        <div className='grid w-full grid-cols-7 items-center gap-1/2'>
          {item.drep?.previous?.id && (
            <>
              <div className='col-span-3'>
                <DrepNameCell
                  item={{
                    data: {
                      given_name: item.drep.previous.meta?.given_name,
                    },
                    hash: { view: item.drep.previous.id },
                  }}
                />
              </div>
              <div className='col-span-1 flex items-center justify-center'>
                <ArrowRight size={18} className='shrink-0' />
              </div>
            </>
          )}
          <div className='col-span-3'>
            <DrepNameCell
              item={{
                data: {
                  given_name: item.drep.live.meta?.given_name,
                },
                hash: { view: item.drep.live.id },
              }}
            />
          </div>
        </div>
      ),
      jsonFormat: item => {
        return [item.drep?.previous?.id, item.drep.live.id]
          .filter(e => e)
          .join(" -> ");
      },
      title: "Delegation",
      visible: columnsVisibility.delegation,
      widthPx: 190,
    },
    {
      key: "tx",
      render: item => {
        return <HashCell hash={item.tx.hash} />;
      },
      jsonFormat: item => {
        if (!item.tx.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: "Tx",
      visible: columnsVisibility.tx,
      widthPx: 80,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <>
      <div className='mb-1 flex w-full flex-col justify-between gap-1 min-[870px]:flex-row min-[870px]:items-center'>
        <div className='flex flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {delegationQuery.isLoading || delegationQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems !== undefined ? (
            <h3 className='basis-[230px] text-nowrap'>
              Total of {formatNumber(totalItems)} delegations
            </h3>
          ) : (
            ""
          )}
          <div className='flex w-full justify-end min-[870px]:hidden'>
            <div className='flex items-center gap-1 min-[870px]:hidden'>
              <ExportButton
                columns={delegationColumns}
                items={items}
                currentPage={page ?? 1}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={drepDelegationsTableOptions.map(item => {
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
          <div className='hidden items-center gap-1 min-[870px]:flex'>
            <ExportButton
              columns={delegationColumns}
              items={items}
              currentPage={page ?? 1}
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={drepDelegationsTableOptions.map(item => {
                return {
                  label: item.name,
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
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        rowHeight={65}
        minContentWidth={1000}
        scrollable
        query={delegationQuery}
        items={items}
        columns={delegationColumns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof DrepDelegationsColumns) -
            columnsOrder.indexOf(b.key as keyof DrepDelegationsColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
