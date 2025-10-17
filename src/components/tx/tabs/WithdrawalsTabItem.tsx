import AddressCell from "@/components/address/AddressCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@/components/global/badges/AddressTypeInitialsBadge";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";
import { useFetchTxDetail } from "@/services/tx";
import type { TableColumns } from "@/types/tableTypes";
import type { Withdrawal } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";

const WithdrawalsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const withdrawals = query?.data?.data?.all_withdrawals;

  const columns: TableColumns<Withdrawal> = [
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1/2'>
          <AddressTypeInitialsBadge address={item.stake_addr} />
          <AddressCell address={item.stake_addr} />
        </div>
      ),
      title: "Address",
      visible: true,
      widthPx: 120,
    },
    {
      key: "value",
      render: item => (
        <span className='flex justify-end text-right'>
          <AdaWithTooltip data={item.amount} />
        </span>
      ),
      title: <span className='flex w-full justify-end'>Amount</span>,
      visible: true,
      widthPx: 80,
    },
  ];

  if (!withdrawals && !query.isLoading) {
    return <p className='w-full text-center text-text-sm'>No withdrawals</p>;
  }

  if (query.isLoading) {
    return <LoadingSkeleton height='100px' rounded='xl' />;
  }

  return (
    <GlobalTable
      type='default'
      columns={columns}
      query={query}
      items={withdrawals || []}
      minContentWidth={500}
      totalItems={withdrawals?.length || 0}
      scrollable
    />
  );
};

export default WithdrawalsTabItem;
