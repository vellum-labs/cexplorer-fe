import type { StablecoinData } from "@/types/stablecoinTypes";
import type { StablecoinSummaryColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

import ExportButton from "@/components/table/ExportButton";
import { stablecoinSummaryTableOptions } from "@/constants/tables/stablecoinSummaryOptions";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useStablecoinSummaryTableStore } from "@/stores/tables/stablecoinSummaryTableStore";
import { generateImageUrl } from "@/utils/generateImageUrl";
import {
  Badge,
  Copy,
  DateCell,
  formatNumber,
  formatString,
  GlobalTable,
  Image,
  TableSettingsDropdown,
} from "@vellumlabs/cexplorer-sdk";

interface StablecoinSummaryTableProps {
  stablecoins: StablecoinData[];
}

export const StablecoinSummaryTable: FC<StablecoinSummaryTableProps> = ({
  stablecoins,
}) => {
  const { t } = useAppTranslation();

  const {
    columnsOrder,
    setColumsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setRows,
  } = useStablecoinSummaryTableStore();

  const totalSupply = stablecoins.reduce((sum, sc) => {
    const decimals = sc.registry?.decimals ?? 0;
    return sum + sc.quantity / 10 ** decimals;
  }, 0);

  const items = useMemo(
    () =>
      [...stablecoins]
        .map(sc => {
          const decimals = sc.registry?.decimals ?? 0;
          const supply = sc.quantity / 10 ** decimals;
          const dominance =
            totalSupply > 0 ? (supply / totalSupply) * 100 : 0;
          return { ...sc, supply, dominance };
        })
        .sort((a, b) => b.supply - a.supply),
    [stablecoins, totalSupply],
  );

  type SummaryItem = (typeof items)[number];

  const mockQuery = useMemo(
    () =>
      ({
        data: {
          pages: [
            {
              data: {
                data: items,
                count: items.length,
              },
            },
          ],
        },
        isLoading: false,
        isFetching: false,
        isError: false,
      }) as any,
    [items],
  );

  const columns = [
    {
      key: "source",
      title: t("stablecoinDashboard.source"),
      visible: columnsVisibility.source,
      widthPx: 80,
      render: (item: SummaryItem) => (
        <Badge color={item.source === "native" ? "gray" : "blue"}>
          {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
        </Badge>
      ),
    },
    {
      key: "stablecoin",
      title: t("stablecoinDashboard.stablecoin"),
      visible: columnsVisibility.stablecoin,
      widthPx: 200,
      render: (item: SummaryItem) => (
        <Link
          to='/asset/$fingerprint'
          params={{ fingerprint: item.fingerprint }}
          className='flex items-center gap-2'
        >
          <Image
            type='asset'
            height={32}
            width={32}
            className='rounded-lg aspect-square h-[32px] w-[32px] shrink-0'
            src={generateImageUrl(item.fingerprint, "sm", "nft")}
            fallbackletters={(item.registry?.ticker ?? "??").slice(0, 2)}
          />
          <div className='flex flex-col'>
            <span className='text-text-sm font-medium text-primary'>
              {item.registry?.ticker ?? item.fingerprint.slice(0, 10)}
            </span>
            <div className='flex items-center gap-1'>
              <span className='text-text-xs text-grayTextPrimary'>
                {formatString(item.fingerprint, "long")}
              </span>
              <Copy copyText={item.fingerprint} size={12} />
            </div>
          </div>
        </Link>
      ),
    },
    {
      key: "supply",
      title: t("stablecoinDashboard.supply"),
      visible: columnsVisibility.supply,
      widthPx: 120,
      render: (item: SummaryItem) => (
        <span className='text-text-sm'>
          {formatNumber(item.supply.toFixed(2))}
        </span>
      ),
    },
    {
      key: "dominance",
      title: t("stablecoinDashboard.dominance"),
      visible: columnsVisibility.dominance,
      widthPx: 100,
      render: (item: SummaryItem) => (
        <span className='text-text-sm'>{item.dominance.toFixed(2)}%</span>
      ),
    },
    {
      key: "last_mint",
      title: t("stablecoinDashboard.lastMint"),
      visible: columnsVisibility.last_mint,
      widthPx: 120,
      render: (item: SummaryItem) => (
        <DateCell time={item.last_mint ?? ""} />
      ),
    },
  ];

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-3 ml-auto flex shrink-0 items-center gap-1'>
        <ExportButton columns={columns} items={items} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          rowsLabel={t("table.rows")}
          columnsOptions={stablecoinSummaryTableOptions.map(item => ({
            label: t(`common:tableSettings.${item.key}`),
            isVisible: columnsVisibility[item.key],
            onClick: () =>
              setColumnVisibility(item.key, !columnsVisibility[item.key]),
          }))}
        />
      </div>
      <GlobalTable
        type='default'
        pagination={false}
        scrollable
        query={mockQuery}
        items={items}
        minContentWidth={700}
        columns={
          columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof StablecoinSummaryColumns) -
              columnsOrder.indexOf(b.key as keyof StablecoinSummaryColumns)
            );
          }) as any
        }
        onOrderChange={setColumsOrder}
        disableDrag
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("table.noItems")}
      />
    </div>
  );
};
