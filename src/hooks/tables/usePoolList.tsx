import type { FilterState } from "./useFilterTable";
import type { PoolsListColumns } from "@/types/tableTypes";
import type { PoolData, PoolListSearchParams } from "@/types/poolTypes";
import type { Dispatch, RefObject, SetStateAction } from "react";

import { Check, Filter, X } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { SortArrow } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

import { useFetchPoolsList } from "@/services/pools";
import { usePoolsListTableStore } from "@/stores/tables/poolsListTableStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { PoolListEchart } from "@/components/pool/PoolListEchart";
import RoaDiffArrow from "@/components/pool/RoaDiffArrow";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { useAuthToken } from "@/hooks/useAuthToken";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useMiscConst } from "@/hooks/useMiscConst";
import { cn } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { activeStakePercentage } from "@/utils/activeStakePercentage";
import { calculateTotalPoolBlocks } from "@/utils/calculateTotalPoolBlocks";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { getColumnsSortOrder } from "@vellumlabs/cexplorer-sdk";
import { getEpochColor } from "@/utils/getEpochColor";
import { getPledgeColor } from "@/utils/getPledgeColor";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { poolRewardsRoaDiff } from "@/utils/poolRewardsRoaDiff";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { useFilterTable } from "./useFilterTable";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { getGradientColor } from "@/utils/getGradientColor";
import { VoteBadge } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { useSearchTable } from "./useSearchTable";

interface UsePoolList {
  totalItems: number;
  selectItems: { key: string; value: string }[];
  selectedItem: string | undefined;
  watchlistOnly: boolean;
  tableSearch: string;
  tableRef: RefObject<HTMLDivElement>;
  columns: any[];
  poolsListQuery: ReturnType<typeof useFetchPoolsList>;
  items: PoolData[] | undefined;
  displayVoteModal: boolean;
  columnsVisibility: PoolsListColumns;
  setDisplayVoteModal: Dispatch<SetStateAction<boolean>>;
  setTableSearch: Dispatch<SetStateAction<string>>;
  setSelectedItem: Dispatch<SetStateAction<string | undefined>>;
  setWatchlistOnly: Dispatch<SetStateAction<boolean>>;
  handleCloseVoteFilter: () => void;
  handleAddVoteFilter: (value: string) => void;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
  changeFilterByKey: (key: string, value?: any) => void;
  hasFilter: boolean;
  filter: FilterState;
  filterKeys: string[];
}

interface UsePoolListArgs {
  page: number | undefined;
  sort: "asc" | "desc" | undefined;
  order:
    | "ranking"
    | "live_stake"
    | "active_stake"
    | "average_stake"
    | "delegators"
    | "pledge"
    | "blocks"
    | "pledged"
    | "roa_lifetime"
    | "roa_recent"
    | "blocks_epoch"
    | "blocks_total"
    | "slot_update"
    | "top_delegator"
    | "new"
    | "update"
    | "leverage"
    | undefined;
  watchlist?: boolean;
  enableSort?: boolean;
  setList?: (order?: string) => void;
  storeKey?: string;
  cropPoolHash?: boolean;
  overrideRows?: number;
  overrideTableSearch?: string;
  isHomepage?: boolean;
}

