import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import PulseDot from "@/components/global/PulseDot";
import Tabs from "@/components/global/Tabs";
import { MetadataCell } from "@/components/metadata/MetadataCell";
import { PoolListEchart } from "@/components/pool/PoolListEchart";
import RoaDiffArrow from "@/components/pool/RoaDiffArrow";
import DateCell from "@/components/table/DateCell";
import GlobalTable from "@/components/table/GlobalTable";
import PoolCell from "@/components/table/PoolCell";
import { GroupDetailCharts } from "@/components/groups/GroupDetailCharts";
import { GroupDetailDRepCharts } from "@/components/groups/GroupDetailDRepCharts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Tooltip } from "@/components/ui/tooltip";
import { drepListTableOptions } from "@/constants/tables/drepListTableOptions";
import { poolsListTableOptions } from "@/constants/tables/poolsListTableOptions";
import { useMiscConst } from "@/hooks/useMiscConst";
import { cn } from "@/lib/utils";
import { useFetchGroupDetail } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useDrepListTableStore } from "@/stores/tables/drepListTableStore";
import { usePoolsListTableStore } from "@/stores/tables/poolsListTableStore";
import type { GroupDetailData } from "@/types/analyticsTypes";
import type {
  DrepListTableColumns,
  PoolsListColumns,
  TableColumns,
} from "@/types/tableTypes";
import { activeStakePercentage } from "@/utils/activeStakePercentage";
import { calculateTotalPoolBlocks } from "@/utils/calculateTotalPoolBlocks";
import { formatNumber } from "@/utils/format/format";
import { getEpochColor } from "@/utils/getEpochColor";
import { getPledgeColor } from "@/utils/getPledgeColor";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { poolRewardsRoaDiff } from "@/utils/poolRewardsRoaDiff";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Check, Filter, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const GroupDetailPage = () => {
  const [isAnyDrepItem, setIsAnyDrepItem] = useState(false);
  const [filter, setFilter] = useState<"pool" | "drep">("pool");

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [filteredItems, setFilteredItems] =
    useState<GroupDetailData["items"]>();
  const tableRef = useRef<HTMLDivElement>(null);
  const route = getRouteApi("/groups/$url");
  const { url } = route.useParams();
  const {
    columnsVisibility: poolColumnsVisibility,
    rows: poolRows,
    setColumnVisibility: poolSetColumnVisibility,
    setColumsOrder: poolSetColumsOrder,
    columnsOrder: poolColumnsOrder,
    setRows: poolSetRows,
  } = usePoolsListTableStore()();
  const {
    columnsVisibility: drepColumnsVisibility,
    rows: drepRows,
    setColumnVisibility: drepSetColumnVisibility,
    setColumsOrder: drepSetColumsOrder,
    columnsOrder: drepColumnsOrder,
    setRows: drepSetRows,
  } = useDrepListTableStore()();
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);
  const query = useFetchGroupDetail(url);
  const data = query.data?.data.data[0];
  const name = data?.name;
  const description = data?.description;
  const items = useMemo(
    () => data?.items?.filter(item => item.type === (filter || "pool")),
    [data?.items, filter],
  );

  const tabItems = [
    {
      key: "pool",
      label: "Stake pools",
      visible: true,
    },
    {
      key: "drep",
      label: "DReps",
      visible: true,
    },
  ];

  const poolColumns: TableColumns<GroupDetailData["items"][number]> = [
    {
      key: "ranking",
      standByRanking: true,
      render: () => null,
      title: <span>#</span>,
      visible: poolColumnsVisibility.ranking,
      widthPx: 40,
    },
    {
      key: "pool",
      title: "Pool",
      render: item => {
        return (
          <PoolCell
            poolInfo={{
              id: item?.info[0]?.pool_id,
              meta: item?.info[0]?.pool_name,
            }}
          />
        );
      },
      widthPx: 50,
      visible: poolColumnsVisibility.pool,
    },
    {
      key: "stake",
      render: item => {
        const [optimalPoolSize, poolCapUsed] = activeStakePercentage(
          item.info[0].live_stake ?? 0,
          miscConst?.circulating_supply ?? 1,
          miscConst?.epoch_param.optimal_pool_count ?? 1,
        );

        const fixedPoolCapUsed = poolCapUsed ? poolCapUsed.toFixed(2) : 0;

        return (
          <div className='flex flex-col gap-1.5'>
            <span className='text-right text-grayTextPrimary'>
              <AdaWithTooltip data={item.info[0].active_stake ?? 0} />
            </span>
            <div className='flex items-center justify-end gap-1'>
              <div
                className='relative h-3 max-w-20 overflow-hidden rounded-[4px] bg-[#FEC84B]'
                style={{
                  width: `${optimalPoolSize}%`,
                }}
              >
                <span className='absolute -top-1 left-[45%] z-10 w-12 -translate-x-1/2 text-right text-[10px] text-black'>
                  {String(fixedPoolCapUsed).length < 10 && fixedPoolCapUsed}%
                </span>
                <span
                  className='absolute left-0 block h-3 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{
                    width: `${poolCapUsed ?? 0}%`,
                  }}
                ></span>
              </div>
            </div>
          </div>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          <span>Stake</span>
        </div>
      ),
      visible: poolColumnsVisibility.stake,
      widthPx: 30,
    },
    {
      key: "rewards",
      render: item => {
        const lifetimeRoa = poolRewardsRoaDiff(
          item.info[0].stats?.lifetime?.roa,
          miscConst,
        );
        const recentRoa = poolRewardsRoaDiff(
          item.info[0].stats?.recent?.roa,
          miscConst,
        );

        return (
          <div>
            <div className='flex items-center justify-end gap-1/2'>
              <RoaDiffArrow color={lifetimeRoa} />
              <p className='text-left text-grayTextPrimary'>
                {item.info[0].stats?.lifetime?.roa
                  ? item.info[0].stats?.lifetime?.roa?.toFixed(2)
                  : (0).toFixed(2)}
                %
              </p>
            </div>
            <div className='flex items-center justify-end gap-1/2'>
              <RoaDiffArrow color={recentRoa} />
              <p className='text-left text-grayTextPrimary'>
                {item.info[0].stats?.recent?.roa
                  ? item.info[0].stats?.recent?.roa.toFixed(2)
                  : (0).toFixed(2)}
                %
              </p>
            </div>
          </div>
        );
      },
      title: <span className='flex justify-end'>Rewards</span>,
      visible: poolColumnsVisibility.rewards,
      widthPx: 30,
    },
    {
      key: "luck",
      render: item => {
        return (
          <p className='text-right text-grayTextPrimary'>
            {item.info[0].stats?.lifetime?.luck * 100
              ? (item.info[0].stats?.lifetime?.luck * 100).toFixed(2)
              : 0}
            %
          </p>
        );
      },
      title: <p className='w-full text-right'>Luck</p>,
      visible: poolColumnsVisibility.luck,
      widthPx: 30,
    },
    {
      key: "fees",
      render: item => {
        return (
          <div className='flex flex-col text-right text-text-xs text-grayTextPrimary'>
            <span>
              {item?.info[0].pool_update?.active?.margin
                ? (item.info[0].pool_update?.active?.margin * 100).toFixed(2)
                : 0}
              %
            </span>
            <span>
              <AdaWithTooltip
                data={item?.info[0].pool_update?.active?.fixed_cost ?? 0}
              />
            </span>
          </div>
        );
      },
      title: <p className='w-full text-right'>Fees</p>,
      visible: poolColumnsVisibility.fees,
      widthPx: 30,
    },
    {
      key: "blocks",
      render: item => {
        const totalPoolBlocks = calculateTotalPoolBlocks(item.info[0]);
        const totalEstimatedBlocksFixed = totalPoolBlocks?.totalEstimatedBlocks
          ? +totalPoolBlocks.totalEstimatedBlocks.toFixed(1)
          : 0;
        const formattedTotalBlocks = formatNumber(item.info[0].blocks?.total);

        const epochs = Object.values(item.info[0].epochs ?? {}).slice(2);
        const epochData = epochs.map(epoch => ({
          epoch: (epoch as any).no,
          minted: (epoch as any).data.block.minted,
          estimated: (epoch as any).data.block.estimated,
          luck: (epoch as any).data.block.luck,
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
                  return currentData.minted === 0
                    ? "red"
                    : getEpochColor(currentData.luck);
                }}
                toolTipFormatter={params => {
                  const data = epochData[params.dataIndex];

                  return `
                    <div style="font-size: 12px; line-height: 14px;">
                      <span>Epoch: ${data.epoch}</span>
                      <br/>
                      <span>Minted: ${data.minted}</span>
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
      title: <span className='flex justify-end'>Blocks</span>,
      visible: poolColumnsVisibility.blocks,
      widthPx: 40,
    },
    {
      key: "pledge",
      render: item => {
        const pledge = item?.info[0].pool_update?.live?.pledge ?? 0;
        const pledged = item?.info[0].pledged ?? 0;

        let pledgeLeverage = 0;

        if (pledge > 0) {
          pledgeLeverage = Math.round(
            (item.info[0].live_stake ?? 1) / (pledge > 0 ? pledge : 1),
          );
        }

        return (
          <div className='flex flex-col items-end'>
            <div className='flex items-center gap-1/2'>
              {pledged >= pledge ? (
                <Check
                  size={11}
                  className='translate-y-[1px] stroke-[#17B26A]'
                />
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
                  <AdaWithTooltip
                    data={item.info[0].pool_update?.active?.pledge ?? 0}
                  />
                </span>
              </Tooltip>
            </div>
            <div className='flex items-center justify-end gap-1/2'>
              <Filter
                size={11}
                color={getPledgeColor(pledgeLeverage)}
                className={cn("translate-y-[2px]")}
              />
              <span className='text-text-xs text-grayTextPrimary'>
                x{pledgeLeverage}
              </span>
            </div>
          </div>
        );
      },
      title: (
        <div className='flex w-full justify-end'>
          <span>Pledge</span>
        </div>
      ),
      visible: poolColumnsVisibility.pledge,
      widthPx: 30,
    },
  ].sort((a, b) => {
    return (
      poolColumnsOrder.indexOf(a.key as keyof PoolsListColumns) -
      poolColumnsOrder.indexOf(b.key as keyof PoolsListColumns)
    );
  });

  const drepColumns: TableColumns<GroupDetailData["items"][number]> = [
    {
      key: "status",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]
        ) {
          return "-";
        }

        const isActive = item.info[0].is_active;

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-m border border-border px-[10px]'>
            <PulseDot color={!isActive ? "bg-yellowText" : undefined} />
            <span className='text-text-xs font-medium'>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
      title: <p>Status</p>,
      visible: drepColumnsVisibility.status,
      widthPx: 50,
    },
    {
      key: "drep_name",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.hash?.view
        ) {
          return "-";
        }

        return <DrepNameCell item={item.info[0] as any} />;
      },
      title: <p>DRep name</p>,
      visible: drepColumnsVisibility.drep_name,
      widthPx: 50,
    },
    {
      key: "voting_power",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.amount
        ) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.info[0].amount} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Voting Power</p>,
      visible: drepColumnsVisibility.voting_power,
      widthPx: 50,
    },
    {
      key: "delegators",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.distr?.count
        ) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>{formatNumber(item.info[0].distr.count)}</p>
        );
      },
      title: <p className='w-full text-right'>Delegators</p>,
      visible: drepColumnsVisibility.delegators,
      widthPx: 40,
    },
    {
      key: "voting_activity",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.stat?.total?.votes[0]?.count ||
          !item.info[0]?.stat?.total?.opportunity
        ) {
          return <p className='text-right'>-</p>;
        }

        const count = item.info[0].stat.total.votes[0].count;
        const opportunity = item.info[0].stat.total.opportunity;

        return (
          <p className='text-right'>
            {((count / opportunity) * 100).toFixed(2)}%
          </p>
        );
      },
      title: <p className='w-full text-right'>Voting Activity</p>,
      visible: drepColumnsVisibility.voting_activity,
      widthPx: 40,
    },
    {
      key: "registered",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.since
        ) {
          return "-";
        }

        return <DateCell time={item.info[0].since} />;
      },
      jsonFormat: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.since
        ) {
          return "-";
        }

        return item.info[0].since;
      },
      title: <p>Registered</p>,
      visible: drepColumnsVisibility.registered,
      widthPx: 50,
    },
    {
      key: "metadata",
      render: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.data
        ) {
          return <p className='text-right'>-</p>;
        }

        return <MetadataCell metadata={item.info[0].data} />;
      },
      jsonFormat: item => {
        if (
          item.type !== "drep" ||
          !Array.isArray(item.info) ||
          !item.info[0]?.data
        ) {
          return "-";
        }

        return JSON.stringify(item.info[0].data);
      },
      title: <p className='w-full text-right'>DRep metadata</p>,
      visible: drepColumnsVisibility.metadata,
      widthPx: 80,
    },
  ].sort((a, b) => {
    return (
      drepColumnsOrder.indexOf(a.key as keyof DrepListTableColumns) -
      drepColumnsOrder.indexOf(b.key as keyof DrepListTableColumns)
    );
  });

  useEffect(() => {
    if (data?.items?.some(item => item.type === "drep")) {
      setIsAnyDrepItem(true);
    } else {
      setIsAnyDrepItem(false);
    }
  }, [data?.items]);

  useEffect(() => {
    if (debouncedTableSearch) {
      setFilteredItems(
        filter === "pool"
          ? items?.filter(
              item =>
                item.type === "pool" &&
                (item.info[0]?.pool_name?.name
                  ?.toLowerCase()
                  .includes(debouncedTableSearch?.toLowerCase()) ||
                  item.info[0].pool_id.includes(
                    debouncedTableSearch?.toLowerCase(),
                  ) ||
                  item.info[0]?.pool_name?.ticker
                    ?.toLowerCase()
                    .includes(debouncedTableSearch?.toLowerCase()) ||
                  item.info[0].pool_id.includes(
                    debouncedTableSearch?.toLowerCase(),
                  )),
            )
          : items?.filter(item =>
              item.ident
                .toLowerCase()
                .includes(debouncedTableSearch?.toLowerCase()),
            ),
      );
    } else {
      setFilteredItems(items);
    }
  }, [debouncedTableSearch, items, filter]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {
          <title>
            {metadata.groupDetail.title.replace("%group%", name ?? "")}
          </title>
        }
        <meta
          name='description'
          content={metadata.groupDetail.description.replace(
            "%group%",
            name ?? "",
          )}
        />
        <meta
          name='keywords'
          content={metadata.groupDetail.keywords.replace("%group%", name ?? "")}
        />
      </Helmet>
      <main className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col justify-center'>
          <Breadcrumb className='mb-2 w-full'>
            <BreadcrumbList className='flex items-center'>
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to='/'>
                  Home
                </Link>
              </BreadcrumbItem>
              /
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to={"/groups"}>
                  Groups
                </Link>
              </BreadcrumbItem>
              / <BreadcrumbItem className='text-text'>{name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className='text-left'>{name}</h1>
          <p className='mt-1'>{description}</p>
          <div className='my-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
            <div className='flex w-full flex-wrap items-center justify-end gap-1 md:flex-nowrap'>
              {isAnyDrepItem && (
                <Tabs
                  withPadding={false}
                  withMargin={false}
                  items={tabItems}
                  onClick={activeTab => setFilter(activeTab as "pool" | "drep")}
                />
              )}
              <div className='flex flex-grow items-center gap-1 md:flex-grow-0'>
                <TableSearchInput
                  placeholder='Search your results...'
                  value={tableSearch}
                  onchange={setTableSearch}
                  wrapperClassName='md:w-[320px] w-full '
                  showSearchIcon
                  showPrefixPopup={false}
                />
                <TableSettingsDropdown
                  rows={filter === "pool" ? poolRows : drepRows}
                  setRows={filter === "pool" ? poolSetRows : drepSetRows}
                  columnsOptions={
                    filter === "pool"
                      ? poolsListTableOptions.map(item => {
                          return {
                            label: item.name,
                            isVisible: poolColumnsVisibility[item.key],
                            onClick: () =>
                              poolSetColumnVisibility(
                                item.key,
                                !poolColumnsVisibility[item.key],
                              ),
                          };
                        })
                      : drepListTableOptions.map(item => {
                          return {
                            label: item.name,
                            isVisible: drepColumnsVisibility[item.key],
                            onClick: () =>
                              drepSetColumnVisibility(
                                item.key,
                                !drepColumnsVisibility[item.key],
                              ),
                          };
                        })
                  }
                />
              </div>
            </div>
          </div>
          {filter === "pool" && <GroupDetailCharts items={filteredItems ?? []} />}
          {filter === "drep" && (
            <GroupDetailDRepCharts items={filteredItems ?? []} />
          )}
          <GlobalTable
            type='default'
            pagination
            scrollable
            totalItems={filteredItems?.length}
            columns={filter === "pool" ? poolColumns : drepColumns}
            items={filteredItems ?? []}
            itemsPerPage={filter === "pool" ? poolRows : drepRows}
            query={query}
            onOrderChange={
              filter === "pool" ? poolSetColumsOrder : drepSetColumsOrder
            }
          />
        </div>
      </main>
    </>
  );
};
