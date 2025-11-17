import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { adaPotsTableOptions } from "@/constants/tables/adaPotsTableOptions";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchAdaPots } from "@/services/analytics";
import { useAdaPotsTableStore } from "@/stores/tables/adaPotsTableStore";
import type { AdaPot } from "@/types/analyticsTypes";
import type { AdaPotsTableColumns, TableColumns } from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { generateImageUrl } from "@/utils/generateImageUrl";

export const PotsPage = () => {
  const [
    { debouncedTableSearch: debouncedSearch, tableSearch },
    setTableSearch,
  ] = useSearchTable();

  const [items, setItems] = useState<AdaPot[] | undefined>([]);
  const {
    columnsOrder,
    setColumsOrder,
    columnsVisibility,
    setColumnVisibility,
    rows,
    setRows,
    epochsToShow,
    setEpochsToShow,
  } = useAdaPotsTableStore();
  const query = useFetchAdaPots();
  const count = query.data?.data.count ?? 0;

  const miscBasicQuery = useFetchMiscBasic();

  const sortOptions = [
    {
      key: "all",
      value: "All",
    },
    {
      key: "10",
      value: "Last 10",
    },
    {
      key: "25",
      value: "Last 25",
    },
    {
      key: "50",
      value: "Last 50",
    },
    {
      key: "100",
      value: "Last 100",
    },
  ];

  const columns: TableColumns<AdaPot> = [
    {
      key: "epoch",
      title: <p className='w-full text-right'>Epoch</p>,
      render: item => <EpochCell no={item.epoch_no} />,
      visible: columnsVisibility.epoch,
      widthPx: 30,
    },
    {
      key: "treasury",
      title: <p className='w-full text-right'>Treasury</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.treasury} />
        </span>
      ),
      visible: columnsVisibility.treasury,
      widthPx: 50,
    },
    {
      key: "reserves",
      title: <p className='w-full text-right'>Reserves</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.reserves} />
        </span>
      ),
      visible: columnsVisibility.reserves,
      widthPx: 50,
    },
    {
      key: "rewards",
      title: <p className='w-full text-right'>Rewards</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.rewards} />
        </span>
      ),
      visible: columnsVisibility.rewards,
      widthPx: 50,
    },
    {
      key: "utxo",
      title: <p className='w-full text-right'>UTXO</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.utxo} />
        </span>
      ),
      visible: columnsVisibility.utxo,
      widthPx: 50,
    },
    {
      key: "deposits",
      title: <p className='w-full text-right'>Deposits</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.deposits_stake} />
        </span>
      ),
      visible: columnsVisibility.deposits,
      widthPx: 50,
    },
    {
      key: "fees",
      title: <p className='w-full text-right'>Fees</p>,
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item.fees} />
        </span>
      ),
      visible: columnsVisibility.fees,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (!epochsToShow) return;
    if (epochsToShow === "all") {
      setItems(query.data?.data.data);
      return;
    }
    setItems(query.data?.data.data.slice(0, Number(epochsToShow)));
  }, [epochsToShow, query.data]);

  return (
    <>
      <Helmet>{<title>{metadata.adaPots.title}</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title='Pots'
          breadcrumbItems={[{ label: "Pots" }]}
          subTitle
        />
        <AdsCarousel
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
        />
        <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
          <div className='mb-1 ml-auto flex items-center'>
            <span className='mr-1 text-text-sm text-grayTextPrimary'>
              Graph epochs:{" "}
            </span>
            <SortBy
              selectedItem={epochsToShow}
              setSelectedItem={setEpochsToShow as any}
              selectItems={sortOptions}
              label={false}
            />
          </div>
          <AdaPotsChart data={items} />
          <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
            <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
              {query.isLoading || query.isFetching ? (
                <LoadingSkeleton height='27px' width={"220px"} />
              ) : count > 0 ? (
                <h3 className='basis-[230px] text-nowrap'>
                  Total of {formatNumber(count)} epochs
                </h3>
              ) : (
                ""
              )}
              <div className='flex w-full justify-end md:hidden'>
                <div className='flex items-center gap-1 md:hidden'>
                  <ExportButton columns={columns} />
                  <TableSettingsDropdown
                    rows={rows}
                    setRows={setRows}
                    columnsOptions={adaPotsTableOptions.map(item => {
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
              <TableSearchInput
                placeholder='Search  your results...'
                value={tableSearch}
                onchange={setTableSearch}
                wrapperClassName='md:w-[320px] w-full '
                showSearchIcon
                showPrefixPopup={false}
              />
              <div className='hidden items-center gap-1 md:flex'>
                <ExportButton columns={columns} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  columnsOptions={adaPotsTableOptions.map(item => {
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
            type='default'
            pagination={true}
            totalItems={count}
            scrollable
            query={query}
            items={
              items?.filter(item =>
                String(item.epoch_no).includes(debouncedSearch),
              ) ?? []
            }
            columns={columns.sort((a, b) => {
              return (
                columnsOrder.indexOf(a.key as keyof AdaPotsTableColumns) -
                columnsOrder.indexOf(b.key as keyof AdaPotsTableColumns)
              );
            })}
            onOrderChange={setColumsOrder}
          />
        </section>
      </main>
    </>
  );
};

const AdaPotsChart = ({ data }: { data: AdaPot[] | undefined }) => {
  const epochs = data?.map(item => item.epoch_no);
  const treasury = data?.map(item => item.treasury);
  const reserves = data?.map(item => item.reserves);
  const rewards = data?.map(item => item.rewards);
  const utxo = data?.map(item => item.utxo);
  const deposits = data?.map(item => item.deposits_stake);
  const fees = data?.map(item => item.fees);

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [graphsVisibility, setGraphsVisibility] = useState({
    Treasury: true,
    Reserves: true,
    Rewards: true,
    UTXO: true,
    Deposits: true,
    Fees: true,
  });
  const { textColor, bgColor, splitLineColor, inactivePageIconColor } =
    useGraphColors();

  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const onEvents = useMemo(
    () => ({
      legendselectchanged: params => {
        const { selected } = params;

        setGraphsVisibility(selected);

        localStorage.setItem("ada_pots_graph_store", JSON.stringify(selected));
      },
    }),
    [],
  );

  const option: ReactEChartsProps["option"] = useMemo(() => {
    return {
      legend: {
        pageIconColor: textColor,
        pageIconInactiveColor: inactivePageIconColor,
        pageTextStyle: {
          color: textColor,
        },
        type: "scroll",
        data: ["Treasury", "Reserves", "Rewards", "UTXO", "Deposits", "Fees"],
        textStyle: {
          color: textColor,
        },
        selected: Object.keys(graphsVisibility).reduce((acc, key) => {
          acc[key] = graphsVisibility[key];
          return acc;
        }, {}),
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: bgColor,
        confine: true,
        textStyle: {
          color: textColor,
        },
        formatter: function (params) {
          const epoch = +params[0]?.axisValue;
          const { startTime, endTime } = calculateEpochTimeByNumber(
            epoch,
            miscConst?.epoch.no ?? 0,
            miscConst?.epoch.start_time ?? "",
          );

          const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(
            endTime,
            "dd.MM.yy",
          )} (Epoch: ${epoch})<hr style="margin: 4px 0;" />`;

          const body = params
            .map(item => {
              const value = lovelaceToAda(item.data);
              return `${item.marker} ${item.seriesName}: ${value}`;
            })
            .join("<br/>");

          return header + body;
        },
      },

      grid: {
        top: 40,
        right: 10,
        bottom: 40,
        left: 18,
      },
      xAxis: {
        type: "category",
        data: epochs,
        inverse: true,
        name: "Epoch",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: {
          color: textColor,
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          show: true,
          name: "Amount",
          nameRotate: 90,
          nameLocation: "middle",
          nameGap: 5,
          id: "0",
          axisLabel: {
            show: false,
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
        {
          type: "value",
          position: "right",
          id: "1",
          show: false,
          axisLabel: {
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
        {
          type: "value",
          position: "left",
          show: false,
          id: "2",
          axisLabel: {
            show: false,
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
        {
          type: "value",
          position: "right",
          id: "3",
          show: false,
          axisLabel: {
            show: false,
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
        {
          type: "value",
          position: "right",
          id: "4",
          show: false,
          axisLabel: {
            show: false,
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
        {
          type: "value",
          position: "right",
          id: "5",
          show: false,
          axisLabel: {
            show: false,
            color: textColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
        },
      ],
      series: [
        {
          type: "line",
          data: treasury,
          name: "Treasury",
          yAxisIndex: 0,
          itemStyle: {
            color: "#35c2f5",
          },
          showSymbol: false,
          z: 2,
        },
        {
          type: "bar",
          data: reserves,
          name: "Reserves",
          yAxisIndex: 1,
          itemStyle: {
            color: "rgba(145, 145, 145, 0.5)",
            opacity: 0.7,
          },
          showSymbol: false,
          z: 1,
        },
        {
          type: "line",
          data: rewards,
          name: "Rewards",
          yAxisIndex: 2,
          itemStyle: {
            color: textColor,
          },
          showSymbol: false,
          z: 3,
        },
        {
          type: "line",
          areaStyle: {
            opacity: 0.12,
          },
          data: utxo,
          name: "UTXO",
          yAxisIndex: 3,
          itemStyle: {
            color: "#21fc1e",
          },
          showSymbol: false,
          z: 4,
        },
        {
          type: "line",
          data: deposits,
          name: "Deposits",
          yAxisIndex: 4,
          areaStyle: {
            opacity: 0.12,
          },
          itemStyle: {
            color: "#ffc115",
          },
          showSymbol: false,
          markArea: {
            silent: true,
            itemStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          z: 5,
        },
        {
          type: "line",
          data: fees,
          name: "Fees",
          yAxisIndex: 5,
          areaStyle: {
            opacity: 0.12,
          },
          showSymbol: false,
          itemStyle: {
            color: "#da16e8",
          },
          z: 6,
        },
      ],
    };
  }, [
    textColor,
    bgColor,
    splitLineColor,
    inactivePageIconColor,
    graphsVisibility,
    epochs,
    fees,
    reserves,
    deposits,
    rewards,
    treasury,
    utxo,
  ]);

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("ada_pots_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "pool_performance_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 400 }}
        onChartReady={onChartReadyCallback}
        onEvents={onEvents}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full min-h-[400px] w-full'
      />
    </div>
  );
};
