import type { OverviewList } from "@vellumlabs/cexplorer-sdk";
import type { CommitteeMember } from "@/types/governanceTypes";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { formatDistanceToNow, format } from "date-fns";

interface UseCCMemberDetailArgs {
  memberData: CommitteeMember | undefined;
}

interface UseCCMemberDetail {
  about: OverviewList;
}

export const useCCMemberDetail = ({
  memberData,
}: UseCCMemberDetailArgs): UseCCMemberDetail => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpochNo = miscConst?.epoch?.no ?? 0;

  const isActive =
    memberData?.expiration_epoch !== null &&
    memberData?.expiration_epoch !== undefined &&
    memberData.expiration_epoch > currentEpochNo;

  const expirationDate =
    memberData?.expiration_epoch && miscConst
      ? calculateEpochTimeByNumber(
          memberData.expiration_epoch,
          miscConst.epoch.no,
          miscConst.epoch.start_time,
        ).endTime
      : null;

  const about: OverviewList = [
    {
      label: "Name",
      value: memberData?.registry?.name ?? "-",
    },
    {
      label: "Status",
      value:
        typeof isActive === "undefined" ? (
          "-"
        ) : (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-m border border-border px-[10px]'>
            <PulseDot color={!isActive ? "bg-redText" : undefined} />
            <span className='text-text-xs font-medium'>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ),
    },
    {
      label: "Hash",
      value: memberData?.ident?.raw ? (
        <div className='flex items-center gap-1/2'>
          <span>{formatString(memberData.ident.raw, "long")}</span>
          <Copy copyText={memberData.ident.raw} className='translate-y-[2px]' />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: "Cold key",
      value: memberData?.ident?.cold ? (
        <div className='flex items-center gap-1/2'>
          <span>{formatString(memberData.ident.cold, "long")}</span>
          <Copy
            copyText={memberData.ident.cold}
            className='translate-y-[2px]'
          />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: "Hot key",
      value: memberData?.ident?.hot ? (
        <div className='flex items-center gap-1/2'>
          <span>{formatString(memberData.ident.hot, "long")}</span>
          <Copy copyText={memberData.ident.hot} className='translate-y-[2px]' />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: "Expiring",
      value:
        expirationDate && memberData?.expiration_epoch ? (
          <span>
            In {formatDistanceToNow(expirationDate)} (
            {format(expirationDate, "dd/MM/yyyy, HH:mm")})
          </span>
        ) : (
          "-"
        ),
    },
  ];

  return { about };
};
