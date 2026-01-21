import type { FC } from "react";
import type { BlockDetailResponseDataTxsItem } from "@/types/blockTypes";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useCallback, useMemo, useRef, useState } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useNavigate } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useADADisplay } from "@/hooks/useADADisplay";
import SortBy from "@/components/ui/sortBy";
interface BlockBarChartProps {
  txs: BlockDetailResponseDataTxsItem[];
  className?: string;
}

type MetricType = "out_sum" | "fee" | "size";

const truncateHash = (hash: string): string => {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
};

export const BlockBarChart: FC<BlockBarChartProps> = ({ txs, className }) => {
  const { t } = useAppTranslation("common");
  const { textColor, bgColor, splitLineColor } = useGraphColors();
  const { formatLovelace } = useADADisplay();
  const navigate = useNavigate();
  const chartRef = useRef<ReactEcharts>(null);
  const [metric, setMetric] = useState<MetricType>("out_sum");

  const selectItems = [
    { key: "out_sum", value: t("blocks.totalOutput") },
    { key: "fee", value: t("blocks.fee") },
    { key: "size", value: t("blocks.size") },
  ];

  const chartData = useMemo(() => {
    const sorted = [...txs].sort((a, b) => {
      if (metric === "out_sum") return a.out_sum - b.out_sum;
      if (metric === "fee") return a.fee - b.fee;
      return a.size - b.size;
    });

    return sorted.map(tx => ({
      hash: String(tx.hash),
      out_sum: Number(tx.out_sum),
      fee: Number(tx.fee),
      size: Number(tx.size),
    }));
  }, [txs, metric]);

  const handleChartClick = useCallback(
    (params: any) => {
      // Handle bar click
      if (params.data?.hash) {
        navigate({ to: "/tx/$hash", params: { hash: params.data.hash } });
        return;
      }
      // Handle Y-axis label click
      if (params.componentType === "yAxis" && params.dataIndex !== undefined) {
        const hash = chartData[params.dataIndex]?.hash;
        if (hash) {
          navigate({ to: "/tx/$hash", params: { hash } });
        }
      }
    },
    [navigate, chartData],
  );

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: bgColor,
        borderColor: splitLineColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          const data = params[0]?.data;
          if (!data) return "";

          return [
            `<div style="font-weight: 600; margin-bottom: 6px;">${t("blocks.transactionHash")}</div>`,
            `<div style="margin-bottom: 4px;">${truncateHash(data.hash)}</div>`,
            `<div style="display:flex; justify-content:space-between; gap:12px;">` +
              `<span>${t("blocks.totalOutput")}:</span><span style="font-weight:600;">${formatLovelace(data.out_sum)}</span>` +
              `</div>`,
            `<div style="display:flex; justify-content:space-between; gap:12px;">` +
              `<span>${t("blocks.fee")}:</span><span style="font-weight:600;">${formatLovelace(data.fee)}</span>` +
              `</div>`,
            `<div style="display:flex; justify-content:space-between; gap:12px;">` +
              `<span>${t("blocks.size")}:</span><span style="font-weight:600;">${(data.size / 1024).toFixed(2)} kB</span>` +
              `</div>`,
          ].join("");
        },
      },
      grid: {
        left: 150,
        right: 40,
        top: 20,
        bottom: 40,
      },
      xAxis: {
        type: "value",
        axisLabel: {
          color: textColor,
          formatter: (value: number) => {
            if (metric === "size") {
              return `${(value / 1024).toFixed(2)} kB`;
            }
            return formatLovelace(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      yAxis: {
        type: "category",
        data: chartData.map(tx => truncateHash(tx.hash)),
        triggerEvent: true,
        axisLabel: {
          color: textColor,
          fontSize: 14,
        },
        axisLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      series: [
        {
          type: "bar",
          data: chartData.map(tx => ({
            value: tx[metric],
            hash: tx.hash,
            out_sum: tx.out_sum,
            fee: tx.fee,
            size: tx.size,
          })),
          itemStyle: {
            color: "#3B82F6",
            borderRadius: [0, 4, 4, 0],
          },
          emphasis: {
            itemStyle: {
              color: "#60A5FA",
            },
          },
          barMaxWidth: 30,
          barMinHeight: 5,
        },
      ],
    }),
    [bgColor, chartData, formatLovelace, metric, splitLineColor, t, textColor],
  );

  if (txs.length === 0) {
    return (
      <div
        className={`relative flex h-[400px] items-center justify-center ${className ?? ""}`}
      >
        <span className='text-grayTextSecondary'>
          {t("tx.overview.noData")}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <SortBy
        selectItems={selectItems}
        setSelectedItem={setMetric as any}
        selectedItem={metric}
        className='mb-2 ml-auto w-fit'
      />
      <div className='relative h-[400px] w-full rounded-l border border-border md:h-[600px]'>
        <GraphWatermark className='opacity-10' />
        <ReactEcharts
          ref={chartRef}
          option={option}
          style={{ height: "100%", width: "100%", cursor: "pointer" }}
          notMerge={true}
          lazyUpdate={true}
          onEvents={{ click: handleChartClick }}
        />
      </div>
    </div>
  );
};
