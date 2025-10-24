import type { AssetMint } from "@/types/assetsTypes";
import type { AssetMintColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";

import { useFetchAssetMint } from "@/services/assets";
import { useAssetDetailMintTableStore } from "@/stores/tables/assetDetailMintTableStore";

import { Badge } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { PolicyCell } from "@/components/policy/PolicyCell";
import ExportButton from "@/components/table/ExportButton";
import { assetDetailMintTableOptions } from "@/constants/tables/assetDetailMintOptions";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import AssetCell from "../AssetCell";

interface AssetMintTabProps {
  name?: number;
  policy?: string;
  policyId?: string;
}

export const AssetMintTab: FC<AssetMintTabProps> = ({
  name,
  policy,
  policyId,
}) => {
  const assetname = policy && name ? policy + name : undefined;
  const mintQuery = useFetchAssetMint(assetname, policyId);

  const {
    columnsOrder,
    setColumsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setRows,
  } = useAssetDetailMintTableStore();

  const { data } = mintQuery;

  const items = data?.data?.data;

  const columns: TableColumns<AssetMint> = [
    {
      key: "order",
      render: () => <></>,
      title: "#",
      visible: columnsVisibility.order,
      standByRanking: true,
      widthPx: 10,
    },
    {
      key: "type",
      render: item => {
        if (item?.quantity > 1) {
          return <Badge color='blue'>Token</Badge>;
        }

        return <Badge color='yellow'>NFT</Badge>;
      },
      title: "Type",
      visible: columnsVisibility.type,
      widthPx: 50,
    },
    {
      key: "asset",
      render: () => {
        return <AssetCell name={assetname || ""} />;
      },
      title: "Asset",
      visible: columnsVisibility.asset,
      widthPx: 130,
    },
    {
      key: "policy_id",
      render: item => <PolicyCell policyId={item?.asset?.policy} />,
      title: "Policy ID",
      visible: columnsVisibility.policy_id,
      widthPx: 100,
    },
    {
      key: "asset_minted",
      render: item => <DateCell time={item?.tx?.time ?? ""} />,
      title: "Asset Minted",
      visible: columnsVisibility.asset_minted,
      widthPx: 60,
    },
    {
      key: "mint_quantity",
      render: item => (
        <p className={`text-right`}>{formatNumber(item?.quantity) ?? "-"}</p>
      ),
      title: <p className='w-full text-right'>Mint Quantity</p>,
      visible: columnsVisibility.mint_quantity,
      widthPx: 100,
    },
    {
      key: "tx",
      render: item => (
        <Link
          to='/tx/$hash'
          params={{ hash: item?.tx?.hash }}
          className='flex items-center gap-1 text-primary'
        >
          <span>{formatString(item?.tx?.hash, "long")}</span>
          <Copy copyText={item?.tx?.hash} className='translate-y-[2px]' />
        </Link>
      ),
      title: "Tx",
      visible: columnsVisibility.tx,
      widthPx: 100,
    },
  ];

  return (
    <>
      <div className='mb-2 ml-auto flex w-fit gap-1'>
        <ExportButton columns={columns} items={items} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          columnsOptions={assetDetailMintTableOptions.map(item => {
            return {
              label: item.name,
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            };
          })}
        />
      </div>
      <GlobalTable
        type='default'
        totalItems={(items || []).length}
        itemsPerPage={items?.length}
        scrollable
        query={mintQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof AssetMintColumns) -
            columnsOrder.indexOf(b.key as keyof AssetMintColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
