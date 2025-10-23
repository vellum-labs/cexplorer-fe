import AddressCell from "@/components/address/AddressCell";
import { EpochCell } from "@/components/epoch/EpochCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { HashCell } from "@/components/tx/HashCell";
import { liveDelegationsTableOptions } from "@/constants/tables/liveDelegationsTableOptions";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchDelegations } from "@/services/delegations";
import { useFetchMiscBasic } from "@/services/misc";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useLiveDelegationsTableStore } from "@/stores/tables/liveDelegationsTableStore";
import type { DelegationData } from "@/types/delegationTypes";
import type { LiveDelegationsColumns, TableColumns } from "@/types/tableTypes";
import { slotToDate } from "@/utils/slotToDate";
import { useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const LiveDelegationsPage = () => {
  const { page } = useSearch({ from: "/live-delegations/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useLiveDelegationsTableStore();

  const delegationQuery = useFetchDelegations(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
  );
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);
  const [totalItems, setTotalItems] = useState(0);
  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = delegationQuery.data?.pages[0].data.count;

  const delegationColumns: TableColumns<DelegationData> = [
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
      key: "epoch",
      render: item => <EpochCell no={item.active_epoch_no} />,
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 25,
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
          <span>Live Stake</span>
        </div>
      ),
      visible: columnsVisibility.amount,
      widthPx: 50,
    },
    {
      key: "delegation",
      render: item => (
        <div className='grid w-full grid-cols-7 items-center gap-1/2'>
          {item.pool?.previous.id && (
            <>
              <PoolCell className='col-span-3' poolInfo={item.pool.previous} poolImageUrl={generateImageUrl(item.pool.previous.id, "ico", "pool")} />
              <div className='col-span-1 flex items-center justify-center'>
                <ArrowRight size={18} className='shrink-0' />
              </div>
            </>
          )}
          <PoolCell poolInfo={item.pool.live} className='col-span-3' poolImageUrl={generateImageUrl(item.pool.live.id, "ico", "pool")} />
        </div>
      ),
      jsonFormat: item => {
        return [item.pool?.previous.id, item.pool.live.id]
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
    <PageBase
      metadataTitle='liveDelegationsList'
      title='Live Delegations'
      breadcrumbItems={[{ label: "Live Delegations" }]}
    >
      <div className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 ml-auto flex w-fit justify-end gap-1'>
          <ExportButton
            columns={delegationColumns}
            items={items}
            currentPage={page ?? 1}
          />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={liveDelegationsTableOptions.map(item => {
              return {
                label: item.name,
                isVisible: columnsVisibility[item.key],
                onClick: () =>
                  setColumnVisibility(item.key, !columnsVisibility[item.key]),
              };
            })}
          />
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
              columnsOrder.indexOf(a.key as keyof LiveDelegationsColumns) -
              columnsOrder.indexOf(b.key as keyof LiveDelegationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </PageBase>
  );
};
