import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { colors } from "@/constants/colors";
import { retiredDelegationsTableOptions } from "@/constants/tables/retiredDelegationsTableOptions";
import { useFetchRetiredPools } from "@/services/pools";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useRetiredDelegationsTableStore } from "@/stores/tables/retiredDelegationsTableStore";
import type { RetiredPoolItem } from "@/types/poolTypes";
import type {
  RetiredDelegationsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { HandCoins, SendToBack, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const RetiredDelegationsPage = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { page, order, tab } = useSearch({ from: "/retired-delegations/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const [tabParam, setTabParam] = useState<"active" | "live">(tab ?? "live");
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useRetiredDelegationsTableStore();

  const delegationQuery = useFetchRetiredPools(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    tabParam,
    order as any,
  );

  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string>(order as any);

  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const stats = delegationQuery.data?.pages[0]?.data.stat;

  const totalCount = delegationQuery.data?.pages[0].data.count;

  const tabItems = [
    {
      key: "live",
      label: t("delegations.retired.tabs.retired"),
      visible: true,
    },
    {
      key: "active",
      label: t("delegations.retired.tabs.toBeRetired"),
      visible: true,
    },
  ];

  const selectItems = [
    {
      key: "date",
      value: t("delegations.retired.sortOptions.date"),
    },
    {
      key: "live_stake",
      value: t("delegations.retired.sortOptions.liveStake"),
    },
  ];

  const delegationColumns: TableColumns<RetiredPoolItem> = [
    {
      key: "index",
      render: () => {
        return <></>;
      },
      title: <p>{t("delegations.retired.table.index")}</p>,
      standByRanking: true,
      visible: columnsVisibility.index,
      widthPx: 40,
    },
    {
      key: "pool",
      render: item => (
        <PoolCell
          poolInfo={item.name}
          poolImageUrl={generateImageUrl(item.name?.id, "ico", "pool")}
        />
      ),
      jsonFormat: item => {
        if (!item?.name?.id) {
          return "-";
        }

        const id = item?.name?.id;
        const ticker = item?.name?.meta?.ticker;
        const name = item?.name?.meta?.name;

        return ticker && name ? `[${ticker}] ${name}` : id;
      },
      title: t("delegations.retired.table.stakePool"),
      visible: columnsVisibility.pool,
      widthPx: 145,
    },
    {
      key: "epoch",
      render: item => {
        const retiringEpoch =
          tabParam === "active"
            ? item.pool_retire?.active?.retiring_epoch
            : item.pool_retire?.live?.retiring_epoch;
        return <EpochCell no={retiringEpoch} />;
      },
      title: (
        <p className='w-full text-right'>
          {tabParam === "active" ? t("delegations.retired.table.retiringInEpoch") : t("delegations.retired.table.retiredInEpoch")}
        </p>
      ),
      visible: columnsVisibility.epoch,
      widthPx: 50,
    },
    {
      key: "stake",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          <AdaWithTooltip data={item?.stat?.live ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>{t("delegations.retired.table.activeStake")}</span>
        </div>
      ),
      visible: columnsVisibility.stake,
      widthPx: 60,
    },
    {
      key: "delegators",
      render: item => <div className='text-right'>{item?.stat?.accounts}</div>,
      jsonFormat: item => {
        if (!item?.stat?.accounts) {
          return "-";
        }

        return item.stat.accounts;
      },
      title: <p className='w-full text-right'>{t("delegations.retired.table.delegators")}</p>,
      visible: columnsVisibility.delegators,
      widthPx: 50,
    },
    {
      key: "longevity",
      render: item => {
        return <p className='text-right'>{item?.stat?.epochs}</p>;
      },
      jsonFormat: item => {
        if (!item?.stat?.epochs) {
          return "-";
        }

        return item.stat.epochs;
      },
      title: <p className='w-full text-right'>{t("delegations.retired.table.longevity")}</p>,
      visible: columnsVisibility.longevity,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    navigate({
      search: {
        order: selectedItem as "date" | "live_stake",
        tab,
      } as any,
    });
  }, [selectedItem, navigate]);

  useEffect(() => {
    setSelectedItem(order as any);
  }, [order]);

  useEffect(() => {
    if (totalCount !== undefined && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <PageBase
      metadataTitle='retiredPoolsList'
      title={t("delegations.retired.title")}
      breadcrumbItems={[{ label: t("delegations.retired.title") }]}
    >
      <div className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {stats ? (
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <OverviewStatCard
              title={t("delegations.retired.stats.adaDelegated")}
              icon={<HandCoins color={colors.primary} />}
              value={
                <AdaWithTooltip
                  triggerClassName='text-text'
                  data={stats?.stake ?? 0}
                />
              }
            />
            <OverviewStatCard
              title={t("delegations.retired.stats.accountsDelegated")}
              icon={<Users color={colors.primary} />}
              value={stats?.accounts ?? 0}
            />
            <OverviewStatCard
              title={t("delegations.retired.stats.retiredPools")}
              icon={<SendToBack color={colors.primary} />}
              value={formatNumber(stats?.count ?? 0)}
            />
          </div>
        ) : (
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <LoadingSkeleton
              height='100px'
              className='h-full grow basis-[280px]'
              rounded='xl'
            />
            <LoadingSkeleton
              height='100px'
              className='h-full grow basis-[280px]'
              rounded='xl'
            />
            <LoadingSkeleton
              height='100px'
              className='h-full grow basis-[280px]'
              rounded='xl'
            />
          </div>
        )}
        <div className='mb-2 flex h-fit w-full justify-between gap-1'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2'>
            <div>
              <Tabs
                items={tabItems}
                activeTabValue={tabParam}
                withPadding={false}
                withMargin={false}
                onClick={activeTab => {
                  setTabParam(activeTab as "active" | "live");
                }}
              />
            </div>
            <div className='flex basis-[300px] items-center gap-1'>
              <SortBy
                selectItems={selectItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem as any}
                labelName={t("common:actions.sortBy")}
              />
              <ExportButton
                columns={delegationColumns}
                items={items}
                currentPage={page ?? 1}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={retiredDelegationsTableOptions.map(item => {
                  const keyToTranslation: Record<string, string> = {
                    index: "index",
                    pool: "stakePool",
                    epoch: tabParam === "active" ? "retiringInEpoch" : "retiredInEpoch",
                    stake: "activeStake",
                    delegators: "delegators",
                    longevity: "longevity",
                  };
                  return {
                    label: t(`delegations.retired.table.${keyToTranslation[item.key]}`),
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
          rowHeight={65}
          scrollable
          query={delegationQuery}
          items={items}
          columns={delegationColumns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof RetiredDelegationsColumns) -
              columnsOrder.indexOf(b.key as keyof RetiredDelegationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </PageBase>
  );
};
