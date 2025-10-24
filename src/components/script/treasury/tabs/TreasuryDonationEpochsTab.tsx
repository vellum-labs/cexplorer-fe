import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";
import type { TableColumns } from "@/types/tableTypes";
import type {
  TreasuryDonationStatsEpoch,
  TreasuryDonationStatsResponse,
} from "@/types/treasuryTypes";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { findNearestTreasuryRate } from "@/utils/findNearestTreasuryRate";
import {
  formatNumber,
  formatNumberWithSuffix,
} from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import type { UseQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { useRef } from "react";

interface Props {
  query: UseQueryResult<TreasuryDonationStatsResponse["data"]>;
}

export const TreasuryDonationEpochsTab = ({ query }: Props) => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const { currency } = useCurrencyStore();
  const epochs = query.data?.epoch;
  const totalAdaDonations = epochs?.map(item => item.treasury_donation);
  const totalCurrencyDonations = epochs?.map(item => {
    const nearestAdaRate = findNearestTreasuryRate(epochs, item.epoch_no)[0];
    if (!nearestAdaRate) return 0;

    const usdPrice = (item.treasury_donation / 1e6) * nearestAdaRate.open;
    const czkPrice = usdPrice * item.rate.fiat.usd[0];
    return (
      czkPrice /
      item.rate.fiat[currency][0] /
      item.rate.fiat[currency][1]
    ).toFixed(2);
  });

  const {
    textColor,
    inactivePageIconColor,
    bgColor,
    splitLineColor,
    lineColor,
  } = useGraphColors();
  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: [
        "Total Donations (₳)",
        `Total Donations (${currency.toUpperCase()})`,
      ],
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: function (params) {
        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(
          endTime,
          "dd.MM.yy",
        )} (Epoch: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

        const rows = params.map(item => {
          const isAda = item.seriesName.includes("₳");

          const cleanName = item.seriesName
            .replace(" (₳)", "")
            .replace(/\(.+\)/, "")
            .trim();

          const value = isAda
            ? lovelaceToAda(item.data)
            : formatNumber(item.data);

          return `<p>${item.marker} ${cleanName}: ${value}</p>`;
        });

        return header + rows.join("");
      },
    },
    grid: {
      top: 40,
      right: 60,
      bottom: 40,
      left: 60,
    },
    xAxis: {
      type: "category",
      data: epochs?.map(item => item.epoch_no),
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
        name: "Total Donations (₳)",
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 45,
        id: "0",
        axisLabel: {
          color: textColor,
          formatter: (value: any) => {
            return formatNumberWithSuffix(value, true, 1);
          },
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
        show: true,
        name: `Total Donations (${currency.toUpperCase()})`,
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 45,
        axisLabel: {
          color: textColor,
          formatter: (value: any) => {
            return formatNumberWithSuffix(value, true, 1);
          },
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
        type: "bar",
        data: totalAdaDonations,
        name: "Total Donations (₳)",
        yAxisIndex: 0,
        itemStyle: {
          opacity: 0.7,
          color: "#e3033a",
        },
      },
      {
        type: "line",
        data: totalCurrencyDonations,
        name: `Total Donations (${currency.toUpperCase()})`,
        yAxisIndex: 1,
        itemStyle: {
          color: lineColor,
        },
        lineStyle: {
          color: lineColor,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.2,
          color: lineColor,
        },
      },
    ],
  };

  const columns: TableColumns<TreasuryDonationStatsEpoch> = [
    {
      key: "epoch_no",
      title: "Epoch",
      render: item => <p>{item.epoch_no}</p>,
      visible: true,
      widthPx: 25,
    },
    {
      key: "ada_donation",
      title: <p className='w-full text-right'>Total Donations (ADA)</p>,
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.treasury_donation} />
        </p>
      ),
      visible: true,
      widthPx: 95,
    },
    {
      key: "secondary_currency_donation",
      title: (
        <p className='w-full text-right'>
          Total Donations ({currency.toUpperCase()})
        </p>
      ),
      render: item => {
        const nearestAdaRate = findNearestTreasuryRate(
          epochs,
          item.epoch_no,
        )[0];
        if (!nearestAdaRate) return <p>-</p>;

        const usdPrice = (item.treasury_donation / 1e6) * nearestAdaRate.open;
        const czkPrice = usdPrice * item.rate.fiat.usd[0];
        const secondaryCurrencyPrice = (
          czkPrice /
          item.rate.fiat[currency][0] /
          item.rate.fiat[currency][1]
        ).toFixed(2);

        return (
          <p className='text-right'>{formatNumber(secondaryCurrencyPrice)}</p>
        );
      },
      visible: true,
      widthPx: 95,
    },
  ];

  return (
    <>
      <div className='relative mt-4 w-full'>
        <GraphWatermark />
        <ReactEcharts
          opts={{ height: 350 }}
          onChartReady={onChartReadyCallback}
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;

              localStorage.setItem(
                "script_detail_stats_graph_store",
                JSON.stringify(selected),
              );
            },
          }}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='mb-6 h-full min-h-[350px] w-full'
        />
      </div>
      <GlobalTable
        type='default'
        scrollable
        query={query}
        items={query.data?.epoch}
        columns={columns}
      />
    </>
  );
};
