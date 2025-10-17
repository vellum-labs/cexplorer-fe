import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import { useFetchPoolListDefault } from "@/services/pools";
import { useNavigate } from "@tanstack/react-router";

import { memo } from "react";

import { formatString } from "@/utils/format/format";
import { useGraphColors } from "@/hooks/useGraphColors";

interface NetworkBlockVersionsPoolGraphProps {
  sortedVersions: [string, number][] | [string, unknown][];
}

export const NetworkBlockVersionsPoolGraph: FC<NetworkBlockVersionsPoolGraphProps> =
  memo(function NetworkBlockVersionsPoolGraph({ sortedVersions }) {
    const { data } = useFetchPoolListDefault();
    const navigate = useNavigate();

    const poolData = data?.data.data;

    const { theme } = useThemeStore();
    const { bgColor, textColor } = useGraphColors();
    const { width } = useWindowDimensions();

    let squareSize = 60;
    let gapSize = 5;
    const rows = 5;
    const cols = 20;

    if (width < 1024) {
      squareSize = 45;
      gapSize = 4;
    }
    if (width < 800) {
      squareSize = 40;
      gapSize = 3;
    }
    if (width < 600) {
      squareSize = 30;
      gapSize = 2;
    }

    const option = {
      grid: {
        top: "5px",
        bottom: "5px",
        left: "0px",
        right: "0px",
        containLabel: false,
      },
      tooltip: {
        trigger: "item",
        backgroundColor: bgColor,
        confine: true,
        textStyle: { color: textColor },
        formatter: function (params) {
          const poolName =
            !params.data.ticker && !params.data.name
              ? null
              : `${params.data.ticker ? `[${params.data.ticker}]` : ""} ${params.data.name ?? ""}`;
          const version = params.data.lastBlockVersion;

          return `
            ${version ? `Last block version: ${version}<br>` : ""}
            ${poolName ? `Pool Name: ${poolName}<br>` : ""}
            Pool ID: ${formatString(params?.data?.id, "long")}
          `;
        },
      },
      xAxis: {
        type: "value",
        min: -squareSize / 2,
        max: (cols - 1) * (squareSize + gapSize) + squareSize / 2,
        show: false,
      },
      yAxis: {
        type: "value",
        min: -squareSize / 2,
        max: (rows - 1) * (squareSize + gapSize) + squareSize / 2,
        inverse: true,
        show: false,
      },
      series: [
        {
          type: "scatter",
          symbol: "rect",
          symbolSize: squareSize,
          data: generateBlockVersionData(
            rows,
            cols,
            poolData ?? [],
            (sortedVersions as [string, unknown][]).map(([k, v]) => [
              k,
              typeof v === "number" ? v : Number(v),
            ]) as [string, number][],
          ),
          itemStyle: {
            borderColor: theme === "dark" ? "#262d35" : "#fff",
            borderWidth: gapSize,
            opacity: 1,
          },
          emphasis: {
            itemStyle: {
              color: null,
            },
          },
        },
      ],
    };

    function generateBlockVersionData(
      rows: number,
      cols: number,
      poolData: any[],
      sortedVersions: [string, number][],
    ) {
      const data: any[] = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * (squareSize + gapSize);
          const y = i * (squareSize + gapSize);

          const pool = poolData[i * cols + j];
          if (!pool) continue;

          const poolId = pool.pool_id;
          const poolMeta = pool.pool_name;
          const ticker = poolMeta?.ticker ?? null;
          const name = poolMeta?.name ?? null;
          const lastBlockVersion = pool.last_block?.proto;

          let color = "#ff456c";
          if (lastBlockVersion == sortedVersions[0]?.[0]) {
            color = "#01ca86";
          } else if (lastBlockVersion == sortedVersions[1]?.[0]) {
            color = "#fdc53a";
          }

          data.push({
            value: [x, y],
            itemStyle: {
              color,
              opacity: 1,
            },
            id: poolId,
            name,
            ticker,
            lastBlockVersion,
          });
        }
      }
      return data;
    }

    return (
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          onEvents={{
            click: params => {
              navigate({
                to: "/pool/$id",
                params: {
                  id: params.data.id,
                },
                search: {},
              });
            },
          }}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    );
  });
