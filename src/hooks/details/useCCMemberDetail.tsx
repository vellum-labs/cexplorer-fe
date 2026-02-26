import type { OverviewList } from "@vellumlabs/cexplorer-sdk";
import type {
  CommitteeMember,
  CommitteeMemberRegistration,
} from "@/types/governanceTypes";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchEpochDetailParam } from "@/services/epoch";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { formatDistanceToNow, format } from "date-fns";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { Link } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const getFirstRegistration = (
  reg: CommitteeMemberRegistration | CommitteeMemberRegistration[] | null,
): CommitteeMemberRegistration | null => {
  if (!reg) return null;
  if (Array.isArray(reg)) return reg[0] ?? null;
  return reg;
};

interface UseCCMemberDetailArgs {
  memberData: CommitteeMember | undefined;
  lastVoteTime?: string;
}

interface UseCCMemberDetail {
  about: OverviewList;
  governance: OverviewList;
}

export const useCCMemberDetail = ({
  memberData,
  lastVoteTime,
}: UseCCMemberDetailArgs): UseCCMemberDetail => {
  const { t } = useAppTranslation();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);
  const currentEpochNo = miscConst?.epoch?.no ?? 0;

  const expirationEpoch = memberData?.expiration_epoch ?? 0;
  const epochParamQuery = useFetchEpochDetailParam(currentEpochNo);
  const committeeMaxTermLength =
    epochParamQuery.data?.committee_max_term_length ?? 0;

  const deReg = getFirstRegistration(memberData?.de_registration ?? null);
  const isRetired = deReg ? new Date(deReg.time) <= new Date() : false;

  const isActive =
    !isRetired &&
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

  const name = memberData?.registry?.name ?? "-";
  const identRaw = memberData?.ident?.raw ?? "";

  const fallbackletters = [...name]
    .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
    .join("");

  const startEpoch = expirationEpoch - committeeMaxTermLength;

  const about: OverviewList = [
    {
      label: t("gov.cc.name"),
      value: (
        <div className='flex items-center gap-2'>
          <Image
            src={generateImageUrl(identRaw, "ico", "cc")}
            type='user'
            className='h-8 w-8 rounded-max'
            height={32}
            width={32}
            fallbackletters={fallbackletters}
          />
          <span>{name}</span>
        </div>
      ),
    },
    {
      label: t("gov.cc.status"),
      value:
        typeof isActive === "undefined" ? (
          "-"
        ) : (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-m border border-border px-[10px]'>
            <PulseDot color={!isActive ? "bg-redText" : undefined} />
            <span className='text-text-xs font-medium'>
              {isActive
                ? t("gov.cc.active")
                : isRetired
                  ? t("gov.cc.retired")
                  : t("gov.cc.inactive")}
            </span>
          </div>
        ),
    },
    {
      label: t("gov.cc.termDuration"),
      value:
        startEpoch > 0 && expirationEpoch > 0 ? (
          <div className='flex items-center gap-1'>
            <Link
              to='/epoch/$no'
              params={{ no: String(startEpoch) }}
              className='text-primary'
            >
              {startEpoch}
            </Link>
            <span>-</span>
            <Link
              to='/epoch/$no'
              params={{ no: String(expirationEpoch) }}
              className='text-primary'
            >
              {expirationEpoch}
            </Link>
          </div>
        ) : (
          "-"
        ),
    },
    {
      label: t("gov.cc.coldKey"),
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
      label: t("gov.cc.hotKey"),
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
      label: t("gov.cc.expiring"),
      value:
        expirationDate && memberData?.expiration_epoch ? (
          <span>
            {t("gov.cc.in")} {formatDistanceToNow(expirationDate)} (
            {format(expirationDate, "dd/MM/yyyy, HH:mm")})
          </span>
        ) : (
          "-"
        ),
    },
  ];

  const statVotes = memberData?.stat?.votes ?? [];
  const voteCounts: Record<string, number> = {};
  for (const v of statVotes) {
    voteCounts[v.vote] = v.count;
  }
  const totalVotes = statVotes.reduce((sum, v) => sum + v.count, 0);

  const governance: OverviewList = [
    {
      label: undefined,
      value: (() => {
        const calc = (type: "Yes" | "Abstain" | "No") =>
          totalVotes > 0 ? ((voteCounts[type] ?? 0) / totalVotes) * 100 : 0;

        return (
          <div className='flex h-full w-full flex-col gap-3'>
            <div className='flex flex-col gap-2'>
              {lastVoteTime && (
                <div className='flex w-full items-center gap-2'>
                  <span className='min-w-[90px] text-text-sm text-grayTextSecondary'>
                    {t("gov.cc.lastVote")}
                  </span>
                  <TimeDateIndicator time={lastVoteTime} />
                </div>
              )}
              <div className='flex w-full items-center gap-2'>
                <span className='min-w-[90px] text-text-sm text-grayTextSecondary'>
                  {t("gov.cc.totalVotes")}
                </span>
                <span className='text-text-sm text-grayTextPrimary'>
                  {totalVotes}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              {["Yes", "Abstain", "No"].map(vote => {
                const votePercent = calc(vote as any).toFixed(2);
                const color =
                  vote === "Yes"
                    ? "#47CD89"
                    : vote === "Abstain"
                      ? "#FEC84B"
                      : "#f04438";

                const voteCount = voteCounts[vote] ?? 0;

                const voteLabel =
                  vote === "Yes"
                    ? t("governance.common.yes")
                    : vote === "Abstain"
                      ? t("governance.common.abstain")
                      : t("governance.common.no");

                return (
                  <div
                    className='flex items-center justify-between gap-1'
                    key={vote}
                  >
                    <span className='min-w-24 text-text-sm text-grayTextPrimary'>
                      {voteLabel} ({voteCount})
                    </span>
                    <div className='relative h-2 w-2/3 overflow-hidden rounded-[4px] bg-[#E4E7EC]'>
                      <span
                        className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px]'
                        style={{
                          width: `${votePercent}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className='flex min-w-[55px] items-end text-text-sm text-grayTextPrimary'>
                      {votePercent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })(),
    },
  ];

  return { about, governance };
};
