import AddressCell from "@/components/address/AddressCell";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { AddressTypeInitialsBadge } from "@/components/global/badges/AddressTypeInitialsBadge";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import GlobalTable from "@/components/table/GlobalTable";
import PoolCell from "@/components/table/PoolCell";
import { useFetchTxDetail } from "@/services/tx";
import { getRouteApi } from "@tanstack/react-router";

const DelegationsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const delegations = query.data?.data.delegation;

  const columns = [
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1'>
          <AddressTypeInitialsBadge address={item.view} />
          <AddressCell address={item.view} />
        </div>
      ),
      title: "Address",
      visible: true,
      widthPx: 120,
    },
    {
      key: "type",
      render: item => (
        <div className='w-fit rounded border border-yellow-800 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800'>
          {item.type}
        </div>
      ),
      title: "Delegation Type",
      visible: true,
      widthPx: 80,
    },
    {
      key: "delegation",
      render: item => <PoolCell poolInfo={item.detail} />,
      title: "Delegation",
      visible: true,
      widthPx: 80,
    },
    {
      key: "live_stake",
      render: item => (
        <span className='flex justify-end text-right'>
          <AdaWithTooltip data={item.stake?.live} />
        </span>
      ),
      title: <p className='w-full text-right'>Live Stake</p>,
      visible: true,
      widthPx: 80,
    },
    {
      key: "active_stake",
      render: item => (
        <p className='flex justify-end text-right'>
          <AdaWithTooltip data={item.stake?.active} />
        </p>
      ),
      title: <p className='w-full text-right'>Active Stake</p>,
      visible: true,
      widthPx: 80,
    },
  ];

  if (!delegations && !query.isLoading) {
    return <p className='w-full text-center text-sm'>No withdrawals</p>;
  }

  if (query.isLoading) {
    return <LoadingSkeleton height='300px' rounded='xl' />;
  }

  return (
    <div>
      <GlobalTable
        type='default'
        items={delegations}
        columns={columns}
        query={query}
        scrollable
        itemsPerPage={20}
        minContentWidth={700}
        disableDrag
      />
    </div>
  );
};

export default DelegationsTabItem;
