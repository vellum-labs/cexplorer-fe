import type { EpochParam, EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { OverviewCard } from "../global/cards/OverviewCard";
import { TotalSumWithRates } from "../global/TotalSumWithRates";

import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { formatBytes } from "@/utils/format/formatBytes";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";

interface EpochLostAndCostProps {
  params: EpochParam;
  stats: EpochStatsSummary;
  startTime: string;
}

export const EpochLostAndCost: FC<EpochLostAndCostProps> = ({
  params,
  stats,
}) => {
  const pricePer = parseFloat(params.price_mem) * 1024 * 1024;
  const avgTXSize = stats?.epoch?.out_sum / stats?.epoch?.tx_count / 1024;
  const sizeOfAllBlocksMB = (stats?.epoch?.block_size / (1024 * 1024)).toFixed(
    2,
  );
  const avgBlockSize = stats?.epoch?.block_size / stats?.epoch?.block_count;
  const curr = useGetMarketCurrency();

  const maxCapacity = params?.max_block_size * stats?.epoch?.block_count;
  const loadPercentage = (stats?.epoch?.block_size / maxCapacity) * 100;

  const pricePerSum = lovelaceToAdaWithRates(pricePer, curr);

  const overviewList = [
    {
      label: "Size of all blocks in epoch",
      value: <p className='text-text-sm font-medium'>{sizeOfAllBlocksMB} MB</p>,
    },
    {
      label: "Price per MB",
      value: <TotalSumWithRates sum={pricePerSum} ada={pricePer} />,
    },
    {
      label: "Average TX size",
      value: (
        <p className='text-text-sm font-medium'>{formatBytes(avgTXSize)}</p>
      ),
    },
    {
      label: "Average Block Size",
      value: (
        <p className='text-text-sm font-medium'>{formatBytes(avgBlockSize)}</p>
      ),
    },
    {
      label: "Max Block Size",
      value: (
        <p className='text-text-sm font-medium'>
          {formatBytes(params.max_block_size)}
        </p>
      ),
    },
    {
      label: "",
      value: (
        <div className='flex items-center gap-1.5'>
          <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
            <span
              className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
              style={{
                width: `${loadPercentage ? (loadPercentage > 100 ? 100 : loadPercentage) : 0}%`,
              }}
            ></span>
          </div>
          <span className='text-text-sm font-medium text-grayTextPrimary'>
            {!isNaN(loadPercentage)
              ? loadPercentage > 100
                ? 100
                : loadPercentage.toFixed(2)
              : "?"}
            %
          </span>
        </div>
      ),
    },
  ];

  return (
    <OverviewCard
      title='Load and Cost'
      overviewList={overviewList}
      labelClassname='md:text-nowrap h-full'
    />
  );
};
