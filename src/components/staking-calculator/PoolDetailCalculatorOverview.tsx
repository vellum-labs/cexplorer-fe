import type { FC } from "react";
import { useState } from "react";
import {
  AdaWithTooltip,
  Copy,
  formatNumber,
  formatString,
} from "@vellumlabs/cexplorer-sdk";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { format, parseISO } from "date-fns";
import { formatWebsiteUrl } from "@/utils/format/formatWebsiteUrl";
import type { useFetchPoolDetail } from "@/services/pools";
import { PoolSaturation } from "@/components/pool/PoolSaturation";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  query: ReturnType<typeof useFetchPoolDetail>;
  estimatedBlocks: number;
  onRoaChange?: (roa: number) => void;
}

export const PoolDetailCalculatorOverview: FC<Props> = ({
  query,
  estimatedBlocks,
  onRoaChange,
}) => {
  const { t } = useAppTranslation("common");
  const data = query.data?.data;
  const [linkModal, setLinkModal] = useState<boolean>(false);
  const [selectedRoaType, setSelectedRoaType] = useState<'upper' | 'actual' | 'lower'>('actual');

  if (query.isLoading) {
    return (
      <>
        <h3 className='text-text-lg font-semibold'>{t("stakingCalculator.poolInfo")}</h3>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6'>
          <div className='flex flex-col gap-3'>
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <LoadingSkeleton key={i} height='24px' rounded='sm' />
            ))}
          </div>
          <div className='flex flex-col gap-3'>
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <LoadingSkeleton key={i} height='24px' rounded='sm' />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return null;
  }

  const leftColumnData = [
    { label: t("stakingCalculator.labels.name"), value: data.pool_name.name },
    { label: t("stakingCalculator.labels.ticker"), value: data.pool_name.ticker },
    {
      label: t("stakingCalculator.labels.poolId"),
      value: (
        <span className='flex items-center gap-1'>
          {formatString(data.pool_id || "", "long")}
          <Copy copyText={data.pool_id} />
        </span>
      ),
    },
    {
      label: t("stakingCalculator.labels.created"),
      value: data.registered && format(parseISO(data.registered), "d.M.yyyy"),
    },
    {
      label: t("stakingCalculator.labels.delegators"),
      value: formatNumber(data.delegators),
    },
    {
      label: t("stakingCalculator.labels.recentRoa"),
      value: data.stats?.recent?.roa
        ? `${data.stats.recent.roa.toFixed(2)}%`
        : "-",
    },
    {
      label: t("stakingCalculator.labels.website"),
      value: data.pool_name.homepage ? (
        <>
          <a
            className='cursor-pointer break-all text-primary'
            href={data.pool_name.homepage}
            title={data.pool_name.homepage || ""}
            onClick={e => {
              e.preventDefault();
              setLinkModal(true);
            }}
          >
            {formatWebsiteUrl(data.pool_name.homepage)}
          </a>
          {linkModal && (
            <SafetyLinkModal
              url={data.pool_name.homepage ?? ""}
              onClose={() => setLinkModal(false)}
              warningText={t("sdk.safetyLink.warningText")}
              goBackLabel={t("sdk.safetyLink.goBackLabel")}
              visitLabel={t("sdk.safetyLink.visitLabel")}
            />
          )}
        </>
      ) : (
        "-"
      ),
    },
  ];

  const rightColumnData = [
    {
      label: t("stakingCalculator.labels.estimatedBlocks"),
      value: formatNumber(Math.round(estimatedBlocks)),
    },
    {
      label: t("stakingCalculator.labels.liveStake"),
      value: (
        <div className='flex min-w-0 flex-col items-end gap-1'>
          <AdaWithTooltip data={data.live_stake || 0} />
          <div className='w-[140px]'>
            <PoolSaturation live_stake={data.live_stake} />
          </div>
        </div>
      ),
    },
    {
      label: t("stakingCalculator.labels.activeStake"),
      value: <AdaWithTooltip data={data.active_stake || 0} />,
    },
    {
      label: t("stakingCalculator.labels.activePledge"),
      value: <AdaWithTooltip data={data.pledged ?? 0} />,
    },
    {
      label: t("stakingCalculator.labels.lifetimeRoa"),
      value: data.stats?.lifetime?.roa
        ? `${data.stats.lifetime.roa.toFixed(2)}%`
        : "-",
    },
    {
      label: t("stakingCalculator.labels.marginFee"),
      value: ((data.pool_update.active.margin ?? 0) * 100).toFixed(2) + "%",
    },
    {
      label: t("stakingCalculator.labels.fixedFee"),
      value: <AdaWithTooltip data={data.pool_update.active.fixed_cost ?? 0} />,
    },
  ];

  const recentRoa = data.stats?.recent?.roa ?? 0;
  const upperRoa = recentRoa * 1.1;
  const lowerRoa = recentRoa * 0.9;

  return (
    <>
      <h3 className='text-text-lg font-semibold'>{t("stakingCalculator.poolInfo")}</h3>

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6'>
        <div className='flex flex-col gap-3'>
          {leftColumnData.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-2'
            >
              <span className='text-text-sm text-grayTextPrimary'>
                {item.label}
              </span>
              <span className='text-text-sm font-medium'>{item.value}</span>
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-3'>
          {rightColumnData.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-2'
            >
              <span className='text-text-sm text-grayTextPrimary'>
                {item.label}
              </span>
              <span className='text-text-sm font-medium'>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className='mt-4 text-text-lg font-semibold'>{t("stakingCalculator.expectedReturns")}</h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <Tooltip content={t("stakingCalculator.tooltips.upper")}>
          <div>
            <button
              onClick={() => {
                setSelectedRoaType('upper');
                onRoaChange?.(upperRoa);
              }}
              className={`flex w-full flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                selectedRoaType === 'upper'
                  ? 'border-primary bg-cardBg'
                  : 'border-border bg-cardBg hover:border-primary/50'
              }`}
            >
              <p className='text-text-2xl font-bold'>{upperRoa.toFixed(2)}%</p>
              <p className='text-center text-text-sm text-grayTextPrimary'>{t("stakingCalculator.roaTypes.upper")}</p>
            </button>
          </div>
        </Tooltip>
        <Tooltip content={t("stakingCalculator.tooltips.actual")}>
          <div>
            <button
              onClick={() => {
                setSelectedRoaType('actual');
                onRoaChange?.(recentRoa);
              }}
              className={`flex w-full flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                selectedRoaType === 'actual'
                  ? 'border-primary bg-cardBg'
                  : 'border-border bg-cardBg hover:border-primary/50'
              }`}
            >
              <p className='text-text-2xl font-bold'>{recentRoa.toFixed(2)}%</p>
              <p className='text-center text-text-sm text-grayTextPrimary'>
                {t("stakingCalculator.roaTypes.actual")}
              </p>
            </button>
          </div>
        </Tooltip>
        <Tooltip content={t("stakingCalculator.tooltips.lower")}>
          <div>
            <button
              onClick={() => {
                setSelectedRoaType('lower');
                onRoaChange?.(lowerRoa);
              }}
              className={`flex w-full flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                selectedRoaType === 'lower'
                  ? 'border-primary bg-cardBg'
                  : 'border-border bg-cardBg hover:border-primary/50'
              }`}
            >
              <p className='text-text-2xl font-bold'>{lowerRoa.toFixed(2)}%</p>
              <p className='text-center text-text-sm text-grayTextPrimary'>{t("stakingCalculator.roaTypes.lower")}</p>
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};
