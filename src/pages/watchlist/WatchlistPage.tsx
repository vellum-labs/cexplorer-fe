import { AddressesTab } from "@/components/address/tabs/AddressesTab";
import { DrepListTab } from "@/components/drep/tabs/DrepListTab";
import { StakeListTab } from "@/components/stake/tabs/StakeListTab";
import { PolicyListTab } from "@/components/policy/tabs/PolicyListTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useMemo, useState } from "react";
import { AssetListPage } from "../assets/AssetListPage";
import PoolListTab from "@/components/pool/tabs/PoolListTab";
import { PageBase } from "@/components/global/pages/PageBase";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { EmptyState } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { Star, Wallet } from "lucide-react";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import {
  useFetchWatchlist,
  useFetchAccountList,
  useFetchPolicyList,
} from "@/services/user";

export const WatchlistPage = () => {
  const token = useAuthToken();
  const query = useFetchWatchlist(token);
  const accountListQuery = useFetchAccountList(token);
  const policyListQuery = useFetchPolicyList(token);
  const { watchlist: data } = useWatchlistStore();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const count = useMemo(() => {
    const stakeCount = accountListQuery.data?.data?.data?.length ?? 0;

    if (!data) {
      return {
        addresses: 0,
        assets: 0,
        pools: 0,
        dreps: 0,
        stakes: stakeCount,
        policies: 0,
      };
    }

    const watchlistCount = data.reduce(
      (acc, item) => {
        switch (item.type) {
          case "address":
            acc.addresses++;
            break;
          case "asset":
            acc.assets++;
            break;
          case "pool":
            acc.pools++;
            break;
          case "drep":
            acc.dreps++;
            break;
          case "policy":
            acc.policies++;
            break;
        }
        return acc;
      },
      { addresses: 0, assets: 0, pools: 0, dreps: 0, policies: 0 },
    );

    return { ...watchlistCount, stakes: stakeCount };
  }, [data, accountListQuery.data]);

  const tabItems = useMemo(
    () => [
      {
        key: "stakes",
        title: "Accounts",
        label: (
          <div className='flex items-center gap-1/2'>
            Stakes <Badge color='gray'>{count.stakes}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            <StakeListTab />
          </div>
        ),
        visible: count.stakes > 0,
      },
      {
        key: "wallets",
        title: "Wallets",
        label: (
          <div className='flex items-center gap-1/2'>
            Wallets <Badge color='gray'>{count.addresses}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            <AddressesTab watchlist_only='1' />
          </div>
        ),
        visible: count.addresses > 0,
      },
      {
        key: "assets",
        title: "Assets",
        label: (
          <div className='flex items-center gap-1/2'>
            Assets <Badge color='gray'>{count.assets}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            <AssetListPage watchlist showHeader={false} />
          </div>
        ),
        visible: count.assets > 0,
      },
      {
        key: "pools",
        title: "Pools",
        label: (
          <div className='flex items-center gap-1/2'>
            Pools <Badge color='gray'>{count.pools}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            <PoolListTab watchlist />
          </div>
        ),
        visible: count.pools > 0,
      },
      {
        key: "dreps",
        title: "DReps",
        label: (
          <div className='flex items-center gap-1/2'>
            Dreps <Badge color='gray'>{count.dreps}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            <DrepListTab watchlist />
          </div>
        ),
        visible: count.dreps > 0,
      },
      {
        key: "policies",
        title: "Collections",
        label: (
          <div className='flex items-center gap-1/2'>
            Policies <Badge color='gray'>{count.policies}</Badge>
          </div>
        ),
        content: (
          <div className='mt-3'>
            {policyListQuery?.isLoading ? (
              <div className='flex flex-col gap-2'>
                <LoadingSkeleton height='40px' width='100%' />
                <LoadingSkeleton height='200px' width='100%' />
              </div>
            ) : (
              <PolicyListTab />
            )}
          </div>
        ),
        visible: count.policies > 0,
      },
    ],
    [count, policyListQuery?.isLoading],
  );

  const totalWatchlistItems =
    count.addresses +
    count.assets +
    count.pools +
    count.dreps +
    count.stakes +
    count.policies;
  const isLoading = token && (query.isLoading || accountListQuery.isLoading);
  const hasError = token && (query.isError || accountListQuery.isError);

  return (
    <>
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
      <PageBase
        metadataTitle='watchlist'
        title='Watchlist'
        breadcrumbItems={[{ label: "Watchlist" }]}
      >
        {token ? (
          <div className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
            {isLoading ? (
              <div className='flex flex-col gap-2'>
                <LoadingSkeleton height='40px' width='100%' />
                <LoadingSkeleton height='200px' width='100%' />
              </div>
            ) : hasError ? (
              <EmptyState
                icon={<Star size={24} />}
                primaryText='Failed to load your watchlist.'
                secondaryText='There was an error loading your watchlist. Please try refreshing the page.'
                button={
                  <Button
                    label='Retry'
                    variant='primary'
                    size='md'
                    onClick={() => query.refetch()}
                  />
                }
              />
            ) : totalWatchlistItems > 0 ? (
              <Tabs items={tabItems} withPadding={false} withMargin={false} />
            ) : (
              <EmptyState
                icon={<Star size={24} />}
                primaryText="You don't have anything in your watchlist yet."
                secondaryText='Star your favorite stake pools, DReps, wallets, or assets to keep track of them here.'
              />
            )}
          </div>
        ) : (
          <div className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
            <EmptyState
              icon={<Wallet size={24} />}
              primaryText='Wallet not connected.'
              secondaryText='Connect your wallet to start building your watchlist of favorite stake pools, DReps, wallets, and assets.'
              button={
                <Button
                  label='Connect wallet'
                  variant='primary'
                  size='md'
                  onClick={() => setShowConnectModal(true)}
                />
              }
            />
          </div>
        )}
      </PageBase>
    </>
  );
};
