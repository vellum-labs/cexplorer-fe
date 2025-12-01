import type { CommitteeMember } from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { Copy } from "@vellumlabs/cexplorer-sdk";
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

      member.registration.forEach(reg => {
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
      key: "tx_hash",
      render: item => {
        if (!item?.hash) {
          return "-";
        }
        return <HashCell hash={item.hash} />;
      },
      title: "Transaction Hash",
      visible: true,
      widthPx: 110,
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
