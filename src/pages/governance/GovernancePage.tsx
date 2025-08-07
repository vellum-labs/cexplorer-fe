import type { GovernanceActionList } from "@/types/governanceTypes";
import type {
  GovernanceListTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import AdsCarousel from "@/components/global/ads/AdsCarousel";
import { OverviewStatCard } from "@/components/global/cards/OverviewStatCard";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import ExportButton from "@/components/table/ExportButton";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import GlobalTable from "@/components/table/GlobalTable";
import DateCell from "@/components/table/DateCell";
import Copy from "@/components/global/Copy";
import SortBy from "@/components/ui/sortBy";

import { Asterisk, ExternalLink, Landmark, Route, User } from "lucide-react";

import { useGovernanceListTableStore } from "@/stores/tables/governanceListTableStore";
import { useEffect, useState } from "react";
import { useFetchDrepStat } from "@/services/drep";
import { useFetchGovernanceAction } from "@/services/governance";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { governanceListTableOptions } from "@/constants/tables/governanceActionsListTableOptions";
import { formatString } from "@/utils/format/format";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { getEpochByTime } from "@/utils/getEpochByTime";
import { GovernanceStatusBadge } from "@/components/global/badges/GovernanceStatusBadge";
import { ActionTypes } from "@/components/global/ActionTypes";
import { PageBase } from "@/components/global/pages/PageBase";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const GovernancePage: FC = () => {
  const { page, state } = useSearch({
    from: "/gov/action/",
  });

  const navigate = useNavigate();

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useGovernanceListTableStore();

  const drepStatQuery = useFetchDrepStat();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const [selectedItem, setSelectedItem] = useState<
    "All" | "Active" | "Ratified" | "Expired" | "Enacted"
  >(state || "All");

  const { data: drepStat } = drepStatQuery;

  const govActionQuery = useFetchGovernanceAction(
    rows,
    (page ?? 1) * rows - rows,
    state || "All",
    debouncedTableSearch ? debouncedTableSearch : undefined,
  );

  const totalItems = govActionQuery.data?.pages[0].data.count;
  const items = govActionQuery.data?.pages.flatMap(page => page.data.data);

  const selectItems = [
    {
      key: "All",
      value: "All",
    },
    {
      key: "Active",
      value: "Active",
    },
    {
      key: "Ratified",
      value: "Ratified",
    },
    {
      key: "Expired",
      value: "Expired",
    },
    {
      key: "Enacted",
      value: "Enacted",
    },
  ];

  useEffect(() => {
    if (state !== selectedItem && selectedItem !== "All") {
      navigate({
        search: {
          page: 1,
          state: selectedItem,
        } as any,
      });
    } else if (selectedItem === "All" && state) {
      navigate({
        search: {
          page: 1,
        } as any,
      });
    }
  }, [selectedItem]);

  const columns: TableColumns<GovernanceActionList> = [
    {
      key: "start",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        const epoch = getEpochByTime(
          new Date(item.tx.time).getTime(),
          new Date(miscConst?.epoch.start_time ?? "").getTime() / 1000,
          miscConst?.epoch.no ?? 0,
        );

        return (
          <div className='flex flex-col gap-1'>
            <DateCell time={item?.tx?.time} />
            {epoch && (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-grayTextPrimary'>Epoch - </span>
                <Link
                  to='/epoch/$no'
                  params={{
                    no: String(epoch),
                  }}
                  className='text-xs text-primary'
                >
                  {epoch}
                </Link>
              </div>
            )}
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        return item.tx.time;
      },
      title: "Start",
      visible: columnsVisibility.start,
      widthPx: 50,
    },
    {
      key: "type",
      render: item => {
        if (!item?.type) {
          return "-";
        }

        return <ActionTypes title={item?.type as ActionTypes} />;
      },
      title: "Type",
      visible: columnsVisibility.type,
      widthPx: 90,
    },
    {
      key: "gov_action_name",
      render: item => {
        if (!item?.ident?.id) {
          return "-";
        }

        return (
          <div className='flex flex-col'>
            {
              <Link
                to='/gov/action/$id'
                params={{
                  id: item?.ident?.id,
                }}
                className={"text-primary"}
              >
                {item?.anchor?.offchain?.name ?? "⚠️ Invalid metadata"}
              </Link>
            }
            <div className='flex items-center gap-2'>
              <Link
                to='/gov/action/$id'
                params={{
                  id: item?.ident?.id,
                }}
                className={"text-xs"}
                disabled={true}
              >
                {formatString(item?.ident?.id, "long")}
              </Link>
              <Copy copyText={item?.ident?.id} size={10} />
            </div>
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.ident?.id) {
          return "-";
        }

        return item?.ident?.id;
      },
      title: "Name",
      visible: columnsVisibility.gov_action_name,
      widthPx: 220,
    },
    {
      key: "duration",
      render: item => {
        if (!item?.expired_epoch || !item?.tx?.time) {
          return <p className='text-right'>-</p>;
        }

        const epoch = getEpochByTime(
          new Date(item.tx.time).getTime(),
          new Date(miscConst?.epoch.start_time ?? "").getTime() / 1000,
          miscConst?.epoch.no ?? 0,
        );

        return <p className='text-right'>{item?.expired_epoch - epoch}</p>;
      },
      title: <p className='w-full text-right'>Duration (epochs)</p>,
      visible: columnsVisibility.duration,
      widthPx: 50,
    },
    {
      key: "end",
      render: item => {
        if (!item?.expired_epoch) {
          return "-";
        }

        const { endTime } = calculateEpochTimeByNumber(
          +item?.expired_epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          <div className='flex flex-col gap-1'>
            <DateCell time={String(endTime)} />
            {item?.expired_epoch && (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-grayTextPrimary'>Epoch - </span>
                <Link
                  to='/epoch/$no'
                  params={{
                    no: item?.expired_epoch,
                  }}
                  className='text-xs text-primary'
                >
                  {item.expired_epoch}
                </Link>
              </div>
            )}
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.expired_epoch) {
          return "-";
        }

        return item.expired_epoch;
      },
      title: "Expiry epoch",
      visible: columnsVisibility.end,
      widthPx: 50,
    },
    {
      key: "status",
      render: item => (
        <GovernanceStatusBadge
          item={item}
          currentEpoch={miscConst?.no ?? 0}
        />
      ),
      title: "Status",
      visible: columnsVisibility.status,
      widthPx: 40,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return (
          <Link
            to='/tx/$hash'
            params={{
              hash: item.tx.hash,
            }}
            className='flex items-center justify-end text-primary'
          >
            <ExternalLink size={18} />
          </Link>
        );
      },
      title: <p className='w-full text-right'>Tx</p>,
      visible: columnsVisibility.tx,
      widthPx: 40,
    },
  ];

  const statCards = [
    {
      key: "active_gov_actions",
      icon: <Asterisk className='text-primary' />,
      label: "Active governance actions",
      content: (
        <p className='text-2xl font-semibold'>
          {drepStat?.gov_action[0]?.total
            ? drepStat?.gov_action[0]?.total
            : "-"}
        </p>
      ),
      footer: (
        <div className='flex flex-wrap'>
          {!!drepStat?.gov_action[0]?.active && (
            <div className='flex w-fit items-center gap-1 pr-[26px]'>
              <span className='text-sm text-grayTextPrimary'>Active</span>
              <span className='text-sm text-[#17B26A]'>
                {drepStat?.gov_action[0]?.active}
              </span>
            </div>
          )}
          {!!drepStat?.gov_action[0]?.enacted && (
            <div className='flex w-fit items-center gap-1 pr-[26px]'>
              <span className='text-sm text-grayTextPrimary'>Enacted</span>
              <span className='text-sm text-[#00A9E3]'>
                {drepStat?.gov_action[0]?.enacted}
              </span>
            </div>
          )}
          {!!drepStat?.gov_action[0]?.expires && (
            <div className='flex w-fit items-center gap-1 pr-[26px]'>
              <span className='text-sm text-grayTextPrimary'>Expired</span>
              <span className='text-sm text-[#F79009]'>
                {drepStat?.gov_action[0]?.expires}
              </span>
            </div>
          )}
          {!!drepStat?.gov_action[0]?.ratified && (
            <div className='flex w-fit items-center gap-1 pr-[26px]'>
              <span className='text-sm text-grayTextPrimary'>Ratified</span>
              <span className='text-sm text-[#079455]'>
                {drepStat?.gov_action[0]?.ratified}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "gov_parties",
      icon: <Asterisk className='text-primary' />,
      label: "Governance parties",
      content: (
        <div className='flex items-center justify-between gap-2'>
          <Link to='/drep'>
            <div className='flex items-center gap-2'>
              <User className='text-primary' />
              <span className='text-primary'>DReps</span>
            </div>
          </Link>
          <Link to='/pool'>
            <div className='flex items-center gap-2'>
              <Route className='text-primary' />
              <span className='text-primary'>SPOs</span>
            </div>
          </Link>
          <Link to='/gov/cc'>
            <div className='flex items-center gap-2'>
              <Landmark className='text-primary' />
              <span className='text-primary'>CC</span>
            </div>
          </Link>
        </div>
      ),
      footer: <></>,
    },
    {
      key: "featured",
      icon: undefined,
      label: (
        <AdsCarousel
          singleItem
          className='!w-full !max-w-full flex-grow overflow-hidden'
          adCardClassname='!border-none !py-0'
          filterByType='drep'
          maxWidth={false}
        />
      ),
      content: <></>,
      footer: <></>,
      className: "!px-0 overflow-hidden",
      fullContentHeight: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='governance'
      title='Governance actions'
      breadcrumbItems={[{ label: "Governance actions" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-5 md:px-desktop'>
        <div className='flex h-full w-full flex-wrap items-stretch gap-4 lg:flex-nowrap'>
          {drepStatQuery.isLoading || drepStatQuery.isFetching ? (
            <>
              <LoadingSkeleton
                width='426px'
                height='140px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
              <LoadingSkeleton
                width='426px'
                height='140px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
              <LoadingSkeleton
                width='426px'
                height='140px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
            </>
          ) : (
            statCards.map(
              ({
                icon,
                key,
                label,
                content,
                footer,
                className,
                fullContentHeight,
              }) => {
                return (
                  <OverviewStatCard
                    key={key}
                    icon={icon}
                    title={label}
                    value={content}
                    fullContentHeight={fullContentHeight}
                    description={footer}
                    className={`min-w-[300px] ${className ? className : ""}`}
                  />
                );
              },
            )
          )}
        </div>
        <div className='my-4 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap md:hidden'>
            <div className='flex w-full justify-between gap-1 md:hidden'>
              <SortBy
                selectItems={selectItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem as any}
                labelName='Status: '
              />
              <div className='flex items-center gap-2 md:hidden'>
                <ExportButton columns={columns} items={items} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  columnsOptions={governanceListTableOptions.map(item => {
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

          <SortBy
            selectItems={selectItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem as any}
            className='hidden w-fit md:flex'
            labelName='Status: '
          />
          <div className='flex gap-2'>
            <TableSearchInput
              placeholder='Search  your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full '
              showSearchIcon
              showPrefixPopup={false}
            />
            <div className='hidden items-center gap-2 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={governanceListTableOptions.map(item => {
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
          rowHeight={67}
          minContentWidth={1100}
          scrollable
          query={govActionQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof GovernanceListTableColumns) -
              columnsOrder.indexOf(b.key as keyof GovernanceListTableColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
