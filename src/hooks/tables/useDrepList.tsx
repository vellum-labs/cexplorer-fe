import type { DrepListData, DrepListOrder } from "@/types/drepTypes";
import type { DrepListTableColumns, TableColumns } from "@/types/tableTypes";
import type { Dispatch, SetStateAction } from "react";

import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { MetadataCell } from "@/components/metadata/MetadataCell";
import { DateCell } from "@vellumlabs/cexplorer-sdk";

import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchDrepList } from "@/services/drep";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useDrepListTableStore } from "@/stores/tables/drepListTableStore";
import { useEffect, useState } from "react";

import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { SortArrow } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { getColumnsSortOrder } from "@/utils/getColumnsSortOrder";
import { Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { useFilterTable } from "./useFilterTable";
import { VoteBadge } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { useSearchTable } from "./useSearchTable";

export type FilterKey = "spo";

type FilterState = {
  [L in FilterKey]?: string;
};

interface UseDrepList {
  drepListQuery: ReturnType<typeof useFetchDrepList>;
  columns: TableColumns<DrepListData>;
  items: DrepListData[] | undefined;
  totalItems: number;
  tableSearch: string;
  watchlistOnly: boolean;
  displayVoteModal: boolean;
  columnsVisibility: DrepListTableColumns;
  hasFilter: boolean;
  filter: FilterState;
  filterKeys: string[];
  setDisplayVoteModal: Dispatch<SetStateAction<boolean>>;
  setWatchlistOnly: Dispatch<SetStateAction<boolean>>;
  setTableSearch: Dispatch<SetStateAction<string>>;
  handleCloseVoteFilter: () => void;
  handleAddVoteFilter: (value: string) => void;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
  changeFilterByKey: (key: FilterKey, value?: string) => void;
}

export const useDrepList = ({
  watchlist,
  page,
  order,
  sort,
  storeKey,
  overrideRows,
  overrideTableSearch,
  isHomepage,
  setList,
}: {
  watchlist?: boolean;
  page?: number;
  order?: string;
  sort?: "asc" | "desc";
  setList?: (order?: string) => void;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
  isHomepage?: boolean;
}): UseDrepList => {
  const { infiniteScrolling } = useInfiniteScrollingStore();

  const token = useAuthToken();

  const [displayVoteModal, setDisplayVoteModal] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const navigate = useNavigate();

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const {
    filterVisibility,
    filter,
    hasFilter,
    anchorRefs,
    filterDraft,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey: "drep_list",
    filterKeys: ["spo", "gov_action"],
    disableSearchSync: isHomepage,
    tabName: isHomepage ? undefined : "list",
    hrefName: isHomepage ? undefined : "drep",
  });

  const { columnsVisibility, setColumnVisibility, rows } =
    useDrepListTableStore(storeKey)();

  const drepListQuery = useFetchDrepList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : overrideRows
        ? (page ?? 1) * overrideRows - overrideRows
        : (page ?? 1) * rows - rows,
    sort ?? "desc",
    order as DrepListOrder,
    overrideTableSearch
      ? overrideTableSearch
      : debouncedTableSearch
        ? debouncedTableSearch
        : undefined,
    watchlist || watchlistOnly ? "1" : undefined,
    watchlist || watchlistOnly ? token : undefined,
    filter.gov_action ? filter.gov_action : undefined,
    filter.spo === "YES" ? 1 : undefined,
    filter.spo === "NO" ? 1 : undefined,
  );

  const totalDreps = drepListQuery.data?.pages[0].data.count;
  const items = drepListQuery.data?.pages.flatMap(page => page.data.data);

  const getOrder = (orderValue: DrepListOrder) => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

  const handleCloseVoteFilter = () => {
    changeFilterByKey("gov_action");
  };

  const handleAddVoteFilter = (value: string) => {
    changeFilterByKey("gov_action", value);
  };

  const columns: TableColumns<DrepListData> = [
    {
      key: "ranking",
      standByRanking: true,
      render: () => null,
      rankingStart: sort,
      title: (
        <div>
          <div
            className='flex w-fit cursor-pointer items-center gap-1'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort: getColumnsSortOrder(sort),
                    order: order,
                  } as any,
                });

                return;
              }

              setList(order);
            }}
          >
            <span>#</span>
            <SortArrow direction={sort} />
          </div>
        </div>
      ),
      visible: columnsVisibility.ranking,
      widthPx: 20,
    },
    {
      key: "status",
      render: item => {
        if (typeof item?.is_active === "undefined") {
          return "-";
        }

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-m border border-border px-[10px]'>
            <PulseDot color={!item.is_active ? "bg-redText" : undefined} />
            <span className='text-text-xs font-medium'>
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
      title: <p>Status</p>,
      visible: columnsVisibility.status,
      widthPx: 40,
    },
    {
      key: "drep_name",
      render: item => {
        if (!item?.hash?.view) {
          return "-";
        }

        return <DrepNameCell item={item} />;
      },
      jsonFormat: item => {
        if (!item?.hash?.view) {
          return "-";
        }

        if (item?.data && item?.data?.given_name) {
          return item?.data?.given_name;
        }

        return item?.hash?.view;
      },
      title: <p>DRep name</p>,
      visible: columnsVisibility.drep_name,
      widthPx: 120,
    },
    {
      key: "voting_power",
      render: item => {
        if (!item?.amount) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.amount} />
          </p>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "power" ? getColumnsSortOrder(sort) : "desc",
                    order: getOrder("power"),
                  } as any,
                });
                return;
              }

              setList("power");
            }}
          >
            <span>Voting power</span>
            <SortArrow direction={order === "power" ? sort : undefined} />
          </div>
        </div>
      ),
      visible: columnsVisibility.voting_power,
      widthPx: 50,
    },
    {
      key: "voting_activity",
      render: item => {
        if (!item?.votestat?.rate?.total && item?.votestat?.rate?.total !== 0) {
          return <p className='text-right'>-</p>;
        }

        const percent = item.votestat.rate.total * 100;

        return <p className='text-right'>{percent.toFixed(2)}%</p>;
      },
      title: (
        <div className='w-full text-right'>
          <Tooltip
            content={
              <div className='w-[180px]'>
                Voting activity over DRep's lifetime
              </div>
            }
          >
            <p className='cursor-help'>Lifetime Activity</p>
          </Tooltip>
        </div>
      ),
      visible: columnsVisibility.voting_activity,
      widthPx: 50,
    },
    {
      key: "recent_activity",
      render: item => {
        if (
          !item?.votestat?.rate?.recent &&
          item?.votestat?.rate?.recent !== 0
        ) {
          return <p className='text-right'>-</p>;
        }

        const percent = item.votestat.rate.recent * 100;

        return <p className='text-right'>{percent.toFixed(2)}%</p>;
      },
      title: (
        <div className='w-full text-right'>
          <Tooltip
            content={
              <div className='w-[180px]'>
                DRep's voting activity over the past 6 months
              </div>
            }
          >
            <p className='cursor-help'>Recent Activity</p>
          </Tooltip>
        </div>
      ),
      visible: columnsVisibility.recent_activity,
      widthPx: 50,
    },
    {
      key: "owner_stake",
      render: item => {
        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.owner.balance} />
          </p>
        );
      },
      jsonFormat: item => {
        return item.owner.balance;
      },
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort: order === "own" ? getColumnsSortOrder(sort) : "desc",
                    order: getOrder("own"),
                  } as any,
                });
                return;
              }

              setList("own");
            }}
          >
            <span>Owner stake</span>
            <SortArrow direction={order === "own" ? sort : undefined} />
          </div>
        </div>
      ),
      visible: columnsVisibility.owner_stake,
      widthPx: 50,
    },
    {
      key: "average_stake",
      render: item => {
        if (!item?.amount || !item.distr.count) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item?.amount / (item.distr.count ?? 1)} />
          </p>
        );
      },
      jsonFormat: item => {
        return item.amount / (item.distr.count ?? 1);
      },
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
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
            <span>Average stake</span>
            <SortArrow
              direction={order === "average_stake" ? sort : undefined}
            />
          </div>
        </div>
      ),
      visible: columnsVisibility.average_stake,
      widthPx: 55,
    },
    {
      key: "registered",
      render: item => {
        if (!item?.since) {
          return "-";
        }

        return <DateCell time={item.since} />;
      },
      jsonFormat: item => {
        if (!item.since) {
          return "-";
        }

        return item.since;
      },
      title: (
        <div className='flex'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "since" ? getColumnsSortOrder(sort) : "desc",
                    order: getOrder("since"),
                  } as any,
                });
                return;
              }

              setList("since");
            }}
          >
            <span>Registered</span>
            <SortArrow direction={order === "since" ? sort : undefined} />
          </div>
        </div>
      ),
      visible: columnsVisibility.registered,
      widthPx: 60,
    },
    {
      key: "delegators",
      render: item => {
        return (
          <span className='flex justify-end'>
            {formatNumber(item.distr?.count)}
          </span>
        );
      },
      jsonFormat: item => {
        return item.distr?.count;
      },
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
            onClick={() => {
              if (!setList) {
                navigate({
                  search: {
                    sort:
                      order === "delegator"
                        ? getColumnsSortOrder(sort)
                        : "desc",
                    order: getOrder("delegator"),
                  } as any,
                });
                return;
              }

              setList("delegator");
            }}
          >
            <span>Delegators</span>
            <SortArrow direction={order === "delegator" ? sort : undefined} />
          </div>
        </div>
      ),
      visible: columnsVisibility.delegators,
      widthPx: 45,
    },
    {
      key: "metadata",
      render: item => {
        if (!item?.data) {
          return <p className='text-right'>-</p>;
        }

        return <MetadataCell metadata={item.data} />;
      },
      jsonFormat: item => {
        if (!item.data) {
          return "-";
        }

        return JSON.stringify(item.data);
      },
      title: <p className='w-full text-right'>DRep metadata</p>,
      visible: columnsVisibility.metadata,
      widthPx: 50,
    },
    {
      key: "selected_vote",
      render: item => {
        return (
          <div className='flex w-full justify-end'>
            <VoteBadge vote={item?.gov_action?.vote as Vote} />
          </div>
        );
      },
      title: (
        <div className='flex w-full items-center justify-end gap-1/2'>
          <p className='text-right'>Selected vote</p>
          <X
            size={15}
            className='translate-y-[1px] cursor-pointer'
            onClick={handleCloseVoteFilter}
          />
        </div>
      ),
      visible: !!filter.gov_action,
      widthPx: 60,
    },
    {
      key: "spo",
      render: item => {
        const itemsCount = item.pool?.length ?? 0;

        return item.pool ? (
          <div className='flex w-full items-center justify-end'>
            <Tooltip
              forceDirection='left'
              content={
                <div>
                  {item.pool.map(({ ident }: { ident: string }) => (
                    <div
                      key={ident}
                      className='flex items-center justify-end gap-1/2 text-right'
                    >
                      <Link to='/pool/$id' params={{ id: ident }}>
                        <p className='min-w-36 text-primary'>
                          {formatString(ident, "long")}
                        </p>
                      </Link>
                      <Copy copyText={ident} />
                    </div>
                  ))}
                </div>
              }
            >
              <Badge color='gray'>{`Yes (${itemsCount})`}</Badge>
            </Tooltip>
          </div>
        ) : (
          <div className='flex justify-end'>
            <Badge color='gray'>n/a</Badge>
          </div>
        );
      },
      title: (
        <p ref={anchorRefs?.spo} className='w-full text-right'>
          SPO
        </p>
      ),
      filter: {
        anchorRef: anchorRefs?.spo,
        width: "170px",
        activeFunnel: !!filter.spo && !isHomepage,
        filterOpen: filterVisibility.spo,
        filterButtonDisabled: filter.spo
          ? filter.spo === filterDraft.spo
          : false,
        onShow: e => toggleFilter(e, "spo"),
        onFilter: () => changeFilterByKey("spo", filterDraft.spo),
        onReset: () => changeFilterByKey("spo"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='spo'
                value='YES'
                className='accent-primary'
                checked={filterDraft.spo === "YES"}
                onChange={e => changeDraftFilter("spo", e.currentTarget.value)}
              />
              <span className='text-text-sm'>Yes</span>
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='not_spo'
                value='NO'
                className='accent-primary'
                checked={filterDraft.spo === "NO"}
                onChange={e => changeDraftFilter("spo", e.currentTarget.value)}
              />
              <span className='text-text-sm'>No</span>
            </label>
          </div>
        ),
      },
      visible: columnsVisibility.spo,
      widthPx: 50,
    },
    {
      key: "top_delegator",
      render: item => {
        if (!item?.top_delegator?.stake) {
          return <p className='text-right'>-</p>;
        }

        const topDelegator = (item?.top_delegator.stake / item?.amount) * 100;

        return (
          <div className={`flex w-full items-center`}>
            <div className={`flex items-center gap-2`}>
              <PulseDot
                color={
                  topDelegator < 50
                    ? undefined
                    : topDelegator < 100
                      ? "#F79009"
                      : "#F04438"
                }
              />
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
                className='block text-primary'
              >
                <p>{(topDelegator > 100 ? 100 : topDelegator).toFixed(2)}%</p>
              </Link>
            </div>
          </div>
        );
      },
      title: (
        <div className='flex w-full'>
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
            }}
          >
            <span>Top delegator</span>
            <SortArrow
              direction={order === "top_delegator" ? sort : undefined}
            />
          </div>
        </div>
      ),
      visible: columnsVisibility.top_delegator || order === "top_delegator",
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalDreps !== undefined && totalDreps !== totalItems) {
      setTotalItems(totalDreps);
    }
  }, [totalDreps, totalItems]);

  return {
    drepListQuery,
    columns,
    items,
    totalItems,
    tableSearch,
    watchlistOnly,
    displayVoteModal,
    columnsVisibility,
    hasFilter,
    filter,
    filterKeys: ["spo"],
    setDisplayVoteModal,
    setColumnVisibility,
    setTableSearch,
    setWatchlistOnly,
    handleCloseVoteFilter,
    handleAddVoteFilter,
    changeFilterByKey,
  };
};