export const usePoolList = ({
  page,
  order,
  sort,
  watchlist,
  enableSort = true,
  storeKey,
  setList,
  cropPoolHash = true,
  overrideRows,
  overrideTableSearch,
  isHomepage,
}: UsePoolListArgs): UsePoolList => {
  const { t } = useAppTranslation("pages");
  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [displayVoteModal, setDisplayVoteModal] = useState<boolean>(false);

  const [watchlistOnly, setWatchlistOnly] = useState(false);

  const [totalItems, setTotalItems] = useState<number>(0);

  const tableRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { theme } = useThemeStore();

  const { columnsVisibility, setColumnVisibility, rows } =
    usePoolsListTableStore(storeKey)();

  const token = useAuthToken();

  const {
    anchorRefs,
    filterVisibility,
    filter,
    filterDraft,
    hasFilter,
    toggleFilter,
    changeDraftFilter,
    changeFilterByKey,
  } = useFilterTable({
    storeKey: "pool_list_filter",
    filterKeys: ["is_drep", "gov_action"],
    disableSearchSync: isHomepage,
    tabName: isHomepage ? undefined : "list",
    hrefName: isHomepage ? undefined : "pool",
  });

  const poolsListQuery = useFetchPoolsList(
    overrideRows ?? rows,
    overrideRows
      ? (page ?? 1) * overrideRows - overrideRows
      : (page ?? 1) * rows - rows,
    sort || "desc",
    order || "ranking",
    overrideTableSearch
      ? overrideTableSearch
      : !debouncedTableSearch.includes("pool1") &&
          debouncedTableSearch.replace("Pool Name:", "").trim().length > 0
        ? debouncedTableSearch
        : undefined,
    debouncedTableSearch.includes("pool1")
      ? debouncedTableSearch.replace("Pool ID:", "")
      : undefined,
    watchlist || watchlistOnly ? token : undefined,
    watchlist || watchlistOnly ? "1" : undefined,
    filter.gov_action ? filter.gov_action : undefined,
    filter.is_drep && +filter.is_drep === 1 ? 1 : undefined,
    filter.is_drep && +filter.is_drep === 2 ? 1 : undefined,
  );
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const totalPools = poolsListQuery.data?.pages[0].data.count;
  const items = poolsListQuery.data?.pages.flatMap(page => page.data.data);

  const getOrder = (orderValue: PoolListSearchParams["order"]) => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

  const getSelectedItem = (order?: string) => {
    switch (order) {
      case "ranking":
        return "Native Rankings";
      case "leverage":
        return "Pledge Leverage";
      case "delegators":
        return "Top Margins with Delegator";
      default:
        return "";
    }
  };

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    getSelectedItem(order),
  );

  const selectItems = [
    {
      key: "Native Rankings",
      value: t("pools.sortOptions.nativeRankings"),
    },
    {
      key: "Pledge Leverage",
      value: t("pools.sortOptions.pledgeLeverage"),
    },
    {
      key: "Top Margins with Delegators",
      value: t("pools.sortOptions.topMargins"),
    },
  ];

  const handleCloseVoteFilter = () => {
    changeFilterByKey("gov_action");
  };

  const handleAddVoteFilter = (value: string) => {
    changeFilterByKey("gov_action", value);
  };

  const columns = [
    {
      key: "ranking",
      standByRanking: true,
      render: () => null,
      rankingStart: order === "ranking" ? sort : undefined,
      title: (
        <div>
          {enableSort && !(selectedItem === "Top Margins with Delegators") ? (
            <div
              className='flex w-fit cursor-pointer items-center gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "ranking"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("ranking"),
                    } as any,
                  });

                  return;
                }

                setList("ranking");
              }}
            >
              <span>#</span>
              <SortArrow direction={order === "ranking" ? sort : undefined} />
            </div>
          ) : (
            <span>#</span>
          )}
        </div>
      ),
      visible: columnsVisibility.ranking,
      widthPx: 20,
    },
    {
      key: "pool",
      render: item => (
        <PoolCell
          poolInfo={{
            id: item.pool_id,
            meta: item.pool_name,
          }}
          poolImageUrl={generateImageUrl(item.pool_id, "ico", "pool")}
          cropPoolHash={cropPoolHash}
        />
      ),
      title: t("pools.table.pool"),
      visible: columnsVisibility.pool,
      widthPx: 150,
    },
    {
      key: "stake",
      rankingStart: order === "live_stake" ? sort : undefined,
      render: item => {
        const [optimalPoolSize, poolCapUsed] = activeStakePercentage(
          item.live_stake,
          miscConst?.circulating_supply ?? 1,
          miscConst?.epoch_param.optimal_pool_count ?? 1,
        );

        const fixedPoolCapUsed = poolCapUsed ? poolCapUsed.toFixed(2) : 0;

        return (
          <div className='flex flex-col gap-1.5'>
            <span className='text-right text-grayTextPrimary'>
              <AdaWithTooltip data={item.active_stake} />
            </span>
            <div className='flex items-center justify-end gap-1'>
              <div
                className={`relative h-3 max-w-20 overflow-hidden rounded-[4px] ${
                  theme === "dark" ? "bg-[#505359]" : "bg-[#E4E7EC]"
                }`}
                style={{
                  width: `${optimalPoolSize}%`,
                }}
              >
                <span className='absolute -top-1 left-[45%] z-10 w-12 -translate-x-1/2 text-right text-[10px] text-text'>
                  {String(fixedPoolCapUsed).length < 10 && fixedPoolCapUsed}%
                </span>
                <span
                  className='absolute left-0 block h-3 rounded-bl-[4px] rounded-tl-[4px]'
                  style={{
                    width: `${poolCapUsed ?? 0}%`,
                    backgroundColor: getGradientColor(poolCapUsed ?? 0),
                  }}
                ></span>
              </div>
            </div>
          </div>
        );
      },
      title:
        enableSort && !(selectedItem === "Top Margins with Delegators") ? (
          <div className='flex w-full justify-end'>
            <div
              className='flex w-fit cursor-pointer items-center gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "live_stake"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("live_stake"),
                    } as any,
                  });
                  return;
                }

                setList("live_stake");
              }}
            >
              <span>{t("pools.table.stake")}</span>
              <SortArrow
                direction={order === "live_stake" ? sort : undefined}
              />
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-end'>
            <span>{t("pools.table.stake")}</span>
          </div>
        ),
      visible: columnsVisibility.stake,
      widthPx: 60,
    },

    {
      key: "rewards",
      render: item => {
        const lifetimeRoa = poolRewardsRoaDiff(
          item?.stats?.lifetime?.roa,
          miscConst,
        );
        const recentRoa = poolRewardsRoaDiff(
          item?.stats?.recent?.roa,
          miscConst,
        );

        const epochs = item?.epochs ? Object.values(item.epochs).filter(epoch => epoch !== null && epoch !== undefined).slice(2) : [];

        const rewardsData = epochs.map(epoch => ({
          epoch: (epoch as any)?.no,
          leader_lovelace: (epoch as any)?.data?.reward?.leader_lovelace,
          leader_pct: (epoch as any)?.data?.reward?.leader_pct,
          member_lovelace: (epoch as any)?.data?.reward?.member_lovelace,
          member_pct: (epoch as any)?.data?.reward?.member_pct,
        }));

        const rewardsDataSource = rewardsData.map(({ epoch, member_pct }) => [
          epoch,
          member_pct && member_pct > 0 ? member_pct : 0.1,
        ]);

        const rewardsDataSourceNotEmpty =
          rewardsDataSource.filter(item => item && item[1]).map(item => item[1]).filter(e => e).length > 0;

        return (
          <div className='w-full justify-end'>
            <div className='flex items-center gap-1/2'>
              <RoaDiffArrow color={lifetimeRoa} />
              <p className='text-left text-grayTextPrimary'>
                {item?.stats?.lifetime?.roa
                  ? item.stats.lifetime.roa.toFixed(2)
                  : (0).toFixed(2)}
                %
              </p>
              {rewardsDataSourceNotEmpty && (
                <PoolListEchart
                  dataSource={rewardsDataSource}
                  ref={tableRef}
                  color={params =>
                    rewardsData[params.dataIndex] ? getEpochColor(rewardsData[params.dataIndex].member_pct) : "#ccc"
                  }
                  toolTipFormatter={params => {
                    const data = rewardsData[params.dataIndex];

                    if (!data) return '';

                    return `
                          <div style="font-size: 12px; line-height: 15px">
                            <span>Epoch: ${data.epoch ?? 'N/A'}</span>
                            <br/>
                            <span>Leader Ada: ${data.leader_lovelace ? lovelaceToAda(data.leader_lovelace) : 'N/A'}</span>
                            <br/>
                            <span>Leader Pct: ${data.leader_pct ? data.leader_pct.toFixed(2) : 'N/A'}</span>
                            <br/>
                            <span>Member Ada: ${data.member_lovelace ? lovelaceToAda(data.member_lovelace) : 'N/A'}</span>
                            <br/>
                            <span>Member Pct: ${data.member_pct ?? 'N/A'}%</span>
                          </div>`;
                  }}
                />
              )}
            </div>
            <div className='flex items-center gap-1/2'>
              <RoaDiffArrow color={recentRoa} />
              <p className='text-left text-grayTextPrimary'>
                {item?.stats?.recent?.roa
                  ? item.stats.recent.roa.toFixed(2)
                  : (0).toFixed(2)}
                %
              </p>
            </div>
          </div>
        );
      },
      title: (
        <div className='flex'>
          {enableSort && !(selectedItem === "Top Margins with Delegators") ? (
            <div
              className='flex w-fit cursor-pointer items-center gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "roa_lifetime"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("roa_lifetime"),
                    } as any,
                  });
                  return;
                }

                setList("roa_lifetime");
              }}
            >
              <span>{t("pools.table.rewards")}</span>
              <SortArrow
                direction={order === "roa_lifetime" ? sort : undefined}
              />
            </div>
          ) : (
            <div className='flex w-full justify-end'>
              <span>{t("pools.table.rewards")}</span>
            </div>
          )}
        </div>
      ),
      visible: columnsVisibility.rewards,
      widthPx: 80,
    },
    {
      key: "luck",
      render: item => (
        <p className='text-right text-grayTextPrimary'>
          {item?.stats?.lifetime?.luck * 100
            ? (item?.stats?.lifetime?.luck * 100).toFixed(2)
            : 0}
          %
        </p>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <p className='text-right'>{t("pools.table.luck")}</p>
        </div>
      ),
      visible: columnsVisibility.luck,
      widthPx: 50,
    },
    {
      key: "drep",
      render: item => {
        const drep = item?.drep && Array.isArray(item.drep) ? item.drep[0] : null;

        if (!drep || !drep.ident) {
          return <p className='text-right text-grayTextPrimary'>-</p>;
        }

        return (
          <p className='text-right text-grayTextPrimary'>
            <Link
              to='/drep/$hash'
              params={{ hash: drep.ident }}
              className='text-primary'
            >
              {formatString(drep.ident, "short")}
            </Link>
          </p>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          <p className='text-right' ref={anchorRefs.is_drep}>
            {t("pools.table.drep")}
          </p>
        </div>
      ),
      filter: {
        anchorRef: anchorRefs.is_drep,
        filterOpen: filterVisibility.is_drep,
        activeFunnel: !!filter.is_drep,
        filterButtonDisabled: filter.is_drep
          ? filter.is_drep === filterDraft.is_drep
          : false,
        onShow: e => toggleFilter(e, "is_drep"),
        onFilter: () => changeFilterByKey("is_drep", filterDraft["is_drep"]),
        onReset: () => changeFilterByKey("is_drep"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='drep'
                value='1'
                className='accent-primary'
                checked={filterDraft["is_drep"] === 1}
                onChange={e =>
                  changeDraftFilter("is_drep", +e.currentTarget.value)
                }
              />
              <span className='text-text-sm'>Yes</span>
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='drep'
                value='2'
                className='accent-primary'
                checked={filterDraft["is_drep"] === 2}
                onChange={e =>
                  changeDraftFilter("is_drep", +e.currentTarget.value)
                }
              />
              <span className='text-text-sm'>No</span>
            </label>
          </div>
        ),
      },
      visible:
        columnsVisibility.drep &&
        !(selectedItem === "Top Margins with Delegators"),
      widthPx: 60,
    },
    {
      key: "fees",
      render: item => (
        <div className='flex flex-col text-right text-text-xs text-grayTextPrimary'>
          <span>
            {item?.pool_update?.active?.margin
              ? (item.pool_update.active.margin * 100).toFixed(2)
              : 0}
            %
          </span>
          <AdaWithTooltip
            triggerClassName='text-text-xs'
            data={item?.pool_update?.active?.fixed_cost ?? 0}
          />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <p className='text-right'>{t("pools.table.fees")}</p>
        </div>
      ),
      visible: columnsVisibility.fees,
      widthPx: 50,
    },
    {
      key: "blocks",
      render: item => {
        const totalPoolBlocks = calculateTotalPoolBlocks(item);
        const totalEstimatedBlocksFixed = totalPoolBlocks.totalEstimatedBlocks
          ? +totalPoolBlocks.totalEstimatedBlocks.toFixed(1)
          : 0;
        const formattedTotalBlocks = formatNumber(item?.blocks?.total);

        const epochs = item?.epochs ? Object.values(item?.epochs).filter(epoch => epoch !== null && epoch !== undefined).slice(2) : [];
        const epochData = epochs.map(epoch => ({
          epoch: (epoch as any)?.no,
          minted: (epoch as any)?.data?.block?.minted,
          estimated: (epoch as any)?.data?.block?.estimated,
          luck: (epoch as any)?.data?.block?.luck,
        }));

        return (
          <div className='text-right text-grayTextPrimary'>
            <div className='flex items-center justify-end gap-1'>
              <span>{`${formatNumber(totalPoolBlocks.totalMintedBlocks)} / ${formatNumber(totalEstimatedBlocksFixed)}`}</span>
              <PoolListEchart
                ref={tableRef}
                dataSource={epochData.map(({ epoch, minted }) => [
                  epoch,
                  minted > 0 ? minted : 0.1,
                ])}
                color={params => {
                  const currentData = epochData[params.dataIndex];
                  if (!currentData) return "#ccc";
                  return currentData.minted === 0
                    ? "red"
                    : getEpochColor(currentData.luck);
                }}
                toolTipFormatter={params => {
                  const data = epochData[params.dataIndex];

                  if (!data) return '';

                  return `
                  <div style="font-size: 12px; line-height: 14px;">
                    <span>Epoch: ${data.epoch ?? 'N/A'}</span>
                    <br/>
                    <span>Minted: ${data.minted ?? 'N/A'}</span>
                    <br/>
                    <span>Estimated: ${(data.estimated ?? 0).toFixed(2)}</span>
                    <br/>
                    <span>Luck: ${(data.luck ?? 0).toFixed(2)}</span>
                  </div>`;
                }}
                className='justify-end'
              />
            </div>
            <div className='text-text-xs text-grayTextSecondary'>
              ({formattedTotalBlocks})
            </div>
          </div>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          {enableSort && !(selectedItem === "Top Margins with Delegators") ? (
            <div
              className='flex w-full cursor-pointer items-center justify-end gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "blocks_total"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("blocks_total"),
                    } as any,
                  });
                  return;
                }

                setList("blocks_total");
              }}
            >
              <span>{t("pools.table.blocks")}</span>
              <SortArrow
                direction={order === "blocks_total" ? sort : undefined}
              />
            </div>
          ) : (
            <span className='w-full text-right'>{t("pools.table.blocks")}</span>
          )}
        </div>
      ),

      visible: columnsVisibility.blocks,
      widthPx: 100,
    },
    {
      key: "pledge",
      render: item => {
        const pledge = item?.pool_update?.live?.pledge ?? 0;
        const pledged = item?.pledged ?? 0;

        return (
          <div className='flex items-center justify-end gap-1/2'>
            {pledged >= pledge ? (
              <Check size={11} className='translate-y-[1px] stroke-[#17B26A]' />
            ) : (
              <X size={11} className='translate-y-[1px] stroke-[#F04438]' />
            )}
            <Tooltip
              content={
                <div className='flex w-[140px] items-center gap-1/2'>
                  <span>Active pledge stake: {lovelaceToAda(pledged)}</span>
                </div>
              }
            >
              <span className='w-[60px] whitespace-nowrap text-grayTextPrimary'>
                <AdaWithTooltip data={item.pool_update?.active?.pledge ?? 0} />
              </span>
            </Tooltip>
          </div>
        );
      },
      title:
        enableSort && !(selectedItem === "Top Margins with Delegators") ? (
          <div
            className='flex w-full justify-end'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "pledge" ? getColumnsSortOrder(sort) : "desc",
                    order: getOrder("pledge"),
                  } as any,
                });
                return;
              }

              setList("pledge");
            }}
          >
            <div className='flex w-fit cursor-pointer items-center gap-1/2'>
              <span>{t("pools.table.pledge")}</span>
              <SortArrow direction={order === "pledge" ? sort : undefined} />
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-end'>
            <span>{t("pools.table.pledge")}</span>
          </div>
        ),
      visible: columnsVisibility.pledge,
      widthPx: 55,
    },
    {
      key: "pledge_leverage",
      render: item => {
        const pledge = item?.pool_update?.live?.pledge ?? 0;
        const pledge_leverage =
          pledge > 0 ? Math.round(item.live_stake / pledge) : 0;

        return (
          <div className='flex items-center justify-end gap-1/2'>
            <Filter
              size={11}
              color={getPledgeColor(pledge_leverage)}
              className={cn("translate-y-[2px]")}
            />
            <span className='text-right text-grayTextPrimary'>
              x{pledge_leverage}
            </span>
          </div>
        );
      },
      title:
        enableSort && !(selectedItem === "Top Margins with Delegators") ? (
          <div className='flex w-full justify-end'>
            <div
              className='flex w-fit cursor-pointer items-center justify-end gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "leverage"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("leverage"),
                    } as any,
                  });
                  return;
                }

                setList("leverage");
              }}
            >
              <span className='text-right'>{t("pools.table.pledgeLeverage")}</span>
              <SortArrow direction={order === "leverage" ? sort : undefined} />
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-end'>
            <span className='text-right'>{t("pools.table.pledgeLeverage")}</span>
          </div>
        ),

      visible: columnsVisibility.pledge_leverage,
      widthPx: 85,
    },

    {
      key: "delegators",
      render: item => {
        return <p className='text-right'>{item.delegators}</p>;
      },
      title:
        enableSort && !(selectedItem === "Top Margins with Delegators") ? (
          <div
            className='flex w-full justify-end'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "delegators"
                        ? getColumnsSortOrder(sort)
                        : "desc",
                    order: getOrder("delegators"),
                  } as any,
                });
                return;
              }

              setList("delegators");
            }}
          >
            <div className='flex w-fit cursor-pointer items-center gap-1/2'>
              <span>{t("pools.table.delegators")}</span>
              <SortArrow
                direction={order === "delegators" ? sort : undefined}
              />
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-end'>
            <p className='text-right'>{t("pools.table.delegators")}</p>
          </div>
        ),
      visible: columnsVisibility.delegators,
      widthPx: 85,
    },
    {
      key: "avg_stake",
      render: item => {
        if (!item?.live_stake || !item?.delegators) {
          return "-";
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.live_stake / item.delegators} />
          </p>
        );
      },
      title:
        enableSort && !(selectedItem === "Top Margins with Delegators") ? (
          <div
            className='flex w-full justify-end'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "average_stake"
                        ? getColumnsSortOrder(sort)
                        : "desc",
                    order: getOrder("average_stake"),
                  } as any,
                });
                return;
              }

              setList("average_stake");
            }}
          >
            <div className='flex w-fit cursor-pointer items-center gap-1/2'>
              <span className='text-nowrap'>{t("pools.table.averageStake")}</span>
              <SortArrow
                direction={order === "average_stake" ? sort : undefined}
              />
            </div>
          </div>
        ) : (
          <div className='flex w-full justify-end'>
            <p className='w-full text-nowrap text-right'>{t("pools.table.averageStake")}</p>
          </div>
        ),
      visible: columnsVisibility.avg_stake,
      widthPx: 75,
    },
    {
      key: "selected_vote",
      render: item => {
        return (
          <div className='flex w-full justify-end'>
            <VoteBadge vote={item?.gov_action as Vote} />
          </div>
        );
      },
      title: (
        <div className='flex w-full items-center justify-end gap-1/2 text-nowrap'>
          <p className='text-right'>{t("pools.table.selectedVote")}</p>
          <X
            size={15}
            className='translate-y-[1px] cursor-pointer'
            onClick={handleCloseVoteFilter}
          />
        </div>
      ),
      visible: !!filter.gov_action,
      widthPx: 90,
    },
    {
      key: "top_delegator",
      render: item => {
        if (!item?.top_delegator?.stake || !item?.live_stake) {
          return <p className='text-right'>-</p>;
        }

        const topDelegator =
          (item.top_delegator.stake / item.live_stake) * 100;

        return (
          <div className={`flex w-full items-center justify-end`}>
            <div className={`flex items-center gap-2`}>
              <div className='flex min-w-[40px] justify-end'>
                <PulseDot
                  color={
                    topDelegator < 50
                      ? undefined
                      : topDelegator < 100
                        ? "#F79009"
                        : "#F04438"
                  }
                />
              </div>
              <Link
                to={
                  item?.top_delegator?.view.startsWith("stake")
                    ? "/stake/$stakeAddr"
                    : "/address/$address"
                }
                params={{
                  address: item?.top_delegator?.view,
                  stakeAddr: item?.top_delegator?.view,
                }}
                className='block min-w-[55px] text-primary'
              >
                <p className='text-right'>{topDelegator.toFixed(2)}%</p>
              </Link>
            </div>
          </div>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          {enableSort && !(selectedItem === "Top Margins with Delegators") ? (
            <div
              className='flex w-fit cursor-pointer items-center gap-1/2'
              onClick={() => {
                if (!setList) {
                  navigate({
                    search: {
                      sort:
                        order === "top_delegator"
                          ? getColumnsSortOrder(sort)
                          : "desc",
                      order: getOrder("top_delegator"),
                    } as any,
                  });
                  return;
                }

                setList("top_delegator");
              }}
            >
              <span>{t("pools.table.topDelegator")}</span>
              <SortArrow
                direction={order === "top_delegator" ? sort : undefined}
              />
            </div>
          ) : (
            <div className='flex w-full justify-end'>
              <span>{t("pools.table.topDelegator")}</span>
            </div>
          )}
        </div>
      ),
      visible: columnsVisibility.top_delegator || order === "top_delegator",
      widthPx: 100,
    },
  ];

  useEffect(() => {
    switch (selectedItem) {
      case "Native Rankings":
        navigate({
          search: {
            sort: "desc",
            order: "ranking",
          } as any,
        });
        return;
      case "Pledge Leverage":
        navigate({
          search: {
            sort: "desc",
            order: "leverage",
          } as any,
        });
        return;
      case "Top Margins with Delegators":
        navigate({
          search: {
            sort: "desc",
            order: "delegators",
          } as any,
        });
        return;
      default:
        return;
    }
  }, [selectedItem]);

  useEffect(() => {
    if (totalPools !== undefined && totalPools !== totalItems) {
      setTotalItems(totalPools);
    }
  }, [totalPools, totalItems]);

  return {
    selectItems,
    displayVoteModal,
    tableSearch,
    totalItems,
    watchlistOnly,
    tableRef,
    columns,
    selectedItem,
    poolsListQuery,
    items,
    columnsVisibility,
    filterKeys: ["is_drep"],
    setColumnVisibility,
    setDisplayVoteModal,
    setSelectedItem,
    setTableSearch,
    setWatchlistOnly,
    handleCloseVoteFilter,
    handleAddVoteFilter,
    changeFilterByKey,
    hasFilter,
    filter,
  };
};
