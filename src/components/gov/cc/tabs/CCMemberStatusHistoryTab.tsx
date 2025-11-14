import type { CommitteeMember } from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

interface CCMemberStatusHistoryTabProps {
  memberHistory: CommitteeMember[] | undefined;
  isLoading: boolean;
}

export const CCMemberStatusHistoryTab: FC<CCMemberStatusHistoryTabProps> = ({
  memberHistory,
  isLoading,
}) => {
  const sortedHistory = useMemo(() => {
    if (!memberHistory || !Array.isArray(memberHistory)) return [];
    return [...memberHistory].sort(
      (a, b) => (b.expiration_epoch ?? 0) - (a.expiration_epoch ?? 0),
    );
  }, [memberHistory]);

  const columns: TableColumns<CommitteeMember> = [
    {
      key: "date",
      render: item => {
        if (!item?.registration || item.registration.length === 0) {
          return "-";
        }
        // Get the first registration (sorted by time if multiple)
        const sortedRegistrations = [...item.registration].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        return <DateCell time={sortedRegistrations[0].time} />;
      },
      title: <p>Date</p>,
      visible: true,
      widthPx: 80,
    },
    {
      key: "type",
      render: () => <span>Constitutional Committee</span>,
      title: "Type",
      visible: true,
      widthPx: 110,
    },
    {
      key: "effective",
      render: () => {
        // Effective epoch data not available in API response
        return "-";
      },
      title: "Effective",
      visible: true,
      widthPx: 110,
    },
    {
      key: "expiration",
      render: item => {
        if (!item?.expiration_epoch) return "-";

        return (
          <Link
            to='/epoch/$no'
            params={{ no: String(item.expiration_epoch) }}
            className='text-primary'
          >
            {item.expiration_epoch}
          </Link>
        );
      },
      title: "Expiration",
      visible: true,
      widthPx: 110,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.registration || item.registration.length === 0) {
          return "-";
        }
        // Get the first registration (sorted by time if multiple)
        const sortedRegistrations = [...item.registration].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        return <HashCell hash={sortedRegistrations[0].hash} />;
      },
      title: <p>Tx</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  const mockQuery = useMemo(
    () => ({
      data: sortedHistory,
      isLoading,
      isError: false,
      error: null,
      refetch: () => Promise.resolve({} as any),
    }),
    [sortedHistory, isLoading],
  );

  return (
    <GlobalTable
      type='default'
      itemsPerPage={10}
      rowHeight={60}
      scrollable
      query={mockQuery as any}
      items={sortedHistory}
      columns={columns}
    />
  );
};
