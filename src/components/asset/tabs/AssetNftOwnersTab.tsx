import type { AssetOwnersNftItem } from "@/types/assetsTypes";
import type { AssetOwnerNftColumns, TableColumns } from "@/types/tableTypes";
import { useEffect, useState, type FC } from "react";

import DateCell from "@/components/table/DateCell";
import GlobalTable from "@/components/table/GlobalTable";

import { useFetchNftAssetOwners } from "@/services/assets";
import { useAssetOwnerNftTableStore } from "@/stores/tables/AssetOwnerNftTableStore";

import AddressCell from "@/components/address/AddressCell";
import { AddressTypeInitialsBadge } from "@/components/global/badges/AddressTypeInitialsBadge";
import { useSearch } from "@tanstack/react-router";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

interface AssetNftOwnersTabProps {
  name: number;
  policy: string;
  price?: number;
}

export const AssetNftOwnersTab: FC<AssetNftOwnersTabProps> = ({
  name,
  policy,
  price,
}) => {
  const [totalItems, setTotalItems] = useState<number>(0);
  const { page } = useSearch({ from: "/asset/$fingerprint" });
  const assetName = policy + name;
  const ownersQuery = useFetchNftAssetOwners(
    assetName,
    (page ?? 1) * 20 - 20,
    20,
  );
  const { columnsOrder, setColumsOrder } = useAssetOwnerNftTableStore();

  const { data } = ownersQuery;

  const items = data?.pages.flatMap(page => page.data.data);
  const totalOwners = ownersQuery.data?.pages[0].data.count;

  const nftMarket = configJSON.market[0].nft[0].active;

  const columns: TableColumns<AssetOwnersNftItem> = [
    {
      key: "order",
      render: () => <></>,
      title: "#",
      visible: true,
      standByRanking: true,
      widthPx: 10,
    },
    {
      key: "owner",
      render: item =>
        item?.owner?.address ? (
          <div className='flex items-center gap-1'>
            <AddressTypeInitialsBadge address={item?.owner.address} />
            <AddressCell address={item?.owner?.address} />
          </div>
        ) : (
          "-"
        ),
      title: "Owner",
      visible: true,
      widthPx: 65,
    },
    {
      key: "date",
      render: item => <DateCell time={item?.block?.time ?? ""} />,
      title: "Date",
      visible: true,
      widthPx: 50,
    },
    {
      key: "value",
      title: <p className='w-full text-right'>Value</p>,
      render: item => (
        <p className='w-full text-right'>
          {price ? lovelaceToAda(price * item?.quantity) : "-"}
        </p>
      ),
      visible: nftMarket,
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
      minContentWidth={700}
      items={items}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof AssetOwnerNftColumns) -
          columnsOrder.indexOf(b.key as keyof AssetOwnerNftColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
