import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import type { RewardItem } from "@/types/accountTypes";
import {
  Copy,
  Tooltip,
  AdaWithTooltip,
  formatDate,
} from "@vellumlabs/cexplorer-sdk";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { Link } from "@tanstack/react-router";
import GlobalTable from "@/components/table/GlobalTable";
import type { Column } from "@/components/table/GlobalTable";
import type { UseQueryResult } from "@tanstack/react-query";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Pagination } from "@vellumlabs/cexplorer-sdk";
import { useMemo, type Dispatch, type SetStateAction } from "react";

interface EpochRewardsTableProps {
  query: UseQueryResult<any, unknown>;
  data: RewardItem[];
  secondaryCurrency: Currencies;
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  totalItems: number;
  itemsPerPage: number;
}

export const EpochRewardsTable: FC<EpochRewardsTableProps> = ({
  query,
  data,
  secondaryCurrency,
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return formatDate(dateString, true);
  };

  // Helper function to extract ADA rate from reward
  const getAdaRate = (reward: RewardItem): number => {
    if (
      !reward.spendable_epoch?.rate ||
      !Array.isArray(reward.spendable_epoch.rate)
    ) {
      return 0;
    }

    const rateData = reward.spendable_epoch.rate[0];
    if (
      !rateData?.ada ||
      !Array.isArray(rateData.ada) ||
      rateData.ada.length === 0
    ) {
      return 0;
    }

    return rateData.ada[0]?.close || 0;
  };

  const calculateCurrencyValues = (
    adaAmount: number,
    reward: RewardItem,
  ): {
    usd: number;
    secondary: number;
    adaUsd: number;
    adaSecondary: number;
  } => {
    const rate = getAdaRate(reward);

    if (!rate) {
      return { usd: 0, secondary: 0, adaUsd: 0, adaSecondary: 0 };
    }

    const usdValue = adaAmount * rate;
    // TODO: Implement proper secondary currency conversion using historical rates
    const secondaryValue = usdValue; // Placeholder

    return {
      usd: usdValue,
      secondary: secondaryValue,
      adaUsd: rate,
      adaSecondary: rate, // Placeholder
    };
  };

  const columns: Column<RewardItem>[] = [
    {
      key: "epoch",
      title: "Epoch",
      visible: true,
      widthPx: 100,
      render: item => (
        <Link
          to='/epoch/$no'
          params={{ no: String(item.earned_epoch) }}
          className='text-primary hover:underline'
        >
          {item.earned_epoch}
        </Link>
      ),
    },
    {
      key: "end_time",
      title: (
        <div className='flex items-center gap-1'>
          End Time
          <Tooltip
            content={
              <div className='w-36 text-center'>
                Exchange rates from the epoch end date.
              </div>
            }
          >
            <QuestionMarkCircledIcon />
          </Tooltip>
        </div>
      ),
      visible: true,
      widthPx: 180,
      render: item => (
        <span className='text-text-sm'>
          {formatDateTime(item.spendable_epoch.end_time)}
        </span>
      ),
    },
    {
      key: "type",
      title: "Type",
      visible: true,
      widthPx: 100,
      render: item => (
        <span className='capitalize'>{item.type || "Member"}</span>
      ),
    },
    {
      key: "rewards_ada",
      title: <span className='w-full text-right'>Rewards ADA</span>,
      visible: true,
      render: item => (
        <div className='flex items-center justify-end'>
          <AdaWithTooltip data={item.amount} />
        </div>
      ),
    },
    {
      key: "rewards_usd",
      title: <span className='w-full text-right'>Rewards $</span>,
      visible: true,
      render: item => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount, item);
        return (
          <div className='flex items-center justify-end gap-1'>
            <span>
              {formatCurrency(values.usd, "usd", {
                applyNumberFormatting: true,
              })}
            </span>
            <Copy
              copyText={values.usd.toFixed(2)}
              className='translate-y-[1px]'
            />
          </div>
        );
      },
    },
    {
      key: "rewards_secondary",
      title: (
        <span className='w-full text-right uppercase'>
          Rewards {secondaryCurrency}
        </span>
      ),
      visible: showSecondaryCurrency,
      render: item => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount, item);
        return (
          <div className='flex items-center justify-end gap-1'>
            <span>
              {formatCurrency(values.secondary, secondaryCurrency, {
                applyNumberFormatting: true,
              })}
            </span>
            <Copy
              copyText={values.secondary.toFixed(2)}
              className='translate-y-[1px]'
            />
          </div>
        );
      },
    },
    {
      key: "ada_usd_rate",
      title: (
        <div className='flex items-center justify-end gap-1'>
          <span className='text-right'>ADA/USD</span>
          <Tooltip
            content={
              <div className='w-36 text-center'>
                Exchange rates from the epoch end date.
              </div>
            }
          >
            <QuestionMarkCircledIcon />
          </Tooltip>
        </div>
      ),
      visible: true,
      render: item => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount, item);
        return <div className='text-right'>${values.adaUsd.toFixed(5)}</div>;
      },
    },
    {
      key: "ada_secondary_rate",
      title: (
        <div className='flex items-center justify-end gap-1'>
          <span className='text-right uppercase'>ADA/{secondaryCurrency}</span>
          <Tooltip
            content={
              <div className='w-36 text-center'>
                Exchange rates from the epoch end date.
              </div>
            }
          >
            <QuestionMarkCircledIcon />
          </Tooltip>
        </div>
      ),
      visible: showSecondaryCurrency,
      render: item => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount, item);
        return (
          <div className='text-right'>{values.adaSecondary.toFixed(5)}</div>
        );
      },
    },
  ];

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-text-md font-semibold'>Epoch by epoch</h3>
      </div>
      <GlobalTable
        type='default'
        pagination={false}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        scrollable
        query={query}
        items={data}
        columns={columns}
        disableDrag
      />
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={onPageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
