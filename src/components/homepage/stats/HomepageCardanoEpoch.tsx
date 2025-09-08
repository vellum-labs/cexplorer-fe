import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import { formatDate, formatNumber } from "@/utils/format/format";
import { formatRemainingTime } from "@/utils/format/formatRemainingTime";
import { useFetchMiscBasic } from "@/services/misc";
import { Tooltip } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

import { useState, useEffect } from "react";

interface HomepageCardanoEpochProps {
  miscConst: MiscConstResponseData | undefined;
}

export const HomepageCardanoEpoch: FC<HomepageCardanoEpochProps> = ({
  miscConst,
}) => {
  const pools = miscConst?.epoch_stat?.stake?.pools?.registered;
  const slot = miscConst?.epoch_stat?.pots?.slot_no;
  const { data: basicData } = useFetchMiscBasic();

  const constDataLoad = basicData?.data?.loads?.["24h"] ?? 0;
  const load7d = basicData?.data?.loads?.["7d"] ?? 0;
  const load1h = basicData?.data?.loads?.["1h"] ?? 0;

  const blockUsage = isNaN(constDataLoad) ? 0 : constDataLoad * 100;

  const startDate = new Date(
    miscConst?.epoch?.start_time ? miscConst?.epoch?.start_time : 0,
  ).getTime();
  const endTime = startDate + 432000000;

  const durationInSeconds = (endTime - startDate) / 1000;
  const [timeLeft, setTimeLeft] = useState(
    Math.round((endTime - Date.now()) / 1000),
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(Math.round((endTime - Date.now()) / 1000));
  }, [endTime]);

  const elapsedPercentage =
    ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  console.log("miscConst?.epoch?.start_time", miscConst?.epoch?.start_time);

  return (
    <div className='mx-3 min-h-[110px]'>
      <div className='flex items-center gap-2 pb-1'>
        <div className='flex w-full flex-col'>
          <div className='flex items-center gap-3'>
            <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
              <span
                className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                style={{
                  width: `${elapsedPercentage ? (elapsedPercentage > 100 ? 100 : elapsedPercentage) : 0}%`,
                }}
              ></span>
            </div>
            <span className='text-grayText text-sm font-medium'>
              {!isNaN(elapsedPercentage)
                ? elapsedPercentage > 100
                  ? 100
                  : elapsedPercentage.toFixed(2)
                : "?"}
              %
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-grayText text-xs'>
              {miscConst?.epoch?.start_time
                ? formatDate(miscConst?.epoch?.start_time)
                : ""}
            </span>
            {timeLeft > 0 && (
              <span className='text-grayText text-xs'>
                {formatRemainingTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='text-grayText inline-block text-sm font-medium'>
            Slots
          </span>
        </div>
        <span className='text-grayText text-sm font-semibold'>
          {formatNumber(slot)}
        </span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='text-grayText inline-block text-sm font-medium'>
            Pools
          </span>
        </div>
        <span className='text-grayText text-sm font-semibold'>
          {formatNumber(pools)}
        </span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='text-grayText inline-block text-sm font-medium'>
            Daily usage
          </span>
        </div>
        <Tooltip
          content={
            <div className='space-y-1'>
              <div className='flex justify-between gap-4'>
                <span>1h usage:</span>
                <span className='font-semibold'>
                  {(load1h * 100).toFixed(2)}%
                </span>
              </div>
              <div className='flex justify-between gap-4'>
                <span>24h usage:</span>
                <span className='font-semibold'>{blockUsage.toFixed(2)}%</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span>7d usage:</span>
                <span className='font-semibold'>
                  {(load7d * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          }
        >
          <div className='flex cursor-help items-center gap-1'>
            <span className='text-grayText text-sm font-semibold'>
              {blockUsage.toFixed(2)}%
            </span>
            <Info size={14} className='text-grayText opacity-50' />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
