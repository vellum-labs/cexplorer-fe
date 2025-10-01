import type { TableColumns } from "@/types/tableTypes";
import { type FC } from "react";

import GlobalTable from "@/components/table/GlobalTable";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import AdaHandleBadge from "@/components/global/badges/AdaHandleBadge";
import { TokenSelectCombobox } from "@/components/asset/TokenSelect";
import { formatString } from "@/utils/format/format";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchAccountList } from "@/services/user";
import type { StakeKeyData } from "@/types/userTypes";
import { WatchlistStar } from "@/components/global/watchlist/WatchlistStar";
import Copy from "@/components/global/Copy";
import { Link } from "@tanstack/react-router";

export const StakeListTab: FC = () => {
  const token = useAuthToken();
  const accountListQuery = useFetchAccountList(token);

  const data = accountListQuery?.data?.data?.data ?? [];

  if (!token) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>Please connect your wallet</div>
      </div>
    );
  }

  const columns: TableColumns<StakeKeyData> = [
    {
      key: "view",
      render: item => (
        <div className='flex items-center gap-2'>
          <div className='flex flex-col'>
            <Link
              to='/stake/$stakeAddr'
              params={{ stakeAddr: item.view }}
              className='font-medium text-primary hover:underline'
            >
              {formatString(item.view, "long")}
            </Link>
            {item.adahandle && (
              <AdaHandleBadge hex={item.adahandle} link className='mt-1' />
            )}
          </div>
          <Copy copyText={item.view} />
        </div>
      ),
      title: "Stake Address",
      visible: true,
      widthPx: 200,
    },
    {
      key: "live_stake",
      render: item => <AdaWithTooltip data={item.stake?.live?.amount ?? 0} />,
      title: "Live Stake",
      visible: true,
      widthPx: 120,
    },
    {
      key: "active_stake",
      render: item => <AdaWithTooltip data={item.stake?.active?.amount ?? 0} />,
      title: "Active Stake",
      visible: true,
      widthPx: 120,
    },
    {
      key: "accounts",
      render: item => (
        <span className='font-medium'>{item.stake?.active?.accounts ?? 0}</span>
      ),
      title: "Accounts",
      visible: true,
      widthPx: 80,
    },
    {
      key: "assets",
      render: item => {
        const assets = item.asset ?? [];
        if (assets.length === 0) {
          return <span className='text-grayTextPrimary'>No assets</span>;
        }

        // Transform Asset[] to AddressAsset[] format
        const transformedAssets = assets.map(asset => ({
          ...asset,
          registry: asset.registry ? { name: asset.registry } : undefined,
        }));

        try {
          return <TokenSelectCombobox items={transformedAssets as any} />;
        } catch (error) {
          // Fallback to simple count if TokenSelectCombobox fails
          return (
            <span className='text-sm font-medium'>
              {assets.length} asset{assets.length !== 1 ? "s" : ""}
            </span>
          );
        }
      },
      title: "Assets",
      visible: true,
      widthPx: 110,
    },
    {
      key: "actions",
      render: item => <WatchlistStar ident={item.view} />,
      title: "Actions",
      visible: true,
      widthPx: 80,
    },
  ];

  if (accountListQuery?.isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>Loading stake keys...</div>
      </div>
    );
  }

  if (accountListQuery?.isError) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-red-500'>Error loading stake keys</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-end gap-4'>
      <GlobalTable
        type='default'
        query={accountListQuery}
        itemsPerPage={data.length}
        totalItems={data.length}
        rowHeight={65}
        scrollable
        minContentWidth={800}
        items={data}
        columns={columns}
      />
    </div>
  );
};
