import AddressCell from "@/components/address/AddressCell";
import AssetLink from "@/components/asset/AssetLink";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetail } from "@/services/tx";
import type { TableColumns } from "@/types/tableTypes";
import type { TxInfo } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "../HashCell";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const CollateralTabItem = () => {
  const { t } = useAppTranslation("common");
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);

  const uniqueInputs = query?.data?.data?.collateral_inputs?.filter(
    (input, index, arr) => {
      return index === arr.findIndex(i => i.tx_hash === input.tx_hash);
    },
  );

  const columns: TableColumns<TxInfo> = [
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1/2'>
          <AddressTypeInitialsBadge address={item.payment_addr_bech32} />
          <AddressCell address={item.payment_addr_bech32} />
        </div>
      ),
      title: t("tx.columns.address"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "tx_hash",
      render: item => <HashCell hash={item.tx_hash} />,
      title: t("tx.columns.transaction"),
      visible: true,
      widthPx: 80,
    },
    {
      key: "value",
      render: item => (
        <span className='flex justify-end text-right'>
          <AdaWithTooltip data={item.value} />
        </span>
      ),
      title: (
        <span className='flex w-full justify-end'>
          {t("tx.columns.collateral")}
        </span>
      ),
      visible: true,
      widthPx: 80,
    },
    {
      key: "asset",
      render: item => (
        <span className='flex justify-end gap-1/2 text-right'>
          {item.asset?.map(asset => (
            <AssetLink
              type={"input"}
              asset={asset}
              className='min-w-[110px] max-w-[110px]'
            />
          ))}
        </span>
      ),
      title: (
        <span className='flex w-full justify-end'>
          {t("tx.columns.assets")}
        </span>
      ),
      visible: true,
      widthPx: 100,
    },
  ];

  if (!uniqueInputs && !query.isLoading) {
    return (
      <p className='w-full text-center text-text-sm'>
        {t("tx.noCollateralFound")}
      </p>
    );
  }

  if (query.isLoading) {
    return <LoadingSkeleton height='100px' rounded='xl' />;
  }

  return (
    <GlobalTable
      type='default'
      columns={columns}
      query={query}
      items={uniqueInputs}
      totalItems={uniqueInputs?.length ?? 0}
      scrollable
      minContentWidth={800}
      renderDisplayText={(count, total) =>
        t("table.displaying", { count, total })
      }
      noItemsLabel={t("table.noItems")}
    />
  );
};

export default CollateralTabItem;
