import type { AssetMint } from "@/types/assetsTypes";
import type { StablecoinData } from "@/types/stablecoinTypes";
import type { AssetMintColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import AssetCell from "@/components/asset/AssetCell";
import { PolicyCell } from "@/components/policy/PolicyCell";
import ExportButton from "@/components/table/ExportButton";
import { assetDetailMintTableOptions } from "@/constants/tables/assetDetailMintOptions";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAssetDetail, useFetchAssetMint } from "@/services/assets";
import { useAssetDetailMintTableStore } from "@/stores/tables/assetDetailMintTableStore";
import { generateImageUrl } from "@/utils/generateImageUrl";
import {
  Badge,
  Copy,
  DateCell,
  formatNumber,
  formatNumberWithSuffix,
  formatString,
  GlobalTable,
  Image,
  LoadingSkeleton,
  TableSettingsDropdown,
  Tooltip,
} from "@vellumlabs/cexplorer-sdk";

interface StablecoinMintTableProps {
  stablecoins: StablecoinData[];
}

export const StablecoinMintTable: FC<StablecoinMintTableProps> = ({
  stablecoins,
}) => {
  const { t } = useAppTranslation();
  const { page } = useSearch({ from: "/stablecoin-dashboard/" });
  const navigate = useNavigate();

  const sortedStablecoins = [...stablecoins].sort((a, b) => {
    const supplyA = a.quantity / 10 ** (a.registry?.decimals ?? 0);
    const supplyB = b.quantity / 10 ** (b.registry?.decimals ?? 0);
    return supplyB - supplyA;
  });

  const [selectedFingerprint, setSelectedFingerprint] = useState(
    sortedStablecoins[0]?.fingerprint ?? "",
  );
  const [totalItems, setTotalItems] = useState(0);

  const {
    columnsOrder,
    setColumsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setRows,
  } = useAssetDetailMintTableStore();

  const assetDetailQuery = useFetchAssetDetail(selectedFingerprint, {
    enabled: !!selectedFingerprint,
  });
  const policy = assetDetailQuery.data?.data?.policy ?? "";
  const name = assetDetailQuery.data?.data?.name ?? "";
  const assetname = policy && name ? policy + name : undefined;

  const mintQuery = useFetchAssetMint(
    rows,
    (page ?? 1) * rows - rows,
    assetname,
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
        const qty = item?.quantity ?? 0;
        if (qty === 1 || qty === -1) {
          return <Badge color='yellow'>{t("labels.nft")}</Badge>;
        }
        return <Badge color='blue'>{t("labels.token")}</Badge>;
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
        const decimals = item?.asset?.registry?.decimals ?? 0;
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
      widthPx: 80,
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
      widthPx: 110,
    },
  ];

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-3 flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-3'>
        <div className='order-last flex w-full gap-2 overflow-x-auto md:order-none md:w-auto md:flex-1'>
          {sortedStablecoins.map(sc => {
            const isSelected = sc.fingerprint === selectedFingerprint;
            const btn = (
              <button
                key={sc.fingerprint}
                type='button'
                onClick={() => {
                  setSelectedFingerprint(sc.fingerprint);
                  navigate({ search: { page: 1 } });
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-m border px-3 py-1.5 text-text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "hover:border-primary/50 border-border bg-cardBg text-grayTextPrimary"
                }`}
              >
                <Image
                  type='asset'
                  height={20}
                  width={20}
                  className='rounded-sm aspect-square h-[20px] w-[20px] shrink-0'
                  src={generateImageUrl(sc.fingerprint, "sm", "nft")}
                  fallbackletters={(sc.registry?.ticker ?? "??").slice(0, 2)}
                />
                <span className='font-medium'>
                  {sc.registry?.ticker ?? sc.fingerprint.slice(0, 10)}
                </span>
              </button>
            );
            if (sc.source !== "native") {
              return (
                <Tooltip key={sc.fingerprint} content={`${t("stablecoinDashboard.source")}: ${sc.source.charAt(0).toUpperCase() + sc.source.slice(1)}`}>
                  {btn}
                </Tooltip>
              );
            }
            return btn;
          })}
        </div>
        <div className='ml-auto flex shrink-0 items-center gap-1'>
          <ExportButton columns={columns} items={items} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            rowsLabel={t("table.rows")}
            columnsOptions={assetDetailMintTableOptions.map(item => ({
              label: t(`common:tableSettings.${item.key}`),
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            }))}
          />
        </div>
      </div>

      {assetDetailQuery.isLoading || mintQuery.isLoading ? (
        <LoadingSkeleton width='100%' height='300px' rounded='xl' />
      ) : (
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={mintQuery}
          items={items}
          minContentWidth={900}
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
      )}
    </div>
  );
};
