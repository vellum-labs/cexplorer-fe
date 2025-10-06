import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { HardforkResponseDataDetailExchanges } from "@/types/analyticsTypes";
import type { HardforkTableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import HardforkPageTotalCountItem from "@/components/analytics/HardforkPageTotalCountItem";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import GlobalTable from "@/components/table/GlobalTable";
import ReactEcharts from "echarts-for-react";

import { useFetchHardforks } from "@/services/analytics";
import { useHardforkTableStore } from "@/stores/tables/hardforkTableStore";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect, useState } from "react";

import Tabs from "@/components/global/Tabs";
import { cn } from "@/lib/utils";
import { countObjectNonEmptyValues } from "@/utils/countObjectNonEmptyValues";
import { formatDate } from "@/utils/format/format";
import { hexToRgba } from "@/utils/hexToRgba";

import { PageBase } from "@/components/global/pages/PageBase";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

const HardforkPage: FC = () => {
  const [activeStatus, setActiveStatus] = useState<
    "all" | "completed" | "in_progress" | "not_started"
  >("all");

  const [{ tableSearch }, setTableSearch] = useSearchTable();

  const { rows, setColumsOrder, columnsOrder } = useHardforkTableStore();
  const { theme } = useThemeStore();
  const hardfork = useFetchHardforks();
  const { data, isLoading, isFetching, isError } = hardfork;

  const hardforkPools = data?.pools;

  const [tableItems, setTableItems] = useState<
    HardforkResponseDataDetailExchanges[]
  >(data?.detail?.exchanges ?? []);

  const poolsByDayMax = hardforkPools?.stat["1d"].find(
    item => String(item.version) === String(hardforkPools?.max),
  );

  const poolsByFiveDayMax = hardforkPools?.stat["5d"].find(
    item => String(item.version) === String(hardforkPools?.max),
  );

  const poolsByDayMin = hardforkPools?.stat["1d"].find(
    item => String(item.version) !== String(hardforkPools?.max),
  );

  const poolsByFiveDayMin = hardforkPools?.stat["5d"].find(
    item => String(item.version) !== String(hardforkPools?.max),
  );

  const liquidityByStatusValues = {
    notStarted: 0,
    inProgress: 0,
    ready: 0,
  };

  const statusValues = {
    notStarted: 0,
    inProgress: 0,
    ready: 0,
  };

  useEffect(() => {
    if (
      Array.isArray(data?.detail?.exchanges) &&
      !isLoading &&
      !isFetching &&
      !isError
    ) {
      switch (activeStatus) {
        case "all":
          setTableItems(data.detail?.exchanges);
          break;
        case "completed":
          setTableItems(
            data.detail?.exchanges.filter(item => item.status === "ready"),
          );
          break;
        case "in_progress":
          setTableItems(
            data.detail?.exchanges.filter(item => item.status === "inProgress"),
          );
          break;
        case "not_started":
          setTableItems(
            data.detail?.exchanges.filter(item => item.status === "notStarted"),
          );
          break;
        default:
          return;
      }
    }
  }, [activeStatus, isError, isFetching, isLoading]);

  useEffect(() => {
    if (
      Array.isArray(data?.detail?.exchanges) &&
      !isLoading &&
      !isFetching &&
      !isError
    ) {
      setTableItems(
        data.detail?.exchanges.filter(item =>
          item.name
            .toLowerCase()
            .trim()
            .includes(tableSearch.trim().toLowerCase()),
        ),
      );
    }
  }, [tableSearch, isLoading, isError, isFetching]);

  if (data?.detail?.exchanges) {
    data.detail.exchanges.forEach(exchange => {
      if (exchange.status === "notStarted") {
        liquidityByStatusValues.notStarted += exchange.liquidityPercentage;
      } else if (exchange.status === "inProgress") {
        liquidityByStatusValues.inProgress += exchange.liquidityPercentage;
      } else if (exchange.status === "ready") {
        liquidityByStatusValues.ready += exchange.liquidityPercentage;
      }
    });
  }

  if (data?.info) {
    statusValues.ready = data.info.ready;
    statusValues.inProgress = data.info.inProgress;
    statusValues.notStarted = data.info.notStarted;
  }

  const hardforkTableItems = [
    {
      key: "exchanges",
      render: item => (
        <div className='flex items-center gap-2'>
          <img
            src={item.logo}
            alt='Logo'
            className='rounded-full'
            width={24}
            height={24}
          />
          <span>{item.name}</span>
        </div>
      ),
      title: "Exchanges",
      visible: true,
      widthPx: 95,
    },
    {
      key: "liquidity",
      render: item => <span>{item.liquidityPercentage}%</span>,
      title: "Liquidity",
      visible: true,
      widthPx: 95,
    },
    {
      key: "status",
      render: item => (
        <>
          {item.status === "ready" && (
            <span
              className={cn(
                "rounded-2xl border px-1 py-1/2 text-xs",
                theme === "light" && "text-[#067647]",
              )}
              style={{
                backgroundColor: hexToRgba("#079455", 0.1),
                borderColor: hexToRgba("#079455", 0.3),
              }}
            >
              Completed
            </span>
          )}
          {item.status === "notStarted" && (
            <span
              className={cn(
                "rounded-2xl border px-1 py-1/2 text-xs",
                theme === "light" && "text-[#B42318]",
              )}
              style={{
                backgroundColor: hexToRgba("#f04438", 0.1),
                borderColor: hexToRgba("#f04438", 0.3),
              }}
            >
              Not Started
            </span>
          )}
          {item.status === "inProgress" && (
            <span
              className={cn(
                "rounded-2xl border px-1 py-1/2 text-xs",
                theme === "light" && "text-[#B54708]",
              )}
              style={{
                backgroundColor: hexToRgba("#fdb022", 0.1),
                borderColor: hexToRgba("#fdb022", 0.3),
              }}
            >
              In Progress
            </span>
          )}
        </>
      ),
      title: "Status",
      visible: true,
      widthPx: 95,
    },
    {
      key: "last_updated",
      render: item => (
        <span>{item?.updatedOn ? formatDate(item?.updatedOn) : ""}</span>
      ),
      title: "Last Updated",
      visible: true,
      widthPx: 95,
    },
  ];

  const status: ReactEChartsProps["option"] = {
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position:
            countObjectNonEmptyValues(statusValues) > 1 ? "left" : "center",
          color: theme === "light" ? "#475467" : "#9fa3a8",
          lineHeight: 16,
          fontWeight: 500,
          formatter: function (params) {
            if (params.value === 0) {
              return "";
            }
            const total =
              statusValues.ready +
              statusValues.notStarted +
              statusValues.inProgress;
            const label = params.name.split("\n")[0].replace(/{\w+|}/g, "");
            const percentage = (
              ((params.value as number) / total) *
              100
            ).toFixed(2);
            return `${label}\n${(+percentage > 99.5 ? 100 : percentage) + "%"}`;
          },
          rich: {
            start: {
              align: "left",
            },
            end: {
              align: "right",
            },
          },
        },
        data: [
          {
            value: statusValues.ready,
            name: "Completed",
            itemStyle: {
              color: "#067647",
            },
          },
          {
            value: statusValues.notStarted,
            name: "Not Started",
            itemStyle: {
              color: "#B42318",
            },
          },
          {
            value: statusValues.inProgress,
            name: "In Progress",
            itemStyle: {
              color: "#fedf89",
            },
          },
        ],
      },
    ],
  };

  const statusByLiquidity: ReactEChartsProps["option"] = {
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position:
            countObjectNonEmptyValues(liquidityByStatusValues) > 1
              ? "left"
              : "center",
          color: theme === "light" ? "#475467" : "#9fa3a8",
          lineHeight: 16,
          fontWeight: 500,
          formatter: function (params) {
            if (params.value === 0) {
              return "";
            }
            const total =
              liquidityByStatusValues.ready +
              liquidityByStatusValues.notStarted +
              liquidityByStatusValues.inProgress;
            const label = params.name.split("\n")[0].replace(/{\w+|}/g, "");
            const percentage = (
              ((params.value as number) / total) *
              100
            ).toFixed(2);
            return `${label}\n${(+percentage > 99.5 ? 100 : percentage) + "%"}`;
          },
          rich: {
            start: {
              align: "left",
            },
            end: {
              align: "right",
            },
          },
        },
        data: [
          {
            value: liquidityByStatusValues.ready,
            name: "Completed",
            itemStyle: {
              color: "#067647",
            },
          },
          {
            value: liquidityByStatusValues.notStarted,
            name: "Not Started",
            itemStyle: {
              color: "#B42318",
            },
          },
          {
            value: liquidityByStatusValues.inProgress,
            name: "In Progress",
            itemStyle: {
              color: "#fedf89",
            },
          },
        ],
      },
    ],
  };

  const countByDayOption: ReactEChartsProps["option"] = {
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "left",
          color: theme === "light" ? "#475467" : "#9fa3a8",
          lineHeight: 16,
          fontWeight: 500,
          formatter: function (params) {
            if (params.value === 0) {
              return "";
            }
            const total =
              (poolsByDayMin?.count ?? 0) + (poolsByDayMax?.count ?? 0);

            const label = params.name.split("\n")[0].replace(/{\w+|}/g, "");
            const percentage = (
              ((params.value as number) / total) *
              100
            ).toFixed(2);
            return `${label}\n${(+percentage > 99.5 ? 100 : percentage) + "%"}`;
          },
          rich: {
            start: {
              align: "left",
            },
            end: {
              align: "right",
            },
          },
        },
        data: [
          {
            value: poolsByDayMax?.count ?? 0,
            name: `Version ${poolsByDayMax?.version}`,
            itemStyle: {
              color: "#067647",
            },
          },
          {
            value: poolsByDayMin?.count ?? 0,
            name: `Version ${poolsByDayMin?.version}`,
            itemStyle: {
              color: "#B42318",
            },
          },
        ],
      },
    ],
  };

  const countBy5DayOption: ReactEChartsProps["option"] = {
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "left",
          color: theme === "light" ? "#475467" : "#9fa3a8",
          lineHeight: 16,
          fontWeight: 500,
          formatter: function (params) {
            if (params.value === 0) {
              return "";
            }
            const total =
              (poolsByFiveDayMin?.count ?? 0) + (poolsByFiveDayMax?.count ?? 0);

            const label = params.name.split("\n")[0].replace(/{\w+|}/g, "");
            const percentage = (
              ((params.value as number) / total) *
              100
            ).toFixed(2);
            return `${label}\n${(+percentage > 99.5 ? 100 : percentage) + "%"}`;
          },
          rich: {
            start: {
              align: "left",
            },
            end: {
              align: "right",
            },
          },
        },
        data: [
          {
            value: poolsByFiveDayMax?.count ?? 0,
            name: `Version ${poolsByFiveDayMax?.version}`,
            itemStyle: {
              color: "#067647",
            },
          },
          {
            value: poolsByFiveDayMin?.count ?? 0,
            name: `Version ${poolsByFiveDayMin?.version}`,
            itemStyle: {
              color: "#B42318",
            },
          },
        ],
      },
    ],
  };

  const exhcangeTabItems = [
    {
      key: "count",
      label: "Count",
      content: (
        <div className='h-full w-full'>
          <ReactEcharts option={status} />
        </div>
      ),
      extraTitle: <p className='lg:w-full'>Exchange readiness</p>,
      visible: true,
    },
    {
      key: "liquidity",
      label: "Liquidity",
      content: (
        <div className='h-full w-full'>
          <ReactEcharts option={statusByLiquidity} />
        </div>
      ),
      extraTitle: <p className='lg:w-full'>Exchange readiness</p>,
      visible: true,
    },
  ];

  const blockTabItems = [
    {
      key: "1_day",
      label: "1 day",
      content: (
        <div className='h-full w-full'>
          <ReactEcharts option={countByDayOption} />
        </div>
      ),
      extraTitle: <p className='lg:w-full'>Block production</p>,
      visible: true,
    },
    {
      key: "5_days",
      label: "5 days",
      content: (
        <div className='h-full w-full'>
          <ReactEcharts option={countBy5DayOption} />
        </div>
      ),
      extraTitle: <p className='lg:w-full'>Block production</p>,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='hardfork'
      title='Chang Hardfork'
      breadcrumbItems={[{ label: "Hardfork" }]}
      adsCarousel={false}
      subTitle={
        <div className='flex w-full flex-col gap-1 text-grayTextPrimary'>
          <p>{data?.info?.description}</p>
          <div className='flex w-full items-center gap-1 text-sm'>
            <p>Release date:</p>
            <span className='text-nowrap leading-none text-grayTextPrimary'>
              {formatDate(
                data?.info?.releaseDate ? data?.info?.releaseDate : undefined,
              )}
            </span>
          </div>
        </div>
      }
    >
      <section className='flex min-h-[450px] w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-wrap justify-between gap-5 p-mobile md:px-desktop md:py-mobile'>
          <div className='flex w-full grow basis-[420px] flex-wrap gap-6 lg:flex-nowrap'>
            <div className='w-full rounded-lg border border-border'>
              {data?.detail?.exchanges ? (
                <Tabs items={exhcangeTabItems} tabParam='exchange' toRight />
              ) : (
                <div className='my-3 flex w-full max-w-desktop flex-col px-mobile md:px-desktop'>
                  <p className='mb-3 h-[37.6px] w-full'>Exchange readiness</p>
                  <div className='h-full w-full'>
                    <ReactEcharts option={status} />
                  </div>
                </div>
              )}
            </div>
            <div className='w-full rounded-lg border border-border'>
              <Tabs items={blockTabItems} tabParam='block' toRight />
            </div>
          </div>
        </div>
      </section>
      <section className='flex w-full max-w-desktop flex-col p-mobile md:p-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='flex flex-wrap gap-1 md:flex-nowrap'>
            <HardforkPageTotalCountItem
              title='All'
              count={
                (data?.info?.ready ?? 0) +
                (data?.info?.inProgress ?? 0) +
                (data?.info?.notStarted ?? 0)
              }
              className={cn("bg-all", theme === "light" && "text-[#344054]")}
              wrapperClassname={cn(
                !data?.detail?.exchanges && "!cursor-default",
              )}
              active={data?.detail?.exchanges ? activeStatus === "all" : false}
              onClick={
                data?.detail?.exchanges
                  ? () => setActiveStatus("all")
                  : undefined
              }
            />
            <HardforkPageTotalCountItem
              title='Completed'
              count={data?.info?.ready ?? 0}
              className={cn(
                "bg-completed",
                theme === "light" && "text-[#067647]",
              )}
              wrapperClassname={cn(
                !data?.detail?.exchanges && "!cursor-default",
              )}
              active={
                data?.detail?.exchanges ? activeStatus === "completed" : false
              }
              onClick={
                data?.detail?.exchanges
                  ? () => setActiveStatus("completed")
                  : undefined
              }
            />
            <HardforkPageTotalCountItem
              title='In Progress'
              count={data?.info?.inProgress ?? 0}
              className={cn(
                "bg-inProgress",
                theme === "light" && "text-[#B54708]",
              )}
              wrapperClassname={cn(
                !data?.detail?.exchanges && "!cursor-default",
              )}
              active={
                data?.detail?.exchanges ? activeStatus === "in_progress" : false
              }
              onClick={
                data?.detail?.exchanges
                  ? () => setActiveStatus("in_progress")
                  : undefined
              }
            />
            <HardforkPageTotalCountItem
              title='Not Started'
              count={data?.info?.notStarted ?? 0}
              className={cn(
                "bg-notStarted",
                theme === "light" && "text-[#B42318]",
              )}
              wrapperClassname={cn(
                !data?.detail?.exchanges && "!cursor-default",
              )}
              active={
                data?.detail?.exchanges ? activeStatus === "not_started" : false
              }
              onClick={
                data?.detail?.exchanges
                  ? () => setActiveStatus("not_started")
                  : undefined
              }
            />
          </div>
          {data?.detail?.exchanges && (
            <TableSearchInput
              placeholder='Search by exchange'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
          )}
        </div>
        {data?.detail?.exchanges && (
          <GlobalTable
            type='default'
            totalItems={data?.detail?.exchanges?.length ?? 0}
            itemsPerPage={rows}
            scrollable
            items={tableItems
              .sort((a, b) => a.name.localeCompare(b.name))
              .sort((a, b) => b.liquidityPercentage - a.liquidityPercentage)
              .sort((a, b) => {
                const statusOrder = ["ready", "inProgress", "notStarted"];

                return (
                  statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
                );
              })}
            query={hardfork}
            columns={hardforkTableItems.sort((a, b) => {
              return (
                columnsOrder.indexOf(a.key as keyof HardforkTableColumns) -
                columnsOrder.indexOf(b.key as keyof HardforkTableColumns)
              );
            })}
            onOrderChange={setColumsOrder}
          />
        )}
      </section>
    </PageBase>
  );
};

export default HardforkPage;
