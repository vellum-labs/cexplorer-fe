import type { FC } from "react";
import { useState } from "react";
import type { GovernanceVote } from "@/types/governanceTypes";
import { GovernanceRole } from "@/types/governanceTypes";

import {
  ActionTypes as ActionTypesComponent,
  type ActionTypes,
} from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Landmark, Route, User, TriangleAlert } from "lucide-react";
import { GovernanceStatusBadge } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { VoteBadge } from "@vellumlabs/cexplorer-sdk";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { transformAnchorUrl } from "@/utils/format/transformAnchorUrl";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { isVoteLate } from "@/utils/governance/isVoteLate";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface VoteDetailCardProps {
  vote: GovernanceVote;
  index?: number;
  total?: number;
  isLoading: boolean;
}

export const VoteDetailCard: FC<VoteDetailCardProps> = ({
  vote,
  isLoading,
}) => {
  const { t } = useAppTranslation();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);
  const { theme } = useThemeStore();

  const currentEpoch = miscConst?.no;

  const voterDisplayName =
    vote?.info?.meta?.name || vote?.info?.meta?.given_name || "";

  const detailItems = [
    {
      key: "action_type",
      title: t("governance.voteDetail.actionType"),
      value: vote?.proposal?.type ? (
        <ActionTypesComponent title={vote?.proposal?.type as ActionTypes} />
      ) : (
        "-"
      ),
    },
    {
      key: "gov_title",
      title: t("governance.voteDetail.governanceActionTitle"),
      value: vote?.proposal?.anchor?.offchain?.name ? (
        <Link
          to={"/gov/action/$id"}
          params={{
            id: encodeURIComponent(vote?.proposal?.ident?.id ?? ""),
          }}
          className='text-text-sm text-primary'
        >
          {vote?.proposal?.anchor?.offchain?.name}
        </Link>
      ) : (
        "⚠️ Invalid metadata"
      ),
    },
    {
      key: "gov_id",
      title: t("governance.voteDetail.governanceActionId"),
      value: (
        <div className='flex items-center gap-1 break-all'>
          <span className='text-text-sm' title={vote?.proposal?.ident?.bech}>
            {formatString(vote?.proposal?.ident?.bech, "long")}
          </span>
          <Copy copyText={vote?.proposal?.ident?.bech} />
        </div>
      ),
    },
    {
      key: "status",
      title: t("governance.voteDetail.status"),
      value: (
        <GovernanceStatusBadge
          item={{
            dropped_epoch: vote?.proposal?.dropped_epoch ?? null,
            enacted_epoch: vote?.proposal?.enacted_epoch ?? null,
            expired_epoch: vote?.proposal?.expired_epoch ?? null,
            ratified_epoch: vote?.proposal?.ratified_epoch ?? null,
          }}
          currentEpoch={currentEpoch ?? 0}
        />
      ),
    },

    ...(vote?.proposal?.enacted_epoch
      ? [
          {
            key: "enacted_epoch",
            title: t("governance.voteDetail.enactedEpoch"),
            value: (
              <div className='flex items-center gap-1 text-text-sm'>
                <span>{t("governance.voteDetail.epochLabel")}</span>
                <EpochCell no={vote?.proposal?.enacted_epoch} />
              </div>
            ),
          },
        ]
      : []),
    ...(vote?.proposal?.ratified_epoch
      ? [
          {
            key: "ratified_epoch",
            title: t("governance.voteDetail.ratifiedEpoch"),
            value: (
              <div className='flex items-center gap-1 text-text-sm'>
                <span>{t("governance.voteDetail.epochLabel")}</span>
                <EpochCell no={vote?.proposal?.ratified_epoch} />
              </div>
            ),
          },
        ]
      : []),
    ...(vote?.proposal?.expired_epoch
      ? [
          {
            key: "expired_epoch",
            title: t("governance.voteDetail.expiredEpoch"),
            value: (
              <div className='flex items-center gap-1 text-text-sm'>
                <span>{t("governance.voteDetail.epochLabel")}</span>
                <EpochCell no={vote?.proposal?.expired_epoch} />
              </div>
            ),
          },
        ]
      : []),
    {
      key: "voting_start",
      title: t("governance.voteDetail.votingStart"),
      value: (
        <div className='flex flex-wrap items-center gap-x-1'>
          <TimeDateIndicator time={vote?.proposal?.tx?.time} />
        </div>
      ),
    },
    {
      key: "voting_end",
      title: t("governance.voteDetail.votingDeadline"),
      value: vote?.proposal?.expiration ? (
        <div className='flex items-center gap-1 text-text-sm'>
          <span>{t("governance.voteDetail.epochLabel")}</span>
          <EpochCell no={vote?.proposal?.expiration} />
        </div>
      ) : (
        "-"
      ),
      divider: true,
    },
    {
      key: "role",
      title: t("governance.voteDetail.role"),
      value: (() => {
        const role = vote?.voter_role;
        const displayRole =
          role === GovernanceRole.ConstitutionalCommittee
            ? t("governance.voteDetail.constitutionalCommittee")
            : role;

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-l border border-border px-[6px]'>
            {role === GovernanceRole.DRep && (
              <User size={12} className='text-primary' />
            )}
            {role === GovernanceRole.ConstitutionalCommittee && (
              <Landmark size={12} className='text-primary' />
            )}
            {role === GovernanceRole.SPO && (
              <Route size={12} className='text-primary' />
            )}
            <span className='text-text-xs font-medium'>{displayRole}</span>
          </div>
        );
      })(),
    },
    ...(voterDisplayName
      ? [
          {
            key: "voter_name",
            title: t("governance.voteDetail.voterName"),
            value: (
              <div className='flex items-center gap-1'>
                {vote?.info?.id && (
                  <Image
                    src={generateImageUrl(
                      vote.info.id,
                      "ico",
                      vote?.voter_role === GovernanceRole.DRep
                        ? "drep"
                        : vote?.voter_role ===
                            GovernanceRole.ConstitutionalCommittee
                          ? "cc"
                          : undefined,
                    )}
                    type='user'
                    height={20}
                    width={20}
                    className='rounded-max'
                  />
                )}
                {vote?.voter_role && vote?.info?.id ? (
                  <Link
                    to={
                      vote.voter_role === GovernanceRole.SPO
                        ? "/pool/$id"
                        : vote.voter_role === GovernanceRole.DRep
                          ? "/drep/$hash"
                          : "/"
                    }
                    params={{
                      id: vote.info.id,
                      hash: vote.info.id,
                    }}
                    className='text-text-sm text-primary hover:underline'
                  >
                    {voterDisplayName}
                  </Link>
                ) : (
                  <span className='text-text-sm text-primary'>
                    {voterDisplayName}
                  </span>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "voter_id",
      title: t("governance.voteDetail.voterId"),
      value: (
        <div className='flex items-center gap-1 break-all'>
          {!voterDisplayName && vote?.voter_role && vote?.info?.id ? (
            <Link
              to={
                vote.voter_role === GovernanceRole.SPO
                  ? "/pool/$id"
                  : vote.voter_role === GovernanceRole.DRep
                    ? "/drep/$hash"
                    : "/"
              }
              params={{
                id: vote.info.id,
                hash: vote.info.id,
              }}
              className='text-text-sm text-primary hover:underline'
              title={vote?.info?.id}
            >
              {formatString(vote?.info?.id, "long")}
            </Link>
          ) : (
            <span className='text-text-sm' title={vote?.info?.id}>
              {formatString(vote?.info?.id, "long")}
            </span>
          )}
          <Copy copyText={vote?.info?.id} />
        </div>
      ),
    },
    {
      key: "power",
      title: t("governance.voteDetail.votePower"),
      value: (
        <AdaWithTooltip
          data={vote?.info?.power?.stake}
          triggerClassName='text-text'
        />
      ),
    },
    {
      key: "cast_vote",
      title: <p>{t("governance.voteDetail.castVote")}</p>,
      value: (() => {
        if (!vote?.vote) {
          return "-";
        }
        const voteLate = isVoteLate(vote);

        const warningStyles =
          theme === "dark"
            ? {
                border: "border-[#DC6803]",
                bg: "bg-[#392E33]",
                text: "text-white",
              }
            : {
                border: "border-[#FEDF89]",
                bg: "bg-[#FFFAEB]",
                text: "text-[#DC6803]",
              };

        return (
          <div className='flex flex-wrap items-center gap-1'>
            <VoteBadge vote={vote.vote} />
            {voteLate && (
              <div
                className={`flex h-[24px] w-fit items-center gap-1 rounded-xl border ${warningStyles.border} ${warningStyles.bg} px-[8px] py-[2px]`}
              >
                <TriangleAlert size={14} className={warningStyles.text} />
                <span
                  className={`text-text-xs font-medium ${warningStyles.text}`}
                >
                  {t("governance.voteDetail.lateVoteWarning")}
                </span>
              </div>
            )}
          </div>
        );
      })(),
    },
    {
      key: "timestamp",
      title: t("governance.voteDetail.timestamp"),
      value: <TimeDateIndicator time={vote?.tx?.time} />,
    },
    {
      key: "vote_tx",
      title: t("governance.voteDetail.voteTx"),
      value: (
        <div className='flex items-center gap-1 break-all'>
          <Link
            to='/tx/$hash'
            params={{ hash: vote?.tx?.hash }}
            className='text-text-sm text-primary'
            title={vote?.tx?.hash}
          >
            {formatString(vote?.tx?.hash, "long")}
          </Link>
          <Copy copyText={vote?.tx?.hash} />
        </div>
      ),
    },
    ...(vote?.anchor?.url
      ? [
          {
            key: "anchor_url",
            title: t("governance.voteDetail.anchorUrl"),
            value: (() => {
              const transformedUrl = transformAnchorUrl(vote.anchor.url);
              if (!transformedUrl) return "-";

              return (
                <a
                  href={transformedUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='break-all text-text-sm text-primary'
                  onClick={e => {
                    e.preventDefault();
                    setClickedUrl(transformedUrl);
                  }}
                >
                  {transformedUrl}
                </a>
              );
            })(),
          },
        ]
      : []),
    {
      key: "metadata",
      title: t("governance.voteDetail.metadata"),
      value: vote?.anchor?.offchain?.comment ? (
        <div className='bg-muted rounded-s border border-border p-1.5 text-text-sm leading-relaxed'>
          <pre className='max-w-full overflow-x-auto whitespace-pre-wrap break-all'>
            {vote?.anchor?.offchain?.comment}
          </pre>
        </div>
      ) : (
        "-"
      ),
      fullWidth: true,
    },
  ];

  return (
    <>
      <div className='w-full rounded-xl border border-border px-3 py-2'>
        <h2 className='text-base font-semibold'>{t("governance.voteDetail.overview")}</h2>
        <div className='flex flex-col gap-2 pt-2'>
          {detailItems.map(({ key, title, value, divider, fullWidth }) => (
            <div key={key} className='flex flex-col'>
              <div
                className={
                  fullWidth
                    ? "flex flex-col gap-1"
                    : "flex flex-wrap items-start gap-x-2 gap-y-1/2"
                }
              >
                <p className='min-w-[160px] max-w-full break-words text-text-sm text-grayTextSecondary'>
                  {title}
                </p>
                <div
                  className={
                    fullWidth ? "w-full" : "min-w-0 flex-1 break-words"
                  }
                >
                  {isLoading ? (
                    <LoadingSkeleton width='100%' height='20px' />
                  ) : (
                    value
                  )}
                </div>
              </div>
              {divider && <div className='my-1 border-t border-border'></div>}
            </div>
          ))}
        </div>
      </div>
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(null)}
          warningText={t("sdk.safetyLink.warningText")}
          goBackLabel={t("sdk.safetyLink.goBackLabel")}
          visitLabel={t("sdk.safetyLink.visitLabel")}
        />
      )}
    </>
  );
};
