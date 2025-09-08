import type { FC } from "react";

import { OverviewCard } from "../global/cards/OverviewCard";
import PulseDot from "../global/PulseDot";
import { TimeDateIndicator } from "../global/TimeDateIndicator";

import { useEffect, useState } from "react";

import { formatNumber, toUtcDate } from "@/utils/format/format";
import { AdaWithTooltip } from "../global/AdaWithTooltip";

interface EpochSummaryProps {
  stats: any;
  currentEpoch: number;
}

export const EpochSummary: FC<EpochSummaryProps> = ({
  stats,
  currentEpoch,
}) => {
  const startDate = new Date(toUtcDate(stats.epoch?.start_time)).getTime();
  const endDate = new Date(toUtcDate(stats.epoch?.end_time)).getTime();
  const epochDurationSeconds = (endDate - startDate) / 1000;
  const usedTPS = stats?.epoch?.tx_count / epochDurationSeconds;
  const capTps = stats?.proto?.max;

  const endTime = startDate + 432000000;
  const durationInSeconds = (endTime - startDate) / 1000;

  const [timeLeft, setTimeLeft] = useState(
    (endTime - new Date().getTime()) / 1000,
  );

  useEffect(() => {
    setTimeLeft((endTime - new Date().getTime()) / 1000);
  }, [endTime]);

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

  const overviewList = [
    {
      label: "Beginning",
      value: <TimeDateIndicator time={stats.epoch?.start_time ?? ""} />,
    },
    {
      label: "End",
      value:
        stats.epoch_no === currentEpoch ? (
          <div className='flex items-center gap-3'>
            <div className='relative min-h-2 w-1/2 overflow-hidden rounded-[4px] bg-[#FEC84B]'>
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
                  : elapsedPercentage?.toFixed(2)
                : "?"}
              %
            </span>
          </div>
        ) : (
          <TimeDateIndicator time={stats.epoch?.end_time ?? ""} />
        ),
    },
    {
      label: "Blocks",
      value: (
        <p className='text-sm font-medium'>
          {formatNumber(stats?.epoch?.block_count)}
        </p>
      ),
    },
    {
      label: "Transactions",
      value: (
        <p className='text-sm font-medium'>
          {formatNumber(stats?.epoch?.tx_count)}
        </p>
      ),
    },
    {
      label: "Fees Generated",
      value: (
        <p className='text-sm font-medium'>
          <AdaWithTooltip data={stats?.epoch?.fees} />
        </p>
      ),
    },
    {
      label: "TPS:",
      value: (
        <p className='text-sm font-medium'>
          {usedTPS?.toFixed(2)} (used) / {capTps?.toFixed(2)} (cap)
        </p>
      ),
    },
  ];

  return (
    <div className='h-fit flex-grow basis-[450px] md:flex-shrink-0'>
      <OverviewCard
        title='Summary'
        subTitle={
          stats.epoch_no === currentEpoch && (
            <div className='relative flex h-[24px] w-[115px] items-center justify-end rounded-lg border border-border px-[10px]'>
              <div className='absolute left-2'>
                <PulseDot />
              </div>
              <span className='text-xs font-medium'>Current Epoch</span>
            </div>
          )
        }
        overviewList={overviewList}
      />
    </div>
  );
};
