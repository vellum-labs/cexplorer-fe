import AddressCell from "@/components/address/AddressCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { useFetchTxDetail } from "@/services/tx";
import { getRouteApi } from "@tanstack/react-router";
import { Route, User } from "lucide-react";

const DelegationsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const delegations = query.data?.data.delegation;

  const columns = [
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1/2'>
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
      render: item => {
        const isDrepDelegation = item.type === "vote";
        const displayRole = isDrepDelegation ? "DRep" : "SPO";

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[6px]'>
            {isDrepDelegation ? (
              <User size={12} className='text-primary' />
            ) : (
              <Route size={12} className='text-primary' />
            )}
            <span className='text-text-xs font-medium'>{displayRole}</span>
          </div>
        );
      },
      title: "Delegation Type",
      visible: true,
      widthPx: 80,
    },
    {
      key: "delegation",
      render: item => {
        if (item.type === "vote") {
          const drepItem = {
            data: item.detail.meta,
            hash: {
              view: item.detail.id,
            },
          };
          return <DrepNameCell item={drepItem} />;
        } else {
          return (
            <PoolCell
              poolInfo={item.detail}
              poolImageUrl={generateImageUrl(item.detail.id, "ico", "pool")}
            />
          );
        }
      },
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
    return <p className='w-full text-center text-text-sm'>No withdrawals</p>;
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
