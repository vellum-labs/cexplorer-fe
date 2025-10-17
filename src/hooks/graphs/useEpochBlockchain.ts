import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { findNearestRate } from "@/utils/findNearestRate";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useGraphColors } from "../useGraphColors";
import { useMiscConst } from "../useMiscConst";
import { useMiscRate } from "../useMiscRate";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

interface UseEpochBlockchain {
  option: ReactEChartsProps["option"];
  setGraphsVisibility: Dispatch<SetStateAction<any>>;
}

interface UseEpochBlockchainArgs {
  data: any[];
}

export const useEpochBlockchain = ({
  data,
}: UseEpochBlockchainArgs): UseEpochBlockchain => {
  const filteredData = data
    .filter(d => d?.no)
    .filter(
      d =>
        d.stats?.epoch?.block_count ||
        d?.out_sum ||
        d.stats?.stake?.active ||
        d?.tx_count ||
        d?.stats?.rewards?.leader ||
        d?.stats?.rewards?.member ||
        d?.params?.monetary_expand_rate,
    );

  const [graphsVisibility, setGraphsVisibility] = useState({
    Blocks: true,
    Outputs: true,
    "Stake (₳)": true,
    Transactions: true,
    "Staking Rewards (₳)": true,
    "APY (%)": true,
    "ADA Price ($)": true,
    "Yearly per 1000 ADA ($)": true,
  });
  const { data: miscBasic } = useFetchMiscBasic(true);
  const rates = useMiscRate(miscBasic?.data.version.rate);
  const miscConst = useMiscConst(miscBasic?.data.version.const);

  const { textColor, bgColor, splitLineColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = filteredData.map(d => d?.no || 0);
  const blocks = filteredData.map(d =>
    isNaN(d.stats?.epoch?.block_count)
      ? 0
      : (d?.stats?.epoch?.block_count ?? 0).toFixed(2),
  );
  const outputs = filteredData.map(d =>
    isNaN(d?.out_sum) ? 0 : d?.out_sum || 0,
  );
  const stakes = filteredData.map(d => d.stats?.stake?.active || 0);
  const transactions = filteredData.map(d => d?.tx_count || 0);
  const rewards = filteredData.map(d => {
    const leader = d?.stats?.rewards?.leader;
    const member = d?.stats?.rewards?.member;

    if (leader === null || member === null) {
      return null;
    }

    return (leader + member).toFixed(2);
  });
  const apy = filteredData.map((d, index) => {
    const pctMember = d?.stats?.pool_stat?.pct_member;

    if (pctMember === null || (index < 2 && pctMember === 0)) {
      return null;
    }

    return (pctMember ?? 0).toFixed(2);
  });
  const adaPrice = filteredData.map(
    d => findNearestRate(d?.start_time || "", rates)?.adausd?.toFixed(2) ?? 0,
  );
  const yearlyPerAda = filteredData.map((d, index) => {
    const leader = d?.stats?.rewards?.leader;
    const member = d?.stats?.rewards?.member;
    const activeStake = d?.stats?.stake?.active;
    const price = +adaPrice[index];

    if (leader === null || member === null || !activeStake || !price) {
      return null;
    }

    const totalRewards = leader + member;
    const totalRewardsAda = totalRewards / 1000000;
    const activeStakeAda = activeStake / 1000000;
    const rewardsPerAda = totalRewardsAda / activeStakeAda;
    const yearlyRewardsPerAda = rewardsPerAda * 73;
    const yearlyPer1000Ada = yearlyRewardsPerAda * 1000;
    const usdValue = yearlyPer1000Ada * price;

    return usdValue.toFixed(2);
  });

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("epoch_blockchain_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "epoch_blockchain_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: [
        "Blocks",
        "Outputs (₳)",
        "Stake (₳)",
        "Transactions",
        "Staking Rewards (₳)",
        "APY (%)",
        "ADA Price ($)",
        "Yearly per 1000 ADA ($)",
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
        const name = dataPoint => {
          if (dataPoint.seriesName === "Stake (₳)") return "Stake";
          if (dataPoint.seriesName === "Staking Rewards (₳)")
            return "Staking Rewards";
          if (dataPoint.seriesName === "Outputs (₳)") return "Outputs";
          return dataPoint?.seriesName;
        };

        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        let tooltipContent = `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0].axisValue})<hr>`;

        params.forEach(param => {
          const seriesName = param.seriesName;
          let value = param.data;

          if (value === null) {
            value = "TBD";
          } else if (
            seriesName === "Outputs (₳)" ||
            seriesName === "Stake (₳)" ||
            seriesName === "Staking Rewards (₳)"
          ) {
            value = lovelaceToAda(Number(value));
          } else {
            value = formatNumber(Number(value));
          }

          tooltipContent += `<p>${marker(param)} ${name(param)}: ${value}</p>`;
        });

        return tooltipContent;
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 20,
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
      {
        type: "value",
        position: "right",
        id: "6",
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
        id: "7",
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
        data: blocks,
        name: "Blocks",
        yAxisIndex: 0,
        showSymbol: false,
        itemStyle: {
          color: "#35c2f5",
        },
        z: 2,
      },
      {
        type: "line",
        data: outputs,
        name: "Outputs (₳)",
        showSymbol: false,
        yAxisIndex: 1,
        itemStyle: {
          color: "#f54242",
        },
        z: 1,
      },
      {
        type: "line",
        data: stakes,
        name: "Stake (₳)",
        showSymbol: false,
        yAxisIndex: 2,
        itemStyle: {
          color: "#f5a742",
        },
        z: 3,
      },
      {
        type: "line",
        data: transactions,
        name: "Transactions",
        showSymbol: false,
        yAxisIndex: 3,
        itemStyle: {
          color: "#42f554",
        },
        z: 4,
      },
      {
        type: "line",
        data: rewards,
        name: "Staking Rewards (₳)",
        showSymbol: false,
        yAxisIndex: 4,
        connectNulls: false,
        itemStyle: {
          color: "#f542d4",
        },
        z: 5,
      },
      {
        type: "line",
        data: apy,
        name: "APY (%)",
        yAxisIndex: 5,
        showSymbol: false,
        connectNulls: false,
        areaStyle: {
          opacity: 0.12,
        },
        itemStyle: {
          color: "#6366F1",
        },
        z: 6,
      },
      {
        type: "line",
        data: adaPrice,
        name: "ADA Price ($)",
        showSymbol: false,
        yAxisIndex: 6,
        areaStyle: {
          opacity: 0.12,
        },
        itemStyle: {
          color: "#20B2AA",
        },
        z: 7,
      },
      {
        type: "line",
        data: yearlyPerAda,
        name: "Yearly per 1000 ADA ($)",
        showSymbol: false,
        yAxisIndex: 7,
        connectNulls: false,
        areaStyle: {
          opacity: 0.12,
        },
        itemStyle: {
          color: "#1627e8",
        },
        z: 8,
      },
    ],
  };

  return {
    option,
    setGraphsVisibility,
  };
};
