import type { CommitteeMember } from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { useMemo } from "react";
import { Calendar, ExternalLink, UserMinus, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
        const sortedRegistrations = [...item.registration].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
        return <DateCell time={sortedRegistrations[0].time} />;
      },
      title: <p>Date</p>,
      visible: true,
      widthPx: 80,
    },
    {
      key: "type",
      render: item => {
        const hasRegistration = item?.registration && item.registration.length > 0;
        const hasDeregistration = item?.de_registration !== null && item?.de_registration !== undefined;

        if (hasDeregistration) {
          return (
            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
              <UserMinus size={12} className='text-[#f04438]' />
              <span className='text-nowrap text-text-xs font-medium'>
                Resignation
              </span>
            </div>
          );
        }

        if (hasRegistration) {
          return (
            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
              <UserPlus size={12} className='text-[#47CD89]' />
              <span className='text-nowrap text-text-xs font-medium'>
                Registration
              </span>
            </div>
          );
        }

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
            <Calendar size={12} className='text-[#FEC84B]' />
            <span className='text-nowrap text-text-xs font-medium'>
              Term expiration
            </span>
          </div>
        );
      },
      title: "Type",
      visible: true,
      widthPx: 110,
    },
    {
      key: "effective",
      render: item => {
        if (!item?.registration || item.registration.length === 0) {
          return "-";
        }
        const sortedRegistrations = [...item.registration].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
        const effectiveEpoch = sortedRegistrations[0].index;

        if (!effectiveEpoch) return "-";

        return (
          <div className='flex justify-start'>
            <EpochCell no={effectiveEpoch} />
          </div>
        );
      },
      title: <p>Effective</p>,
      visible: true,
      widthPx: 110,
    },
    {
      key: "expiration",
      render: item => {
        if (!item?.expiration_epoch) return "-";

        return (
          <div className='flex justify-start'>
            <EpochCell no={item.expiration_epoch} />
          </div>
        );
      },
      title: <p>Expiration</p>,
      visible: true,
      widthPx: 110,
    },
    {
      key: "tx",
      render: item => {
        if (item?.registration && item.registration.length > 0) {
          const sortedRegistrations = [...item.registration].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          );
          return (
            <Link
              to='/tx/$hash'
              params={{ hash: sortedRegistrations[0].hash }}
              className='flex items-center justify-end text-primary'
            >
              <ExternalLink size={18} />
            </Link>
          );
        }
        return <p className='text-right'>-</p>;
      },
      title: <p className='w-full text-right'>Tx</p>,
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
