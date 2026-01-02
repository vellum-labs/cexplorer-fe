import { EPOCH_LENGTH_DAYS } from "@/constants/confVariables";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useMiscRate } from "@/hooks/useMiscRate";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useFetchMiscBasic } from "@/services/misc";
import type { RewardItem } from "@/types/accountTypes";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";

interface RewardsGraphProps {
  data: RewardItem[] | undefined;
}

export const RewardsGraph = ({ data }: RewardsGraphProps) => {
  const { splitLineColor, textColor, bgColor } = useGraphColors();
  const { data: miscBasic } = useFetchMiscBasic(true);
  const rates = useMiscRate(miscBasic?.data.version.rate);
  const miscConst = useMiscConst(miscBasic?.data.version.const);
  const { formatLovelace } = useADADisplay();

  const [graphsVisibility, setGraphsVisibility] = useState({
    "Rewards (₳)": true,
    "Rewards ($)": true,
    "ROA (%)": true,
    "Active Stake (₳)": true,
  });
  const amount = data?.map(item => item.amount / 1_000_000).reverse() || [];
  const stake = data?.map(item => item.account.epoch_stake).reverse() || [];

  const usdAmount =
    data
      ?.map(item => {
        const usdRate = rates?.find(rate => rate.adausd);
        if (usdRate?.adausd) {
          return (item.amount / 1_000_000) * usdRate.adausd;
        }
        return undefined;
      })
      .reverse() || [];

  const epochs = data?.map(item => item.earned_epoch).reverse() || [];
  const roa =
    data
      ?.map(item => {
        return (
          ((item.amount * 365.25) /
            EPOCH_LENGTH_DAYS /
            item.account.epoch_stake) *
          100
        ).toFixed(2);
      })
      .reverse() || [];

  const option = {
    legend: {
      data: ["Rewards (₳)", "Rewards ($)", "ROA (%)", "Active Stake (₳)"],
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
      textStyle: { color: textColor },
      confine: true,
      formatter: function (params) {
        if (!params || params.length === 0) return "";

        const marker = p => p?.marker || "";
        const epoch = +params[0]?.axisValue;

        const { startTime, endTime } = calculateEpochTimeByNumber(
          epoch,
          miscConst?.epoch?.no ?? 0,
          miscConst?.epoch?.start_time ?? "",
        );

        return (
          `Date: ${format(startTime, "dd.MM.yy")} – ${format(endTime, "dd.MM.yy")} (Epoch: ${epoch})<hr>` +
          `<div>` +
          params
            .map(item => {
              let formattedValue;
              if (item.data == null || isNaN(Number(item.data))) {
                formattedValue = "—";
              } else if (item.seriesName.includes("Rewards (₳)")) {
                formattedValue = formatLovelace(Number(item.data) * 1e6);
                return `<p style="margin:2px 0;">${marker(item)} Rewards: ${formattedValue}</p>`;
              } else if (item.seriesName.includes("Rewards ($)")) {
                formattedValue = Number(item.data).toFixed(2);
                return `<p style="margin:2px 0;">${marker(item)} Rewards: $ ${formattedValue}</p>`;
              } else if (item.seriesName.includes("ROA (%)")) {
                formattedValue = Number(item.data).toFixed(2);
                return `<p style="margin:2px 0;">${marker(item)} ROA: ${formattedValue}%</p>`;
              } else if (item.seriesName.includes("Active Stake (₳)")) {
                formattedValue = formatLovelace(Number(item.data));
                return `<p style="margin:2px 0;">${marker(item)} Stake: ${formattedValue}</p>`;
              } else {
                formattedValue = item.data;
                return `<p style="margin:2px 0;">${marker(item)} ${item.seriesName}: ${formattedValue}</p>`;
              }
            })
            .join("") +
          `</div>`
        );
      },
    },

    grid: {
      left: 50,
      right: 50,
    },
    xAxis: {
      type: "category",
      data: epochs,
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
        id: "ada",
        name: "",
        nameLocation: "middle",
        nameGap: 55,
        axisLabel: {
          color: textColor,
          formatter: value => {
            return `₳ ${formatNumberWithSuffix(value, true)}`;
          },
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      {
        type: "value",
        id: "usd",
        name: "",
        position: "right",
        nameGap: 35,
        axisLabel: {
          color: textColor,
          formatter: value => {
            return `$ ${formatNumberWithSuffix(value, true)}`;
          },
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      {
        show: false,
        type: "value",
        id: "roa",
        name: "ROA (%)",
        axisLabel: {
          formatter: value => {
            return `${value}%`;
          },
        },
      },
      {
        type: "value",
        id: "stake",
        name: "",
        position: "right",
        offset: 70,
        nameGap: 35,
        axisLabel: {
          color: textColor,
          formatter: value => `₳ ${formatNumberWithSuffix(value, true)}`,
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
    ],
    series: [
      {
        data: amount,
        type: "bar",
        name: "Rewards (₳)",
        yAxisIndex: 0,
        itemStyle: {
          color: "#e3033a",
        },
      },
      {
        data: usdAmount,
        name: "Rewards ($)",
        type: "line",
        yAxisIndex: 1,
        itemStyle: {
          color: "#ffc115",
        },
        showSymbol: false,
      },
      {
        data: roa,
        type: "line",
        name: "ROA (%)",
        yAxisIndex: 2,
        areaStyle: {
          color: "#21fc1e",
          opacity: 0.2,
        },
        showSymbol: false,
        itemStyle: {
          color: "#21fc1e",
        },
      },
      {
        data: stake,
        type: "line",
        name: "Active Stake (₳)",
        yAxisIndex: 3,
        itemStyle: {
          color: "#3b82f6",
        },
        showSymbol: false,
      },
    ],
  };

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("account_rewards_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "account_rewards_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <div className='flex flex-col'>
      <h2 className='mb-1'>Rewards</h2>
      <ReactEcharts
        onEvents={{
          legendselectchanged: params => {
            const { selected } = params;

            localStorage.setItem(
              "account_rewards_graph_store",
              JSON.stringify(selected),
            );
          },
        }}
        option={option}
      />
    </div>
  );
};
