import type { AssetMint } from "@/types/assetsTypes";
import type { AssetMintColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Copy, formatNumber, Tooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useFetchAssetMint } from "@/services/assets";
import { useAssetDetailMintTableStore } from "@/stores/tables/assetDetailMintTableStore";

import { Badge } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { PolicyCell } from "@/components/policy/PolicyCell";
import ExportButton from "@/components/table/ExportButton";
import { assetDetailMintTableOptions } from "@/constants/tables/assetDetailMintOptions";
import {
  formatNumberWithSuffix,
  formatString,
} from "@vellumlabs/cexplorer-sdk";
import AssetCell from "../AssetCell";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation("common");
  const assetname = policy && name ? policy + name : undefined;
  const { page } = useSearch({
    from: policyId ? "/policy/$policyId" : "/asset/$fingerprint",
  });

  const [totalItems, setTotalItems] = useState(0);

  const {
    columnsOrder,
    setColumsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setRows,
  } = useAssetDetailMintTableStore();

  const mintQuery = useFetchAssetMint(
    rows,
    (page ?? 1) * rows - rows,
    assetname,
    policyId,
  );

  const totalMints = mintQuery.data?.pages[0]?.data?.count;
  const items = mintQuery.data?.pages.flatMap(p => p?.data?.data ?? []);

  useEffect(() => {
    if (totalMints !== undefined && totalMints !== totalItems) {
      setTotalItems(totalMints);
    }
  }, [totalMints, totalItems]);

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
          return <Badge color='blue'>{t("labels.token")}</Badge>;
        }

        return <Badge color='yellow'>{t("labels.nft")}</Badge>;
      },
      title: t("asset.type"),
      visible: columnsVisibility.type,
      widthPx: 50,
    },
    {
      key: "asset",
      render: item => {
        const fullAssetName =
          item?.asset?.policy && item?.asset?.name
            ? item.asset.policy + item.asset.name
            : assetname || "";
        return (
          <AssetCell
            asset={{
              name: fullAssetName,
              quantity: item?.quantity || 0,
            }}
          />
        );
      },
      title: t("asset.asset"),
      visible: columnsVisibility.asset,
      widthPx: 130,
    },
    {
      key: "policy_id",
      render: item => <PolicyCell policyId={item?.asset?.policy} />,
      title: t("asset.policyId"),
      visible: columnsVisibility.policy_id,
      widthPx: 100,
    },
    {
      key: "asset_minted",
      render: item => <DateCell time={item?.tx?.time ?? ""} />,
      title: t("asset.assetMinted"),
      visible: columnsVisibility.asset_minted,
      widthPx: 60,
    },
    {
      key: "mint_quantity",
      render: item => {
        const decimals = item?.asset.registry?.decimals ?? 0;
        const value = item?.quantity ?? 0;
        const adjusted = value / Math.pow(10, decimals);
        const formattedFull = formatNumber(adjusted.toFixed(2));
        const formattedShort = formatNumberWithSuffix(
          parseFloat(adjusted.toFixed(2)),
        );

        return (
          <div className='flex w-full justify-end'>
            <Tooltip content={formattedFull}>
              <span className='text-text-sm'>{formattedShort}</span>
            </Tooltip>
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("asset.mintQuantity")}</p>,
      visible: columnsVisibility.mint_quantity,
      widthPx: 100,
    },
    {
      key: "tx",
      render: item => (
        <div className='flex justify-end'>
          <Link
            to='/tx/$hash'
            params={{ hash: item?.tx?.hash }}
            className='flex items-center gap-1 text-primary'
          >
            <span>{formatString(item?.tx?.hash, "long")}</span>
            <Copy copyText={item?.tx?.hash} className='translate-y-[2px]' />
          </Link>
        </div>
      ),
      title: <p className='w-full text-right'>{t("labels.tx")}</p>,
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
          rowsLabel={t("table.rows")}
          columnsOptions={assetDetailMintTableOptions.map(item => {
            return {
              label: t(`common:tableSettings.${item.key}`),
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            };
          })}
        />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={mintQuery}
        items={items}
        columns={
          columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof AssetMintColumns) -
              columnsOrder.indexOf(b.key as keyof AssetMintColumns)
            );
          }) as any
        }
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("table.noItems")}
      />
    </>
  );
};
