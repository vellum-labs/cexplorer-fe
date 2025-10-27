import type { FC } from "react";
import { useMemo } from "react";
import { useFetchWithdrawals } from "@/services/account";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vellumlabs/cexplorer-sdk";
import { currencies } from "@vellumlabs/cexplorer-sdk";
import type { Currencies } from "@/types/storeTypes";
import { WithdrawalsTable } from "../components/WithdrawalsTable";
import { useTaxToolPreferencesStore } from "@/stores/taxToolPreferencesStore";
import { useTaxToolWithdrawalsTableStore } from "@/stores/tables/taxToolWithdrawalsTableStore";

interface WithdrawalsTabProps {
  stakeKey: string;
}

export const WithdrawalsTab: FC<WithdrawalsTabProps> = ({ stakeKey }) => {
  const { secondaryCurrency, setSecondaryCurrency } =
    useTaxToolPreferencesStore();
  const { rows: storedRows, setRows: setStoredRows } =
    useTaxToolWithdrawalsTableStore();

  const handleRowsChange = (rows: number) => {
    setStoredRows(rows);
  };

  const limit = storedRows;

  const query = useFetchWithdrawals(limit, 0, stakeKey);

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
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-text-sm font-medium'>Secondary currency:</span>
          <Select
            value={secondaryCurrency}
            onValueChange={value => setSecondaryCurrency(value as Currencies)}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencies).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className='uppercase'>{(value as any).value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <WithdrawalsTable
        query={query}
        data={allWithdrawals}
        secondaryCurrency={secondaryCurrency}
        currentPage={1}
        totalItems={query.data?.pages[0]?.data?.count || 0}
        itemsPerPage={limit}
        onItemsPerPageChange={handleRowsChange}
      />
    </div>
  );
};
