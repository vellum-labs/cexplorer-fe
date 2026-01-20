import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";

import { useEffect, useState } from "react";

import { formatNumber, toUtcDate } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EpochSummaryProps {
  stats: any;
  currentEpoch: number;
  blockCount?: number;
}

export const EpochSummary: FC<EpochSummaryProps> = ({
  stats,
  currentEpoch,
  blockCount,
}) => {
  const { t } = useAppTranslation("pages");
  const startDate = new Date(toUtcDate(stats.epoch?.start_time)).getTime();
  const endDate = new Date(toUtcDate(stats.epoch?.end_time)).getTime();
  const epochDurationSeconds = (endDate - startDate) / 1000;
  const usedTPS = stats?.epoch?.tx_count / epochDurationSeconds;
  const capTps = stats?.proto?.max;

  const { epochLength } = configJSON.genesisParams[0].shelley[0];

  const endTime = new Date(startDate + epochLength * 1000).getTime();
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
      label: t("epochs.summary.beginning"),
      value: <TimeDateIndicator time={stats.epoch?.start_time ?? ""} />,
    },
    {
      label: t("epochs.summary.end"),
      value:
        stats.epoch_no === currentEpoch ? (
          <div className='flex items-center gap-1.5'>
            <div className='relative min-h-2 w-1/2 overflow-hidden rounded-[4px] bg-[#FEC84B]'>
              <span
                className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                style={{
                  width: `${elapsedPercentage ? (elapsedPercentage > 100 ? 100 : elapsedPercentage) : 0}%`,
                }}
              ></span>
            </div>
            <span className='text-text-sm font-medium text-grayTextPrimary'>
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
      label: t("epochs.summary.blocks"),
      value: (
        <p className='text-text-sm font-medium'>
          {formatNumber(blockCount ?? stats?.epoch?.block_count)}
        </p>
      ),
    },
    {
      label: t("epochs.summary.transactions"),
      value: (
        <p className='text-text-sm font-medium'>
          {formatNumber(stats?.epoch?.tx_count)}
        </p>
      ),
    },
    {
      label: t("epochs.summary.feesGenerated"),
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={stats?.epoch?.fees} />
        </p>
      ),
    },
    {
      label: t("epochs.summary.tps"),
      value: (
        <p className='text-text-sm font-medium'>
          {usedTPS?.toFixed(2)} ({t("epochs.summary.used")}) /{" "}
          {capTps?.toFixed(2)} ({t("epochs.summary.cap")})
        </p>
      ),
    },
  ];

  return (
    <OverviewCard
      title={t("epochs.summary.title")}
      subTitle={
        stats.epoch_no === currentEpoch && (
          <div className='relative flex h-[24px] w-fit items-center justify-end rounded-m border border-border pl-3 pr-2.5'>
            <div className='absolute left-2'>
              <PulseDot />
            </div>
            <span className='text-text-xs font-medium'>
              {t("epochs.summary.currentEpoch")}
            </span>
          </div>
        )
      }
      overviewList={overviewList}
    />
  );
};
