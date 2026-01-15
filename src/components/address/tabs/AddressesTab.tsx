import type {
  AddressDetailAdressesColumns,
  TableColumns,
} from "@/types/tableTypes";
import { useState, type FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { TokenSelectCombobox } from "@/components/asset/TokenSelect";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchAddressList } from "@/services/address";
import { useAddressDetailAdressesTable } from "@/stores/tables/addressDetailAdressesTableStore";
import type { AddressListItem } from "@/types/addressTypes";
import { useSearch } from "@tanstack/react-router";
import AddressCell from "../AddressCell";
import ActivityVisual from "../graphs/ActivityVisual";

interface AddressesTabProps {
  paymentAddress?: string;
  view?: string;
  watchlist_only?: "1" | undefined;
  stakeKey?: string;
}

export const AddressesTab: FC<AddressesTabProps> = ({
  paymentAddress,
  view,
  watchlist_only,
  stakeKey,
}) => {
  const { t } = useAppTranslation("common");
  const isStake = view?.includes("stake");
  const { order, page } = useSearch({
    from: watchlist_only
      ? "/watchlist/"
      : isStake
        ? "/stake/$stakeAddr"
        : "/address/$address",
  });
  const { columnsOrder, setColumsOrder } = useAddressDetailAdressesTable();
  const [selectedItem, setSelectedItem] = useState<"balance" | "last">(
    (order as "balance") || "balance",
  );
  const token = useAuthToken();
  const listQuery = useFetchAddressList(
    10,
    (page ?? 1) * 10 - 10,
    paymentAddress,
    view,
    selectedItem,
    watchlist_only,
    token,
  );

  const data = listQuery.data?.pages.flatMap(page => page.data.data);
  const totalItems = listQuery.data?.pages[0].data.count;

  const selectItems = [
    {
      key: "last",
      value: t("address.lastActivity"),
    },
    {
      key: "balance",
      value: t("address.balance"),
    },
  ];

  const columns: TableColumns<AddressListItem> = [
    {
      key: "addresses",
      render: item => (
        <div className='flex items-center gap-1/2'>
          <AddressTypeInitialsBadge address={item?.address} />
          <AddressCell address={item?.address} stakeKey={stakeKey} />
        </div>
      ),
      title: t("address.addresses"),
      visible: true,
      widthPx: 170,
    },
    {
      key: "balance",
      render: item => <AdaWithTooltip data={item?.balance ?? 0} />,
      title: t("address.balance"),
      visible: true,
      widthPx: 70,
    },
    {
      key: "activity",
      render: item => <ActivityVisual count={item.activity} />,
      title: t("address.activity"),
      visible: true,
      widthPx: 50,
    },
    {
      key: "last_activity",
      render: item => <DateCell time={item.last} />,
      title: t("address.lastActivity"),
      visible: true,
      widthPx: 80,
    },
    {
      key: "tokens",
      render: item => <TokenSelectCombobox items={item.asset} />,
      title: t("address.tokens"),
      visible: true,
      widthPx: 110,
    },
  ];

  return (
    <div className='flex flex-col items-end gap-2'>
      <SortBy
        selectItems={selectItems}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem as any}
      />
      <GlobalTable
        type='infinite'
        itemsPerPage={10}
        currentPage={page ?? 1}
        totalItems={totalItems}
        rowHeight={65}
        scrollable
        minContentWidth={900}
        query={listQuery}
        items={data ? data.filter(addr => addr.address) : []}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof AddressDetailAdressesColumns) -
            columnsOrder.indexOf(b.key as keyof AddressDetailAdressesColumns)
          );
        })}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("table.noItems")}
      />
    </div>
  );
};
