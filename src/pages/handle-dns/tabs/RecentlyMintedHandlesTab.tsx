import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { useFetchAssetList } from "@/services/assets";
import { adaHandlePolicy } from "@/constants/confVariables";

const ITEMS_PER_PAGE = 20;

export const RecentlyMintedHandlesTab: FC = () => {
  const { page } = useSearch({ from: "/handle-dns/" });
  const offset = ((page ?? 1) - 1) * ITEMS_PER_PAGE;

  const query = useFetchAssetList(
    ITEMS_PER_PAGE,
    offset,
    undefined,
    undefined,
    "mint",
    adaHandlePolicy,
    "desc",
    undefined,
    undefined,
  );

  const items =
    query.data?.pages?.flatMap(page => page?.data?.data ?? []) ?? [];
  const totalItems = query.data?.pages?.[0]?.data?.count ?? 0;

  const columns = [
    {
      key: "handle",
      render: item => {
        const nameOnly = item.name?.slice(56) ?? "";
        const handleName = encodeAssetName(nameOnly);
        return (
          <Link
            to='/asset/$fingerprint'
            params={{ fingerprint: item.stat?.asset?.fingerprint ?? "" }}
            className='text-primary'
          >
            ${handleName}
          </Link>
        );
      },
      title: "Handle",
      visible: true,
      widthPx: 200,
    },
    {
      key: "first_mint",
      render: item =>
        item.stat?.asset?.first_mint ? (
          <TimeDateIndicator time={item.stat.asset.first_mint} />
        ) : (
          "-"
        ),
      title: "Minted",
      visible: true,
      widthPx: 180,
    },
  ];

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={ITEMS_PER_PAGE}
      rowHeight={50}
      minContentWidth={400}
      scrollable
      query={query}
      items={items}
      columns={columns}
    />
  );
};
