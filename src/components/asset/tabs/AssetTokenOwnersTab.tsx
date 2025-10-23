import type { AssetOwnerColumns } from "@/types/tableTypes";
import { useEffect, useState, type FC } from "react";

import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";

import { useFetchAssetOwners } from "@/services/assets";
import { useAssetOwnerTableStore } from "@/stores/tables/assetOwnerTableStore";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

interface AssetTokenOwnersTabProps {
  name: number;
  policy: string;
  supply?: number;
  price?: number;
  decimals?: number;
}

export const AssetTokenOwnersTab: FC<AssetTokenOwnersTabProps> = ({
  name,
  policy,
  supply,
  price,
  decimals = 1,
}) => {
  const [totalItems, setTotalItems] = useState<number>(0);
  const { page } = useSearch({ from: "/asset/$fingerprint" });
  const assetName = policy + name;
  const ownersQuery = useFetchAssetOwners(assetName, (page ?? 1) * 20 - 20, 20);
  const { columnsOrder, setColumsOrder } = useAssetOwnerTableStore();

  const { data } = ownersQuery;

  const items = data?.pages.flatMap(page => page.data.data);
  const totalOwners = ownersQuery.data?.pages[0].data.count;

  const tokenMarket = configJSON.market[0].token[0].active;

  const columns = [
    {
      key: "order",
      render: () => <></>,
      title: "#",
      visible: true,
      standByRanking: true,
      widthPx: 10,
    },
    {
      key: "type",
      render: item => <AddressTypeInitialsBadge address={item?.address} />,
      title: "Type",
      visible: true,
      widthPx: 30,
    },
    {
      key: "owner",
      render: item =>
        item?.address ? (
          <Link
            to='/address/$address'
            params={{
              address: item.address,
            }}
            className='text-primary'
          >
            {formatString(item.address, "long")}
          </Link>
        ) : (
          "-"
        ),
      title: "Owner",
      visible: true,
      widthPx: 75,
    },
    {
      key: "quantity",
      render: item => (
        <p className='text-right'>
          {item?.quantity
            ? formatNumber((item.quantity / Math.pow(10, decimals)).toFixed(2))
            : "-"}
        </p>
      ),
      title: <p className='w-full text-right'>Quantity</p>,
      visible: true,
      widthPx: 65,
    },
    {
      key: "share",
      title: <p className='w-full text-right'>Share</p>,
      render: item => (
        <p className='w-full text-right'>
          {((item.quantity / (supply ?? 1)) * 100).toFixed(2)}%
        </p>
      ),
      visible: true,
      widthPx: 30,
    },
    {
      key: "value",
      title: <p className='w-full text-right'>Value</p>,
      render: item => (
        <p className='w-full text-right'>
          {price ? lovelaceToAda(price * item?.quantity) : "-"}
        </p>
      ),
      visible: tokenMarket,
      widthPx: 30,
    },
  ];

  useEffect(() => {
    if (totalOwners !== undefined && totalOwners !== totalItems) {
      setTotalItems(totalOwners);
    }
  }, [totalOwners, totalItems]);

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={items?.length}
      scrollable
      query={ownersQuery}
      items={items}
      minContentWidth={700}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof AssetOwnerColumns) -
          columnsOrder.indexOf(b.key as keyof AssetOwnerColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
