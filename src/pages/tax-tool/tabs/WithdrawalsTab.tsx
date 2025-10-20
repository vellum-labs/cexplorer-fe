import type { FC } from "react";
import { useState, useMemo } from "react";
import { useFetchWithdrawals } from "@/services/account";
import { useCurrencyStore } from "@/stores/currencyStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/constants/currencies";
import type { Currencies } from "@/types/storeTypes";
import { WithdrawalsTable } from "../components/WithdrawalsTable";

interface WithdrawalsTabProps {
  stakeKey: string;
}

export const WithdrawalsTab: FC<WithdrawalsTabProps> = ({ stakeKey }) => {
  const { currency: globalCurrency } = useCurrencyStore();
  const [secondaryCurrency, setSecondaryCurrency] = useState<Currencies>("czk" as Currencies);
  const [limit] = useState(20);
  const [page] = useState(1);

  const query = useFetchWithdrawals(limit, 0, stakeKey);

  // Flatten all pages of withdrawals data
  const allWithdrawals = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap(page => page.data?.data || []);
  }, [query.data]);

  if (!stakeKey) {
    return (
      <div className='flex w-full items-center justify-center py-8 text-grayTextPrimary'>
        Enter a stake key to view withdrawals
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-3 pt-3'>
      {/* Currency Selector */}
      <div className='flex items-center justify-between px-mobile md:px-desktop'>
        <div className='flex items-center gap-2'>
          <span className='text-text-sm font-medium'>Secondary currency:</span>
          <Select
            value={secondaryCurrency}
            onValueChange={(value) => setSecondaryCurrency(value as Currencies)}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencies).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className='uppercase'>{value.value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Withdrawals Table */}
      <WithdrawalsTable
        query={query}
        data={allWithdrawals}
        secondaryCurrency={secondaryCurrency}
        currentPage={page}
        totalItems={query.data?.pages[0]?.data?.count || 0}
        itemsPerPage={limit}
      />
    </div>
  );
};
