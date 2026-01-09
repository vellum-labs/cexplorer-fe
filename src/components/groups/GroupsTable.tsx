import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Check, Filter } from "lucide-react";
import { getPledgeColor } from "@/utils/getPledgeColor";
import { cn } from "@vellumlabs/cexplorer-sdk";
import { SortArrow } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import type { GroupsListData } from "@/types/analyticsTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GroupsTableProps {
  filteredItems: GroupsListData[];
  sortColumn: string | undefined;
  sortDirection: "asc" | "desc" | undefined;
  handleSort: (column: string) => void;
  miscConstLiveStake: number | undefined;
  anchorRefs: Record<string, React.RefObject<HTMLDivElement>>;
  filterVisibility: Record<string, boolean>;
  filter: Record<string, any>;
  filterDraft: Record<string, any>;
  toggleFilter: (e: React.MouseEvent<any, any>, key: string) => void;
  changeDraftFilter: (key: string, value: any) => void;
  changeFilterByKey: (key: string, value?: any) => void;
  query: UseQueryResult<any, any>;
}

export const GroupsTable = ({
  filteredItems,
  sortColumn,
  sortDirection,
  handleSort,
  miscConstLiveStake,
  anchorRefs,
  filterVisibility,
  filter,
  filterDraft,
  toggleFilter,
  changeDraftFilter,
  changeFilterByKey,
  query,
}: GroupsTableProps) => {
  const { t } = useAppTranslation("pages");

  const columns: TableColumns<GroupsListData> = [
    {
      key: "pools_count",
      title: (
        <span
          className='flex cursor-pointer items-center gap-1/2'
          onClick={() => handleSort("pools_count")}
        >
          {t("groups.table.poolsCount")}{" "}
          <SortArrow
            direction={sortColumn === "pools_count" ? sortDirection : undefined}
          />
        </span>
      ),
      render: item => (
        <span className='text-grayTextPrimary'>
          {item.data?.pool?.count ?? 0}
        </span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "name",
      title: t("groups.table.groupName"),
      render: item => (
        <Link
          className='text-primary'
          to='/groups/$url'
          params={{ url: item.url }}
        >
          {item.name}
        </Link>
      ),
      widthPx: 50,
      visible: true,
    },
    {
      key: "pool_stake",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pool_stake")}
        >
          {t("groups.table.poolStake")}{" "}
          <SortArrow
            direction={sortColumn === "pool_stake" ? sortDirection : undefined}
          />
        </span>
      ),
      render: item => (
        <span className='flex w-full justify-end text-grayTextPrimary'>
          {item.data?.pool?.stake ? (
            <AdaWithTooltip data={item.data.pool.stake} />
          ) : (
            "-"
          )}
        </span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "delegators",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("delegators")}
        >
          {t("common:labels.delegators")}{" "}
          <SortArrow
            direction={sortColumn === "delegators" ? sortDirection : undefined}
          />
        </span>
      ),
      render: item => (
        <span className='flex w-full justify-end text-grayTextPrimary'>
          {item.data?.pool?.delegators ?? "-"}
        </span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "share",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("share")}
        >
          {t("groups.table.share")}{" "}
          <SortArrow
            direction={sortColumn === "share" ? sortDirection : undefined}
          />
        </span>
      ),
      render: item => {
        const groupStake = item.data?.pool?.stake ?? 0;
        const totalLiveStake = miscConstLiveStake ?? 1;

        const sharePercentage =
          totalLiveStake > 0
            ? ((groupStake / totalLiveStake) * 100).toFixed(2)
            : "0.00";

        return (
          <span className='flex w-full justify-end text-grayTextPrimary'>
            {sharePercentage}%
          </span>
        );
      },
      widthPx: 30,
      visible: true,
    },
    {
      key: "pledge",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pledge")}
        >
          {t("common:labels.pledge")}{" "}
          <SortArrow
            direction={sortColumn === "pledge" ? sortDirection : undefined}
          />
        </span>
      ),
      render: item => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const stake = item.data?.pool?.stake ?? 0;

        let leverage = 0;
        if (pledge > 0) {
          leverage = Math.round(stake / pledge);
        }

        return (
          <div className='flex flex-col items-end'>
            <div className='flex items-center gap-1/2'>
              <Check size={11} className='translate-y-[1px] stroke-[#17B26A]' />
              <span className='w-[60px] whitespace-nowrap text-grayTextPrimary'>
                <AdaWithTooltip data={pledge} />
              </span>
            </div>
            <div className='flex items-center justify-end gap-1/2'>
              <Filter
                size={11}
                color={getPledgeColor(leverage)}
                className={cn("translate-y-[2px]")}
              />
              <span className='text-text-xs text-grayTextPrimary'>
                {pledge > 0 ? `x${leverage}` : "∞"}
              </span>
            </div>
          </div>
        );
      },
      widthPx: 30,
      visible: true,
    },
    {
      key: "mu_pledge_per_pool",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pledge_per_pool")}
        >
          {t("groups.table.pledgePerPool")}{" "}
          <SortArrow
            direction={
              sortColumn === "pledge_per_pool" ? sortDirection : undefined
            }
          />
        </span>
      ),
      render: item => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const poolCount = item.data?.pool?.count ?? 1;
        const pledgePerPool = poolCount > 0 ? pledge / poolCount : 0;

        return (
          <span className='flex w-full justify-end text-grayTextPrimary'>
            <AdaWithTooltip data={pledgePerPool} />
          </span>
        );
      },
      widthPx: 40,
      visible: true,
    },
    {
      key: "drep",
      title: (
        <span className='flex w-full justify-end' ref={anchorRefs.has_drep}>
          {t("groups.table.alsoDrep")}
        </span>
      ),
      render: item => {
        const drepCount = item.data?.drep?.count ?? 0;

        if (drepCount === 0) {
          return (
            <span className='flex w-full justify-end'>
              <Badge color='gray'>{t("groups.no")}</Badge>
            </span>
          );
        }

        return (
          <span className='flex w-full justify-end'>
            <Badge color='blue'>{t("groups.yes")}: {drepCount}x</Badge>
          </span>
        );
      },
      filter: {
        anchorRef: anchorRefs.has_drep,
        filterOpen: filterVisibility.has_drep,
        activeFunnel: !!filter.has_drep,
        filterButtonDisabled: filter.has_drep
          ? filter.has_drep === filterDraft.has_drep
          : false,
        onShow: e => toggleFilter(e, "has_drep"),
        onFilter: () => changeFilterByKey("has_drep", filterDraft["has_drep"]),
        onReset: () => changeFilterByKey("has_drep"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='has_drep'
                value='1'
                className='accent-primary'
                checked={filterDraft["has_drep"] === 1}
                onChange={e =>
                  changeDraftFilter("has_drep", +e.currentTarget.value)
                }
              />
              <span className='text-text-sm'>{t("groups.yes")}</span>
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='has_drep'
                value='2'
                className='accent-primary'
                checked={filterDraft["has_drep"] === 2}
                onChange={e =>
                  changeDraftFilter("has_drep", +e.currentTarget.value)
                }
              />
              <span className='text-text-sm'>{t("groups.no")}</span>
            </label>
          </div>
        ),
      },
      widthPx: 30,
      visible: true,
    },
  ];

  return (
    <GlobalTable
      type='default'
      scrollable
      totalItems={filteredItems.length}
      columns={columns}
      items={filteredItems}
      query={query}
    />
  );
};
