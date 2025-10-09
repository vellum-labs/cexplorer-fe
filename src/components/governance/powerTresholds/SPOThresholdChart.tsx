import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { formatNumberWithSuffix } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";

interface SPOThresholdChartProps {
  chartProps: {
    epochParam: any;
    visibility: boolean;
    params: null | string;
    isSecuryTitle: boolean;
    poolList: any;
    totalSpoStake?: number;
  };
}

export const SPOThresholdChart: FC<SPOThresholdChartProps> = ({
  chartProps,
}) => {
  const {
    epochParam,
    visibility,
    params,
    isSecuryTitle,
    poolList,
    totalSpoStake,
  } = chartProps;

  const { textColor, bgColor } = useGraphColors();

  const threshold = params ? epochParam[params] : 0;

  const pools = poolList?.data ?? [];
  const totalStake =
    totalSpoStake ??
    pools.reduce(
      (sum: any, pool: any) => sum + Number(pool.live_stake ?? 0),
      0,
    );
  const requiredStake =
    visibility && totalStake > 0 ? totalStake * threshold : 0;

  const sortedPools = [...pools].sort(
    (a, b) => Number(b.live_stake ?? 0) - Number(a.live_stake ?? 0),
  );

  let accumulated = 0;
  let count = 0;
  const requiredPools: typeof pools = [];

  for (const pool of sortedPools) {
    if (accumulated >= requiredStake) break;
    accumulated += Number(pool.live_stake ?? 0);
    count++;
    requiredPools.push(pool);
  }

  const getRequiredColor = () => {
    if (!visibility) return "#E4E7EC";
    return isSecuryTitle ? "#F79009" : "#f43f5e";
  };

  const getOtherColor = () => {
    if (!visibility) return "#E4E7EC";
    return isSecuryTitle ? "#FEC84B" : "#22c55e";
  };

  const chartData = visibility
    ? [
        ...requiredPools.map((pool, index) => ({
          value: Number(pool.live_stake ?? 0),
          name:
            pool.pool_name?.ticker ||
            pool.pool_name?.name ||
            (typeof pool.pool_id === "string"
              ? pool.pool_id.slice(0, 8) + "..."
              : null) ||
            `Pool ${index + 1}`,
          itemStyle: {
            color: getRequiredColor(),
            borderColor: "#ffffff",
            borderWidth: 0.1,
          },
          poolData: pool,
          isRequired: true,
        })),
        {
          value: totalStake - accumulated,
          name: "Other SPOs",
          itemStyle: {
            color: getOtherColor(),
            borderColor: "#ffffff",
            borderWidth: 0.1,
          },
          isOther: true,
        },
      ]
    : [
        {
          value: 1,
          name: "Not applicable",
          itemStyle: { color: "#E4E7EC" },
        },
      ];

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: (params: any) => {
        if (!visibility) {
          return "SPOs do not vote on this action";
        }

        if (params.data.isOther) {
          const stakeInAda = formatNumberWithSuffix(params.data.value / 1e6);
          return `Other SPOs<br/>Stake: ${stakeInAda} ADA<br/>Not needed for threshold`;
        }

        if (params.data.poolData) {
          const pool = params.data.poolData;
          const stakeInAda = formatNumberWithSuffix(
            Number(pool.live_stake ?? 0) / 1e6,
          );
          const imageUrl = generateImageUrl(pool.pool_id ?? "", "sm", "pool");

          return `
            <div>
              <div style="display: flex; align-items: center; gap: 6px; font-weight: 600; margin-bottom: 4px;">
                <img src="${imageUrl}" alt="Pool" style="width: 16px; height: 16px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'"/>
                ${params.data.name}
              </div>
              <div>Live Stake: ${stakeInAda} ADA</div>
              <div>Delegators: ${pool.delegators ?? "N/A"}</div>
            </div>
          `;
        }

        const stakeInAda = formatNumberWithSuffix(params.data.value / 1e6);
        return `${params.data.name}<br/>Stake: ${stakeInAda} ADA`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        emphasis: visibility
          ? {}
          : {
              disabled: true,
            },
        label: {
          show: true,
          position: "center",
          formatter: visibility ? `${count}` : "N/A",
          fontSize: 22,
          fontWeight: 600,
          color: textColor,
        },
        data: chartData,
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-1'>
        <p className='mb-1 font-medium'>SPOs</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              {params === "pvtpp_security_group"
                ? "Theoretical minimum number of SPOs with enough stake to pass this proposal. SPOs only vote if the parameter is a security parameter."
                : "Theoretical number of SPOs with enough stake to pass this proposal."}
            </p>
          }
        >
          <CircleHelp
            size={15}
            className='-translate-y-[4.5px] cursor-pointer text-grayTextPrimary'
          />
        </Tooltip>
      </div>
      <div className='h-[260px] w-full max-w-[260px]'>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <p className='text-text-sm text-text'>
        Threshold:{" "}
        {visibility
          ? `${((threshold || 0) * 100).toFixed(0)}%`
          : "Not applicable"}
      </p>
    </div>
  );
};
