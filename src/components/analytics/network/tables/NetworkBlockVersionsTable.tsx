import type { useFetchEpochAnalytics } from "@/services/analytics";
import type { FC } from "react";

import GlobalTable from "@/components/table/GlobalTable";

import { formatNumber } from "@/utils/format/format";

interface NetworkBlockVersionsTableProps {
  epochQuery: ReturnType<typeof useFetchEpochAnalytics>;
  sortedVersions: [string, number][] | [string, unknown][];
}

export const NetworkBlockVersionsTable: FC<NetworkBlockVersionsTableProps> = ({
  epochQuery,
  sortedVersions,
}) => {
  const totalCount = sortedVersions.reduce((a, b) => a + (b[1] as number), 0);

  const tableVersions = [
    {
      version: (
        <div className='flex items-center gap-1'>
          <span>{sortedVersions.length ? sortedVersions[0][0] : "-"}</span>
          <p className='rounded-s bg-[#079455] px-[6px] py-[2px] text-xs font-medium text-white'>
            Latest
          </p>
        </div>
      ),
      count: sortedVersions.length ? sortedVersions[0][1] : "-",
    },
    ...sortedVersions
      .slice(1)
      .map(item => ({
        version: <p>{item ? item[0] : "-"}</p>,
        count: item[1] as number,
      }))
      .filter(item => (100 * item.count) / totalCount > 1),
  ];

  const columns = [
    {
      key: "node_versions",
      render: item => item.version,
      title: <p>Node version</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "by_count",
      render: item => <p>{formatNumber(item.count)}</p>,
      title: <p>By Count</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  return (
    <GlobalTable
      type='default'
      totalItems={(tableVersions ?? []).length}
      itemsPerPage={20}
      rowHeight={69}
      scrollable
      query={epochQuery}
      items={tableVersions}
      columns={columns}
      minContentWidth={500}
    />
  );
};
