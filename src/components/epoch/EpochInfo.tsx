import type { EpochListData } from "@/types/epochTypes";
import type { FC } from "react";

import { useEffect, useState } from "react";

import { formatDate, toUtcDate } from "@/utils/format/format";
import { formatRemainingTime } from "@/utils/format/formatRemainingTime";
import PulseDot from "../global/PulseDot";
import { configJSON } from "@/constants/conf";

interface EpochInfoProps {
  number: number;
  data: EpochListData[];
}

export const EpochInfo: FC<EpochInfoProps> = ({ number, data }) => {
  const startDate = new Date(toUtcDate(data[0]?.start_time)).getTime();

  const { epochLength } = configJSON.genesisParams[0].shelley[0];

  const endTime = new Date(startDate + epochLength * 1000).getTime();

  const durationInSeconds = (endTime - startDate) / 1000;
  const [timeLeft, setTimeLeft] = useState(
    Math.round((endTime - new Date().getTime()) / 1000),
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const elapsedPercentage =
    ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  return (
    <div className='min-h-1/2 flex w-full flex-col gap-4 rounded-lg border border-border px-3 py-1.5'>
      <div className='relative flex h-[24px] w-[115px] items-center justify-end rounded-lg border border-border px-[10px]'>
        <div className='absolute left-2'>
          <PulseDot />
        </div>
        <span className='text-xs font-medium'>Current Epoch</span>
      </div>
      <span className='text-4xl font-semibold'>{number}</span>
      <div className='flex flex-col'>
        <div className='flex items-center gap-3'>
          <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
            <span
              className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
              style={{
                width: `${elapsedPercentage ? (elapsedPercentage > 100 ? 100 : elapsedPercentage) : 0}%`,
              }}
            ></span>
          </div>
          <span className='text-sm font-medium text-grayTextPrimary'>
            {!isNaN(elapsedPercentage)
              ? elapsedPercentage > 100
                ? 100
                : elapsedPercentage.toFixed(2)
              : "?"}
            %
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-grayTextPrimary'>
            {formatDate(data[0]?.start_time ? data[0]?.start_time : undefined)}
          </span>
          <span className='text-xs text-grayTextPrimary'>
            {formatRemainingTime(timeLeft)}
          </span>
        </div>
        <div className='flex items-center justify-between text-[#98A2B3]'>
          <span className='text-xs'>Start</span>
          <span className='text-xs'>
            {formatRemainingTime(timeLeft) ? "Left" : "Arrived"}
          </span>
        </div>
      </div>
    </div>
  );
};
