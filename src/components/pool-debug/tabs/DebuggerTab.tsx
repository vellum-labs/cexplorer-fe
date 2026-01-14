import type { FC } from "react";
import { DateCell, GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolSelector } from "@/components/staking-calculator/PoolSelector";
import { useFetchPoolDebug } from "@/services/pools";
import type { PoolDebugError } from "@/types/poolTypes";
import { Link } from "@tanstack/react-router";
import { Info, Check, X } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

interface DebuggerTabProps {
  selectedPool: Pool | null;
  onSelectPool: (pool: Pool | null) => void;
}

export const DebuggerTab: FC<DebuggerTabProps> = ({
  selectedPool,
  onSelectPool,
}) => {
  const { t } = useAppTranslation("pages");
  const debugQuery = useFetchPoolDebug(selectedPool?.pool_id ?? "");

  const errors = debugQuery.data?.data?.error ?? [];
  const errorCount = errors.length;

  const formatErrorType = (type: string) => {
    return type
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace("Off Chain", "Off-chain");
  };

  const columns = [
    {
      key: "date",
      title: t("poolDebug.debugger.date"),
      visible: true,
      widthPx: 100,
      render: (item: PoolDebugError) => <DateCell time={item.date} />,
    },
    {
      key: "type",
      title: t("poolDebug.debugger.type"),
      visible: true,
      widthPx: 150,
      render: (item: PoolDebugError) => (
        <span className='text-grayTextPrimary'>
          {formatErrorType(item.type)}
        </span>
      ),
    },
    {
      key: "description",
      title: t("poolDebug.debugger.errorDescription"),
      visible: true,
      widthPx: 500,
      render: (item: PoolDebugError) => {
        const urlMatch = item.description.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const parts = item.description.split(url);
          return (
            <span className='text-grayTextPrimary'>
              {parts[0]}
              <a
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary'
              >
                {url}
              </a>
              {parts[1]}
            </span>
          );
        }
        return <span className='text-grayTextPrimary'>{item.description}</span>;
      },
    },
  ];

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-3 rounded-xl border border-border bg-cardBg p-3'>
        <div className='flex items-start gap-2'>
          <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-grayTextPrimary' />
          <p className='text-text-sm text-grayTextPrimary'>
            {t("poolDebug.debugger.description")}
          </p>
        </div>

        <PoolSelector selectedPool={selectedPool} onSelectPool={onSelectPool} />

        {selectedPool && (
          <div className='flex items-center justify-between'>
            <div
              className={`flex items-center gap-0.5 text-text-sm ${errorCount === 0 ? "text-greenText" : "text-redText"}`}
            >
              {errorCount === 0 ? (
                <Check className='h-4 w-4' />
              ) : (
                <X className='h-4 w-4' />
              )}
              <span>
                {t("poolDebug.debugger.errors", { count: errorCount })}
              </span>
            </div>
            <Link
              to='/pool/$id'
              params={{ id: selectedPool.pool_id }}
              className='flex items-center gap-1 text-text-sm text-primary'
            >
              {t("poolDebug.debugger.poolDetail")}
            </Link>
          </div>
        )}
      </div>

      {selectedPool && (
        <GlobalTable
          type='default'
          totalItems={errorCount}
          itemsPerPage={errorCount}
          items={errors}
          columns={columns}
          query={debugQuery}
          scrollable
          renderDisplayText={(count, total) =>
            t("common:table.displaying", { count, total })
          }
          noItemsLabel={t("common:table.noItems")}
        />
      )}
    </div>
  );
};
