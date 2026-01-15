import type { MiscConstResponseData } from "@/types/miscTypes";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useEffect, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGraphColors } from "@/hooks/useGraphColors";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";

interface AccountWalletActivityGraphProps {
  data: EpochAnalyticsResponseData[];
  miscConst: MiscConstResponseData | undefined;
  setJson?: any;
}

export const AccountWalletActivityGraph: FC<
  AccountWalletActivityGraphProps
> = ({ data, miscConst, setJson }) => {
  const { t } = useAppTranslation("common");
  const [graphsVisibility, setGraphsVisibility] = useState({
    "Unique payment address": true,
    "Unique stake address": true,
    "New payment address": false,
    "New stake address": false,
  });

  const epochs = (data ?? []).map(item => item?.no);

  const countTxOutAddress = data.map(item => item.stat?.count_tx_out_address);
  const countTxOutStake = data.map(item => item.stat?.count_tx_out_stake);
  const countTxOutAddressNot = data.map(
    item => item.stat?.count_tx_out_address_not_yesterday,
  );
  const countTxOutStakeNot = data.map(
    item => item.stat?.count_tx_out_stake_not_yesterday,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: [
        "Unique payment address",
        "Unique stake address",
        "New payment address",
        "New stake address",
      ],
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
        const marker = dataPoint => dataPoint?.marker;

        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const nameFunc = {
          "Unique payment address": item =>
            item ? `${formatNumber(item?.data)}` : "Unique payment address",
          "Unique stake address": item =>
            item ? `${formatNumber(item?.data)}` : "Unique stake address",
          "New payment address": item =>
            item ? `${formatNumber(item?.data)}` : "New payment address",
          "New stake address": item =>
            item ? `${formatNumber(item?.data)}` : "New stake address",
        };

        return (
          `${t("labels.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("labels.epoch")}: ${params[0].axisValue})<hr>` +
          `<div>
        ${params
          .map(
            item =>
              `<p>${marker(item)} ${item?.seriesName}: ${nameFunc[item?.seriesName]?.(item)}</p>`,
          )
          .join("")}
      </div>`
        );
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: epochs,
      name: t("labels.epoch"),
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      inverse: true,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
    },
    yAxis: {
      type: "value",
      nameGap: 40,
      axisLabel: {
        color: textColor,
        formatter: "{value}",
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
        },
      },
    },
    series: [
      {
        type: "line",
        data: countTxOutAddress,
        name: "Unique payment address",
        yAxisIndex: 0,
        lineStyle: {
          color: "#FFB14E",
          width: 2,
        },
        showSymbol: false,
        z: 2,
      },
      {
        type: "line",
        data: countTxOutStake,
        name: "Unique stake address",
        yAxisIndex: 0,
        lineStyle: {
          color: "#0094D4",
          width: 2,
        },
        showSymbol: false,
        z: 1,
      },
      {
        type: "line",
        data: countTxOutAddressNot,
        name: "New payment address",
        yAxisIndex: 0,
        lineStyle: {
          color: "#FA8775",
          type: "dashed",
          width: 2,
        },
        showSymbol: false,
        z: 1,
      },
      {
        type: "line",
        data: countTxOutStakeNot,
        name: "New stake address",
        yAxisIndex: 0,
        lineStyle: {
          color: "#CD34B5",
          type: "dashed",
          width: 2,
        },
        showSymbol: false,
        z: 1,
      },
    ],
  };

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("account_wallet_activity_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "account_wallet_activity_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  useEffect(() => {
    if (setJson) {
      setJson(
        epochs.map((epoch, index) => {
          return {
            Epoch: epoch,
            "Unique payment address": countTxOutAddress[index],
            "Unique stake address": countTxOutStake[index],
            "New payment address": countTxOutAddressNot[index],
            "New stake address": countTxOutStakeNot[index],
          };
        }),
      );
    }
  }, [setJson]);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        option={option}
        onEvents={{
          legendselectchanged: params => {
            const { selected } = params;

            localStorage.setItem(
              "account_wallet_activity_graph_store",
              JSON.stringify(selected),
            );
          },
        }}
        notMerge={true}
        lazyUpdate={true}
        className='h-full w-full'
      />
    </div>
  );
};
