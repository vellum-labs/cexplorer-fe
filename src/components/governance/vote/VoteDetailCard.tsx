import type { FC } from "react";
import { useState } from "react";
import type { GovernanceVote } from "@/types/governanceTypes";
import { GovernanceRole } from "@/types/governanceTypes";

import {
  ActionTypes as ActionTypesComponent,
  type ActionTypes,
} from "@/components/global/ActionTypes";
import Copy from "@/components/global/Copy";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { Image } from "@/components/global/Image";
import { Link } from "@tanstack/react-router";
import { Landmark, Route, User } from "lucide-react";
import { GovernanceStatusBadge } from "@/components/global/badges/GovernanceStatusBadge";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { formatString } from "@/utils/format/format";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { VoteBadge } from "@/components/global/badges/VoteBadge";
import { SafetyLinkModal } from "@/components/global/modals/SafetyLinkModal";
import { transformAnchorUrl } from "@/utils/format/transformAnchorUrl";
import { generateImageUrl } from "@/utils/generateImageUrl";

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
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  const currentEpoch = miscConst?.no;

  const voterDisplayName = vote?.info?.meta?.name || vote?.info?.meta?.given_name || "";

  const detailItems = [
    {
      key: "action_type",
      title: "Action type",
      value: vote?.proposal?.type ? (
        <ActionTypesComponent title={vote?.proposal?.type as ActionTypes} />
      ) : (
        "-"
      ),
    },
    {
      key: "gov_title",
      title: "Governance action Title",
      value: vote?.proposal?.anchor?.offchain?.name ? (
        <Link
          to={"/gov/action/$id"}
          params={{
            id: vote?.proposal?.ident?.id ?? "",
          }}
          className='text-sm text-primary'
        >
          {vote?.proposal?.anchor?.offchain?.name}
        </Link>
      ) : (
        "⚠️ Invalid metadata"
      ),
    },
    {
      key: "gov_id",
      title: "Governance action ID",
      value: (
        <div className='flex items-center gap-1 break-all'>
          <span className='text-sm' title={vote?.proposal?.ident?.bech}>
            {formatString(vote?.proposal?.ident?.bech, "long")}
          </span>
          <Copy copyText={vote?.proposal?.ident?.bech} />
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
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

    // Only show enacted epoch if it exists
    ...(vote?.proposal?.enacted_epoch ? [{
      key: "enacted_epoch",
      title: "Enacted epoch",
      value: (
        <span className='text-sm'>
          Epoch{" "}
          <Link
            to='/epoch/$no'
            params={{ no: vote?.proposal?.enacted_epoch?.toString() }}
            className='text-primary'
          >
            {vote?.proposal?.enacted_epoch}
          </Link>
        </span>
      ),
    }] : []),
    // Only show ratified epoch if it exists
    ...(vote?.proposal?.ratified_epoch ? [{
      key: "ratified_epoch",
      title: "Ratified epoch",
      value: (
        <span className='text-sm'>
          Epoch{" "}
          <Link
            to='/epoch/$no'
            params={{ no: vote?.proposal?.ratified_epoch?.toString() }}
            className='text-primary'
          >
            {vote?.proposal?.ratified_epoch}
          </Link>
        </span>
      ),
    }] : []),
    // Only show expired epoch if it exists
    ...(vote?.proposal?.expired_epoch ? [{
      key: "expired_epoch",
      title: "Expired epoch",
      value: (
        <span className='text-sm'>
          Epoch{" "}
          <Link
            to='/epoch/$no'
            params={{ no: vote?.proposal?.expired_epoch?.toString() }}
            className='text-primary'
          >
            {vote?.proposal?.expired_epoch}
          </Link>
        </span>
      ),
    }] : []),
    {
      key: "voting_start",
      title: "Voting start",
      value: (
        <div className='flex flex-wrap items-center gap-x-1'>
          <TimeDateIndicator time={vote?.proposal?.tx?.time} />
        </div>
      ),
    },
    {
      key: "voting_end",
      title: "Voting deadline",
      value: vote?.proposal?.expiration ? (
        <span className='text-sm'>
          Epoch{" "}
          <Link
            to='/epoch/$no'
            params={{ no: vote?.proposal?.expiration?.toString() }}
            className='text-primary'
          >
            {vote?.proposal?.expiration}
          </Link>
        </span>
      ) : (
        "-"
      ),
      divider: true,
    },
    {
      key: "role",
      title: "Role",
      value: (() => {
        const role = vote?.voter_role;
        const displayRole =
          role === GovernanceRole.ConstitutionalCommittee
            ? "Constitutional Committee"
            : role;

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-lg border border-border px-[6px]'>
            {role === GovernanceRole.DRep && <User size={12} className='text-primary' />}
            {role === GovernanceRole.ConstitutionalCommittee && <Landmark size={12} className='text-primary' />}
            {role === GovernanceRole.SPO && <Route size={12} className='text-primary' />}
            <span className='text-xs font-medium'>{displayRole}</span>
          </div>
        );
      })(),
    },
    ...(voterDisplayName ? [{
      key: "voter_name",
      title: "Voter name",
      value: (
        <div className='flex items-center gap-1'>
          {vote?.info?.id && (
            <Image
              src={generateImageUrl(
                vote.info.id, 
                "ico", 
                vote?.voter_role === GovernanceRole.DRep ? "drep" : 
                vote?.voter_role === GovernanceRole.ConstitutionalCommittee ? "cc" : 
                undefined
              )}
              type='user'
              height={20}
              width={20}
              className='rounded-full'
            />
          )}
          {vote?.voter_role && vote?.info?.id ? (
            <Link
              to={
                vote.voter_role === GovernanceRole.SPO
                  ? "/pool/$id"
                  : vote.voter_role === GovernanceRole.DRep
                    ? "/drep/$hash"
                    : vote.voter_role === GovernanceRole.ConstitutionalCommittee
                      ? "/gov/cc/$coldKey"
                      : ""
              }
              params={{
                id: vote.info.id,
                hash: vote.info.id,
                coldKey: vote.info.id,
              }}
              className='text-sm text-primary hover:underline'
            >
              {voterDisplayName}
            </Link>
          ) : (
            <span className='text-sm text-primary'>
              {voterDisplayName}
            </span>
          )}
        </div>
      ),
    }] : []),
    {
      key: "voter_id",
      title: "Voter ID",
      value: (
        <div className='flex items-center gap-1 break-all'>
          {!voterDisplayName && vote?.voter_role && vote?.info?.id ? (
            <Link
              to={
                vote.voter_role === GovernanceRole.SPO
                  ? "/pool/$id"
                  : vote.voter_role === GovernanceRole.DRep
                    ? "/drep/$hash"
                    : vote.voter_role === GovernanceRole.ConstitutionalCommittee
                      ? "/gov/cc/$coldKey"
                      : ""
              }
              params={{
                id: vote.info.id,
                hash: vote.info.id,
                coldKey: vote.info.id,
              }}
              className='text-sm text-primary hover:underline'
              title={vote?.info?.id}
            >
              {formatString(vote?.info?.id, "long")}
            </Link>
          ) : (
            <span className='text-sm' title={vote?.info?.id}>
              {formatString(vote?.info?.id, "long")}
            </span>
          )}
          <Copy copyText={vote?.info?.id} />
        </div>
      ),
    },
    {
      key: "power",
      title: "Vote power",
      value: (
        <AdaWithTooltip
          data={vote?.info?.power?.stake}
          triggerClassName='text-text'
        />
      ),
    },
    {
      key: "cast_vote",
      title: <p>Cast vote</p>,
      value: (() => {
        if (!vote?.vote) {
          return "-";
        }
        return (
          <div className='flex items-center gap-1'>
            <VoteBadge vote={vote.vote} />
          </div>
        );
      })(),
    },
    {
      key: "timestamp",
      title: "Timestamp",
      value: <TimeDateIndicator time={vote?.tx?.time} />,
    },
    {
      key: "vote_tx",
      title: "Vote tx",
      value: (
        <div className='flex items-center gap-1 break-all'>
          <Link
            to='/tx/$hash'
            params={{ hash: vote?.tx?.hash }}
            className='text-sm text-primary'
            title={vote?.tx?.hash}
          >
            {formatString(vote?.tx?.hash, "long")}
          </Link>
          <Copy copyText={vote?.tx?.hash} />
        </div>
      ),
    },
    ...(vote?.anchor?.url ? [
      {
        key: "anchor_url",
        title: "Anchor URL",
        value: (() => {
          const transformedUrl = transformAnchorUrl(vote.anchor.url);
          if (!transformedUrl) return "-";
          
          return (
            <a
              href={transformedUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-primary break-all'
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
    ] : []),
    {
      key: "metadata",
      title: "Metadata",
      value: vote?.anchor?.offchain?.comment ? (
        <div className='bg-muted rounded border border-border p-1.5 text-sm leading-relaxed'>
          <pre className='max-w-full overflow-x-auto whitespace-pre-wrap break-all'>
            {vote?.anchor?.offchain?.comment}
          </pre>
        </div>
      ) : (
        "-"
      ),
    },
  ];

  return (
    <>
      <div className='w-full rounded-xl border border-border px-3 py-2'>
        <h2 className='text-base font-semibold'>Overview</h2>
        <div className='flex flex-col gap-2 pt-2'>
          {detailItems.map(({ key, title, value, divider }) => (
            <div key={key} className='flex flex-col'>
              <div className='flex flex-wrap items-start gap-x-2 gap-y-1/2'>
                <p className='min-w-[160px] max-w-full break-words text-sm text-grayTextSecondary'>
                  {title}
                </p>
                <div className='min-w-0 flex-1 break-words'>
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
        <SafetyLinkModal url={clickedUrl} onClose={() => setClickedUrl(null)} />
      )}
    </>
  );
};
