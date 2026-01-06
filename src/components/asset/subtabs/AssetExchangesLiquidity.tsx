import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { dexConfig } from "@/constants/dexConfig";

import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { PriceAdaSmallAmount } from "@vellumlabs/cexplorer-sdk";

interface AssetExchangesLiquidityProps {
  query: ReturnType<typeof useFetchAssetDetail>;
}

export const AssetExchangesLiquidity: FC<AssetExchangesLiquidityProps> = ({
  query,
}) => {
  const { formatADA } = useADADisplay();
  const { textColor, bgColor } = useGraphColors();

  const ticker = query?.data?.data?.registry?.ticker || "Token";

  const items = [...(query?.data?.data?.dex?.ada_pools ?? [])].sort(
    (a, b) => (b.token_1_amount ?? 0) - (a.token_1_amount ?? 0),
  );

  const columns = [
    {
      key: "dex_name",
      render: item => {
        const dex = dexConfig[item.dex_name];
        const feePercent =
          item.pool_fee !== undefined ? (item.pool_fee * 100).toFixed(2) : null;
        const displayFee = feePercent?.replace(/\.?0+$/, "");

        return (
          <div className='flex items-center gap-1'>
            {dex?.icon && (
              <Image
                src={dex.icon}
                className='h-4 w-4 flex-shrink-0 rounded-max'
                alt={dex?.label || item.dex_name}
              />
            )}
            <span>{dex?.label || item.dex_name}</span>
            {displayFee && Number(displayFee) > 0 && (
              <Tooltip content={`Pool fee: ${displayFee}%`}>
                <Badge small color='gray' className='min-w-[40px] text-center'>
                  {displayFee}%
                </Badge>
              </Tooltip>
            )}
          </div>
        );
      },
      title: <p className='w-full text-left'>DEX</p>,
      visible: true,
      widthPx: 160,
    },
    {
      key: "price",
      render: item => {
        if (!item?.token_1_amount || !item?.token_2_amount) {
          return <p className='w-full text-right'>-</p>;
        }
        const price = (item.token_1_amount / item.token_2_amount) * 1_000_000;
        return (
          <div className='flex w-full justify-end'>
            <PriceAdaSmallAmount price={price} />
          </div>
        );
      },
      title: <p className='w-full text-right'>Price</p>,
      visible: true,
      widthPx: 120,
    },
    {
      key: "ada_pooled",
      render: item => {
        if (!item?.token_1_amount) {
          return <p className='w-full text-right'>-</p>;
        }
        const fullValue = formatNumber(item.token_1_amount);
        const compactValue = formatNumberWithSuffix(item.token_1_amount);

        return (
          <div className='flex w-full justify-end'>
            <Tooltip
              content={
                <div className='flex items-center gap-1'>
                  <span>₳ {fullValue}</span>
                  <Copy copyText={item.token_1_amount.toString()} size={12} />
                </div>
              }
            >
              <span>₳ {compactValue}</span>
            </Tooltip>
          </div>
        );
      },
      title: <p className='w-full text-right'>ADA Pooled</p>,
      visible: true,
      widthPx: 120,
    },
    {
      key: "token_pooled",
      render: item => {
        if (!item?.token_2_amount) {
          return <p className='w-full text-right'>-</p>;
        }
        const fullValue = formatNumber(item.token_2_amount);
        const compactValue = formatNumberWithSuffix(item.token_2_amount);

        return (
          <div className='flex w-full justify-end'>
            <Tooltip
              content={
                <div className='flex items-center gap-1'>
                  <span>{fullValue}</span>
                  <Copy copyText={item.token_2_amount.toString()} size={12} />
                </div>
              }
            >
              <span>{compactValue}</span>
            </Tooltip>
          </div>
        );
      },
      title: <p className='w-full text-right'>{ticker} Pooled</p>,
      visible: true,
      widthPx: 120,
    },
  ];

  const chartData = items.map(item => ({
    name: dexConfig[item.dex_name]?.label || item.dex_name,
    value: item.token_1_amount,
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
        const value = formatADA(params.value);
        return `${params.name}: ${value} (${params.percent}%)`;
      },
    },
    series: [
      {
        name: "ADA Liquidity",
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
    <div className='flex h-full w-full flex-col items-start gap-2 rounded-m border border-border p-1.5 lg:flex-row'>
      <div className='h-full w-full lg:min-w-[400px] lg:max-w-[500px]'>
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
