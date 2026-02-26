import type {
  CommitteeMember,
  CommitteeMemberRegistration,
} from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { useMemo } from "react";
import { Calendar, ExternalLink, UserMinus, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const toArray = (
  reg: CommitteeMemberRegistration | CommitteeMemberRegistration[] | null,
): CommitteeMemberRegistration[] => {
  if (!reg) return [];
  if (Array.isArray(reg)) return reg;
  return [reg];
};

interface StatusHistoryRow {
  type: "registration" | "de_registration";
  record: CommitteeMemberRegistration;
  expiration_epoch: number | null;
}

interface CCMemberStatusHistoryTabProps {
  memberHistory: CommitteeMember[] | undefined;
  isLoading: boolean;
}

export const CCMemberStatusHistoryTab: FC<CCMemberStatusHistoryTabProps> = ({
  memberHistory,
  isLoading,
}) => {
  const { t } = useAppTranslation();

  const rows = useMemo(() => {
    if (!memberHistory || !Array.isArray(memberHistory)) return [];

    const result: StatusHistoryRow[] = [];

    for (const member of memberHistory) {
      const registrations = toArray(member.registration);
      for (const reg of registrations) {
        result.push({
          type: "registration",
          record: reg,
          expiration_epoch: member.expiration_epoch,
        });
      }

      const deRegistrations = toArray(member.de_registration);
      for (const deReg of deRegistrations) {
        result.push({
          type: "de_registration",
          record: deReg,
          expiration_epoch: member.expiration_epoch,
        });
      }
    }

    return result.sort(
      (a, b) =>
        new Date(b.record.time).getTime() - new Date(a.record.time).getTime(),
    );
  }, [memberHistory]);

  const columns: TableColumns<StatusHistoryRow> = [
    {
      key: "date",
      render: item => {
        return <DateCell time={item.record.time} />;
      },
      title: <p>{t("gov.cc.date")}</p>,
      visible: true,
      widthPx: 80,
    },
    {
      key: "type",
      render: item => {
        if (item.type === "de_registration") {
          return (
            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
              <UserMinus size={12} className='text-[#f04438]' />
              <span className='text-nowrap text-text-xs font-medium'>
                {t("gov.cc.resignation")}
              </span>
            </div>
          );
        }

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
            <UserPlus size={12} className='text-[#47CD89]' />
            <span className='text-nowrap text-text-xs font-medium'>
              {t("gov.cc.registration")}
            </span>
          </div>
        );
      },
      title: t("gov.cc.type"),
      visible: true,
      widthPx: 110,
    },
    {
      key: "effective",
      render: item => {
        const effectiveEpoch = item.record.epoch_no;
        if (!effectiveEpoch) return "-";

        return (
          <div className='flex justify-start'>
            <EpochCell no={effectiveEpoch} />
          </div>
        );
      },
      title: <p>{t("gov.cc.effective")}</p>,
      visible: true,
      widthPx: 110,
    },
    {
      key: "expiration",
      render: item => {
        if (!item.expiration_epoch) return "-";

        return (
          <div className='flex justify-start'>
            <EpochCell no={item.expiration_epoch} />
          </div>
        );
      },
      title: <p>{t("gov.cc.expiration")}</p>,
      visible: true,
      widthPx: 110,
    },
    {
      key: "tx",
      render: item => {
        return (
          <Link
            to='/tx/$hash'
            params={{ hash: item.record.hash }}
            className='flex items-center justify-end text-primary'
          >
            <ExternalLink size={18} />
          </Link>
        );
      },
      title: <p className='w-full text-right'>{t("gov.cc.tx")}</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  const mockQuery = useMemo(
    () => ({
      data: rows,
      isLoading,
      isError: false,
      error: null,
      refetch: () => Promise.resolve({} as any),
    }),
    [rows, isLoading],
  );

  return (
    <GlobalTable
      type='default'
      itemsPerPage={10}
      rowHeight={60}
      scrollable
      query={mockQuery as any}
      items={rows}
      columns={columns}
      renderDisplayText={(count, total) =>
        t("table.displaying", { count, total })
      }
      noItemsLabel={t("table.noItems")}
    />
  );
};
