import type { CommitteeMember } from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";

interface CCMemberHotKeysTabProps {
  memberHistory: CommitteeMember[] | undefined;
  isLoading: boolean;
}

interface RegistrationWithHotKey {
  hash: string;
  time: string;
  hotKey: string;
}

export const CCMemberHotKeysTab: FC<CCMemberHotKeysTabProps> = ({
  memberHistory,
  isLoading,
}) => {
  const sortedRegistrations = useMemo(() => {
    if (!memberHistory || !Array.isArray(memberHistory)) return [];

    const allRegistrations: RegistrationWithHotKey[] = [];
    const seenHashes = new Set<string>();

    memberHistory.forEach(member => {
      const hotKey = member.ident?.hot;
      if (!hotKey || !member.registration) return;

      const registrations = Array.isArray(member.registration)
        ? member.registration
        : [member.registration];

      registrations.forEach(reg => {
        if (!seenHashes.has(reg.hash)) {
          seenHashes.add(reg.hash);
          allRegistrations.push({
            hash: reg.hash,
            time: reg.time,
            hotKey: hotKey,
          });
        }
      });
    });

    return allRegistrations.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
  }, [memberHistory]);

  const columns: TableColumns<RegistrationWithHotKey> = [
    {
      key: "type",
      render: item => {
        if (!item?.time) {
          return "-";
        }
        return <DateCell time={item.time} />;
      },
      title: <p>Date</p>,
      visible: true,
      widthPx: 80,
    },
    {
      key: "hot_key",
      render: item => {
        if (!item?.hotKey) {
          return "-";
        }
        return (
          <div className='flex items-center gap-1'>
            <span className='break-all'>{item.hotKey}</span>
            <Copy copyText={item.hotKey} size={13} />
          </div>
        );
      },
      title: "Hot key authorization",
      visible: true,
      widthPx: 200,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.hash) {
          return <p className='text-right'>-</p>;
        }
        return (
          <Link
            to='/tx/$hash'
            params={{ hash: item.hash }}
            className='flex items-center justify-end text-primary'
          >
            <ExternalLink size={18} />
          </Link>
        );
      },
      title: <p className='w-full text-right'>Tx</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  const mockQuery = useMemo(
    () => ({
      data: sortedRegistrations,
      isLoading,
      isError: false,
      error: null,
      refetch: () => Promise.resolve({} as any),
    }),
    [sortedRegistrations, isLoading],
  );

  return (
    <GlobalTable
      type='default'
      itemsPerPage={10}
      rowHeight={60}
      scrollable
      query={mockQuery as any}
      items={sortedRegistrations}
      columns={columns}
    />
  );
};
