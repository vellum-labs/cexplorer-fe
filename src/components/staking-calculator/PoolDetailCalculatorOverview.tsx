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
import { format, parseISO } from "date-fns";
import { formatWebsiteUrl } from "@/utils/format/formatWebsiteUrl";
import type { useFetchPoolDetail } from "@/services/pools";
import { PoolSaturation } from "@/components/pool/PoolSaturation";

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
  const data = query.data?.data;
  const [linkModal, setLinkModal] = useState<boolean>(false);
  const [selectedRoaType, setSelectedRoaType] = useState<'upper' | 'average' | 'lower'>('average');

  if (query.isLoading) {
    return (
      <>
        <h3 className='text-text-lg font-semibold'>Pool Info</h3>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6'>
          <div className='flex flex-col gap-3'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <LoadingSkeleton key={i} height='24px' rounded='sm' />
            ))}
          </div>
          <div className='flex flex-col gap-3'>
            {[1, 2, 3, 4, 5, 6].map(i => (
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
    { label: "Name", value: data.pool_name.name },
    { label: "Ticker", value: data.pool_name.ticker },
    {
      label: "Pool ID",
      value: (
        <span className='flex items-center gap-1'>
          {formatString(data.pool_id || "", "long")}
          <Copy copyText={data.pool_id} />
        </span>
      ),
    },
    {
      label: "Created",
      value: data.registered && format(parseISO(data.registered), "d.M.yyyy"),
    },
    {
      label: "Delegators",
      value: formatNumber(data.delegators),
    },
    {
      label: "Website",
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
      label: "Estimated Blocks",
      value: formatNumber(Math.round(estimatedBlocks)),
    },
    {
      label: "Live Stake",
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
      label: "Active Stake",
      value: <AdaWithTooltip data={data.active_stake || 0} />,
    },
    {
      label: "Active Pledge",
      value: <AdaWithTooltip data={data.pledged ?? 0} />,
    },
    {
      label: "Margin Fee",
      value: ((data.pool_update.active.margin ?? 0) * 100).toFixed(2) + "%",
    },
    {
      label: "Fixed Fee",
      value: <AdaWithTooltip data={data.pool_update.active.fixed_cost ?? 0} />,
    },
  ];

  const recentRoa = data.stats?.recent?.roa ?? 0;
  const upperRoa = recentRoa * 1.1;
  const lowerRoa = recentRoa * 0.9;

  return (
    <>
      <h3 className='text-text-lg font-semibold'>Pool Info</h3>

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

      <h3 className='mt-4 text-text-lg font-semibold'>Expected returns</h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <button
          onClick={() => {
            setSelectedRoaType('upper');
            onRoaChange?.(upperRoa);
          }}
          className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
            selectedRoaType === 'upper'
              ? 'border-primary bg-cardBg'
              : 'border-border bg-cardBg hover:border-primary/50'
          }`}
        >
          <p className='text-text-2xl font-bold'>{upperRoa.toFixed(2)}%</p>
          <p className='text-center text-text-sm text-grayTextPrimary'>Upper</p>
        </button>
        <button
          onClick={() => {
            setSelectedRoaType('average');
            onRoaChange?.(recentRoa);
          }}
          className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
            selectedRoaType === 'average'
              ? 'border-primary bg-cardBg'
              : 'border-border bg-cardBg hover:border-primary/50'
          }`}
        >
          <p className='text-text-2xl font-bold'>{recentRoa.toFixed(2)}%</p>
          <p className='text-center text-text-sm text-grayTextPrimary'>
            Average
          </p>
        </button>
        <button
          onClick={() => {
            setSelectedRoaType('lower');
            onRoaChange?.(lowerRoa);
          }}
          className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
            selectedRoaType === 'lower'
              ? 'border-primary bg-cardBg'
              : 'border-border bg-cardBg hover:border-primary/50'
          }`}
        >
          <p className='text-text-2xl font-bold'>{lowerRoa.toFixed(2)}%</p>
          <p className='text-center text-text-sm text-grayTextPrimary'>Lower</p>
        </button>
      </div>
    </>
  );
};
