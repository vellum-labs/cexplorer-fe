import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import type { Withdrawal } from "@/types/accountTypes";
import { Copy, Tooltip, AdaWithTooltip, formatDate } from "@vellumlabs/cexplorer-sdk";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import GlobalTable from "@/components/table/GlobalTable";
import type { Column } from "@/components/table/GlobalTable";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import type { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface WithdrawalsTableProps {
  query: UseInfiniteQueryResult<InfiniteData<any>, unknown>;
  data: Withdrawal[];
  secondaryCurrency: Currencies;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export const WithdrawalsTable: FC<WithdrawalsTableProps> = ({
  query,
  data,
  secondaryCurrency,
  currentPage,
  totalItems,
  itemsPerPage,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";
  const adaPrice = useAdaPriceWithHistory();

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return formatDate(dateString, "datetime-short");
  };

  const calculateCurrencyValues = (
    adaAmount: number,
  ): { usd: number; secondary: number; adaUsd: number; adaSecondary: number } => {
    // Using current price as we don't have historical withdrawal rates
    // TODO: Implement historical price lookup based on withdrawal timestamp
    const currentRate = adaPrice.todayValue || 0;
    const usdValue = adaAmount * currentRate;
    const secondaryValue = usdValue; // Placeholder

    return {
      usd: usdValue,
      secondary: secondaryValue,
      adaUsd: currentRate,
      adaSecondary: currentRate, // Placeholder
    };
  };

  const columns: Column<Withdrawal>[] = [
    {
      key: "timestamp",
      title: (
        <div className='flex items-center gap-1'>
          Withdrawal timestamp
          <Tooltip
            content={
              <div className='w-36 text-center'>
                Exchange rates from the withdrawal date.
              </div>
            }
          >
            <QuestionMarkCircledIcon />
          </Tooltip>
        </div>
      ),
      visible: true,
      widthPx: 180,
      render: (item) => (
        <span className='text-text-sm'>{formatDateTime(item.block.time)}</span>
      ),
    },
    {
      key: "transaction",
      title: "Transaction",
      visible: true,
      widthPx: 150,
      render: (item) => (
        <Link
          to='/tx/$hash'
          params={{ hash: item.tx.hash }}
          className='text-primary hover:underline'
        >
          {item.tx.hash.slice(0, 12)}...
        </Link>
      ),
    },
    {
      key: "rewards_ada",
      title: <span className='w-full text-right'>Rewards withdrawn ADA</span>,
      visible: true,
      render: (item) => {
        const adaAmount = item.amount / 1_000_000;
        return (
          <div className='flex items-center justify-end gap-1'>
            <span>
              ₳{" "}
              {adaAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
            <Copy
              copyText={adaAmount.toString()}
              className='translate-y-[1px]'
            />
          </div>
        );
      },
    },
    {
      key: "rewards_usd",
      title: <span className='w-full text-right'>Rewards withdrawn $</span>,
      visible: true,
      render: (item) => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount);
        return (
          <div className='flex items-center justify-end gap-1'>
            <span>
              {formatCurrency(values.usd, "usd", {
                applyNumberFormatting: true,
              })}
            </span>
            <Copy copyText={values.usd.toFixed(2)} className='translate-y-[1px]' />
          </div>
        );
      },
    },
    {
      key: "rewards_secondary",
      title: (
        <span className='w-full text-right uppercase'>
          Rewards withdrawn {secondaryCurrency}
        </span>
      ),
      visible: showSecondaryCurrency,
      render: (item) => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount);
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
              <div className='max-w-[200px]'>
                Exchange rates from the withdrawal date.
              </div>
            }
          >
            <Info size={14} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      visible: true,
      render: (item) => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount);
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
              <div className='max-w-[200px]'>
                Exchange rates from the withdrawal date.
              </div>
            }
          >
            <Info size={14} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      visible: showSecondaryCurrency,
      render: (item) => {
        const adaAmount = item.amount / 1_000_000;
        const values = calculateCurrencyValues(adaAmount);
        return <div className='text-right'>{values.adaSecondary.toFixed(5)}</div>;
      },
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-text-md font-semibold'>Withdrawals</h3>
        <Settings size={18} className='cursor-pointer text-grayTextPrimary' />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        scrollable
        query={query}
        items={data}
        columns={columns}
        disableDrag
      />
    </div>
  );
};
