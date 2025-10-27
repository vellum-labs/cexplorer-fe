import AddressCell from "@/components/address/AddressCell";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetail } from "@/services/tx";
import type { TableColumns } from "@/types/tableTypes";
import type { TxInfo } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";
import { HashCell } from "../HashCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";

const ReferenceInputsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const inputs = query?.data?.data?.reference_inputs;

  if (!inputs && !query.isLoading) {
    return (
      <p className='w-full text-center text-text-sm'>
        No reference inputs found
      </p>
    );
  }

  const columns: TableColumns<TxInfo> = [
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1/2'>
          <AddressTypeInitialsBadge address={item.payment_addr_bech32} />
          <AddressCell address={item.payment_addr_bech32} />
        </div>
      ),
      title: "Address",
      visible: true,
      widthPx: 120,
    },
    {
      key: "tx_hash",
      render: item => <HashCell hash={item.tx_hash} />,
      title: "Transaction",
      visible: true,
      widthPx: 120,
    },
    {
      key: "value",
      render: item => (
        <span className='flex justify-end text-right'>
          <AdaWithTooltip data={item.value} />
        </span>
      ),
      title: <span className='flex w-full justify-end'>Collateral</span>,
      visible: true,
      widthPx: 80,
    },
  ];

  if (query.isLoading) {
    return <LoadingSkeleton height='100px' rounded='xl' />;
  }

  return (
    <GlobalTable
      type='default'
      columns={columns}
      query={query}
      items={query.data?.data.reference_inputs ?? []}
      totalItems={query.data?.data.reference_inputs?.length ?? 0}
      scrollable
      minContentWidth={800}
    />
  );
};

export default ReferenceInputsTabItem;
