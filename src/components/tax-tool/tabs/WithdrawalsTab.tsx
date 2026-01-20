import type { FC } from "react";
import { useMemo, useState } from "react";
import { useFetchWithdrawalsPaginated } from "@/services/account";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  LoadingSkeleton,
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
  const { t } = useAppTranslation("common");
  const { secondaryCurrency, setSecondaryCurrency } =
    useTaxToolPreferencesStore();
  const { rows: storedRows, setRows: setStoredRows } =
    useTaxToolWithdrawalsTableStore();
  const [page, setPage] = useState(1);

  const limit = storedRows;
  const offset = (page - 1) * limit;
  const isValidStakeKey = stakeKey && isValidAddress(stakeKey);

  const query = useFetchWithdrawalsPaginated(
    limit,
    offset,
    isValidStakeKey ? stakeKey : "",
  );

  const withdrawals = useMemo(() => {
    if (!query.data?.data) return [];
    return query.data.data;
  }, [query.data]);

  if (!stakeKey || !isValidStakeKey) {
    return null;
  }

  const isLoading =
    query.isLoading || (query.isFetching && !withdrawals.length);

  return (
    <div className='flex w-full flex-col gap-3 pt-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-text-sm font-medium'>
            {t("taxTool.secondaryCurrency")}
          </span>
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

      {isLoading ? (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <LoadingSkeleton height='24px' width='150px' />
            <div className='flex gap-1'>
              <LoadingSkeleton height='36px' width='36px' />
              <LoadingSkeleton height='36px' width='100px' />
            </div>
          </div>
          <LoadingSkeleton height='400px' width='100%' />
        </div>
      ) : (
        <WithdrawalsTable
          query={query}
          data={withdrawals}
          secondaryCurrency={secondaryCurrency}
          currentPage={page}
          onPageChange={setPage}
          totalItems={query.data?.count || 0}
          itemsPerPage={limit}
          onItemsPerPageChange={rows => {
            setStoredRows(rows);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};
