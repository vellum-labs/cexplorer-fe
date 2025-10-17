import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useFetchTVL } from "@/services/global";
import { useFetchMiscBasic } from "@/services/misc";
import { useCallback, useMemo, useRef } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { ArrowRight, CircleDollarSign } from "lucide-react";

export const ScriptListTVLTab: FC = () => {
  const { data: miscBasic } = useFetchMiscBasic();
  const usdRate = miscBasic?.data.rate.ada[0].close ?? 0;
  const { data, isLoading } = useFetchTVL();
  const { textColor, splitLineColor, bgColor } = useGraphColors();

  const graphData = useMemo(() => {
    return (data || []).map(item => {
      const date = new Date(item.date * 1000).toLocaleDateString();
      const valueUSD = parseFloat(item.totalLiquidityUSD.toFixed(2));
      const valueADA = parseFloat(
        (item.totalLiquidityUSD / usdRate).toFixed(2),
      );
      return { date, valueUSD, valueADA };
    });
  }, [data, usdRate]);

  const chartRef = useRef(null);
  const onChartReadyCallback = useCallback(chart => {
    chartRef.current = chart;
  }, []);

  const option = useMemo(
    () => ({
      xAxis: {
        axisLabel: { color: textColor },
        type: "category",
        data: graphData.map(item => item.date),
      },
      yAxis: {
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        backgroundColor: bgColor,
        textStyle: { color: textColor },
        formatter: params => {
          const dataIndex = params[0].dataIndex;
          const item = graphData[dataIndex];
          return (
            `<div style="font-weight: 400">` +
            `Date: ${item.date}<br/>` +
            `USD: $${formatNumber(item.valueUSD)}<br/>` +
            `ADA Equivalent: ${item.valueADA ? lovelaceToAda(item.valueADA * 1e6) : "-"}` +
            `</div>`
          );
        },
      },
      series: [
        {
          data: graphData.map(item => item.valueUSD),
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { color: "#e3033a" },
          areaStyle: { color: "#e3033a" },
          itemStyle: { color: "#e3033a" },
        },
      ],
    }),
    [graphData, textColor, splitLineColor, bgColor],
  );

  const totalValueUSD = useMemo(() => {
    return graphData.reduce((acc, item) => acc + item.valueUSD * 1e6, 0);
  }, [graphData]);

  const totalValueADA = useMemo(() => {
    return graphData.reduce((acc, item) => acc + item.valueADA * 1e6, 0);
  }, [graphData]);

  return (
    <div className='flex flex-wrap gap-1.5 lg:flex-nowrap'>
      {isLoading ? (
        <>
          <LoadingSkeleton width='350px' height='400px' rounded='lg' />
          <LoadingSkeleton width='100%' height='400px' rounded='lg' />
        </>
      ) : (
        <>
          <div className='flex min-w-[350px] flex-grow flex-col gap-1.5 rounded-m border border-border p-1.5 lg:max-w-[350px] lg:flex-grow-0'>
            <div className='flex h-fit w-full items-center gap-2'>
              <div className='flex aspect-square h-[32px] w-[32px] items-center justify-center rounded-s border border-border'>
                <CircleDollarSign className='text-primary' size={15} />
              </div>
              <span className='text-text-sm text-grayTextPrimary'>
                <span className='text-text-md font-semibold'>TVL</span> (total
                value locked)
              </span>
            </div>
            <div className='flex w-full items-center gap-2'>
              <span className='text-display-xs font-semibold'>
                $ {lovelaceToAda(totalValueUSD).substring(1)}
              </span>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                <AdaWithTooltip data={totalValueADA} />
              </span>
            </div>
            <p className='text-text-xs text-grayTextPrimary'>
              In the context of decentralized finance (DeFi), it represents the
              total amount of cryptocurrency assets that are currently staked or
              deposited in a particular protocol or smart contract.
            </p>
            <div className='flex h-full items-end justify-end'>
              <a
                href='https://defillama.com/chain/Cardano'
                className='flex cursor-pointer items-center gap-1/2'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span className='text-text-xs font-semibold text-primary'>
                  Detailed Cardano TVL on DefiLama
                </span>
                <ArrowRight size={13} className='font-semibold text-primary' />
              </a>
            </div>
          </div>
          <div className='relative w-full rounded-m border border-border'>
            <GraphWatermark />
            <ReactEcharts
              opts={{ height: 400 }}
              onChartReady={onChartReadyCallback}
              option={option}
              notMerge={true}
              lazyUpdate={true}
              className='h-full min-h-[400px] w-full'
            />
          </div>
        </>
      )}
    </div>
  );
};
