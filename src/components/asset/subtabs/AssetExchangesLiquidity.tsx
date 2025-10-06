import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import GlobalTable from "@/components/table/GlobalTable";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useGraphColors } from "@/hooks/useGraphColors";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { formatNumber } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

interface AssetExchangesLiquidityProps {
  query: ReturnType<typeof useFetchAssetDetail>;
}

export const AssetExchangesLiquidity: FC<AssetExchangesLiquidityProps> = ({
  query,
}) => {
  const { textColor, bgColor } = useGraphColors();

  const items = [...(query?.data?.data?.dex?.ada_pools ?? [])].sort(
    (a, b) => (b.token_2_amount ?? 0) - (a.token_2_amount ?? 0),
  );

  const columns = [
    {
      key: "dex_name",
      render: item => (item.dex_name ? <span>{item.dex_name}</span> : "-"),
      title: <p className='w-full text-left'>DEX</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "ada_amount",
      render: item =>
        item?.token_1_amount ? (
          <p className='w-full text-right'>
            <AdaWithTooltip data={item.token_1_amount} />
          </p>
        ) : (
          <p className='w-full text-right'>-</p>
        ),
      title: <p className='w-full text-right'>ADA amount</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "token_amount",
      render: item =>
        item?.token_2_amount ? (
          <p className='w-full text-right'>
            {formatNumber(item.token_2_amount)}
          </p>
        ) : (
          <p className='w-full text-right'>-</p>
        ),
      title: <p className='w-full text-right'>Token amount</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "liquidity",
      render: item =>
        item?.token_2_amount ? (
          <p className='w-full text-right'>
            <AdaWithTooltip data={item.token_2_amount} />
          </p>
        ) : (
          <p className='w-full text-right'>-</p>
        ),
      title: <p className='w-full text-right'>Liquidity</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  const chartData = items.map(item => ({
    name: item.dex_name,
    value: item.token_2_amount,
  }));

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: function (params) {
        const value = lovelaceToAda(params.value);
        return `${params.name}: ${value} (${params.percent}%)`;
      },
    },
    series: [
      {
        name: "Token liquidity",
        type: "pie",
        radius: "60%",
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          color: textColor,
        },
      },
    ],
  };

  return (
    <div className='flex h-full w-full items-start rounded-lg border border-border p-1.5'>
      <div className='h-full min-w-[500px]'>
        <div className='relative h-[300px] w-full'>
          <GraphWatermark />
          <ReactEcharts
            option={option}
            notMerge
            lazyUpdate
            className='h-[300px] w-full'
          />
        </div>
      </div>
      <GlobalTable
        type='default'
        totalItems={items.length}
        scrollable
        query={query}
        minContentWidth={500}
        items={items}
        columns={columns}
      />
    </div>
  );
};
