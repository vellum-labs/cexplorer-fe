import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { Image } from "../global/Image";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { GovernanceRole } from "@/types/governanceTypes";

interface GovVoterCellProps {
  role?: GovernanceRole | string;
  info?: {
    id?: string;
    meta?: {
      given_name?: string;
      name?: string;
      image_url?: string;
      img?: string;
    };
  };
}

export const GovVoterCell: FC<GovVoterCellProps> = ({ role, info }) => {
  const voterId = info?.id;
  const meta = info?.meta ?? {};

  if (!voterId) return <span>-</span>;

  const displayName = meta?.given_name || meta?.name || "";

  const imageUrl = generateImageUrl(
    voterId, 
    "ico", 
    role === GovernanceRole.DRep ? "drep" : role === GovernanceRole.ConstitutionalCommittee ? "cc" : undefined
  );


  const toPath =
    role === GovernanceRole.SPO
      ? `/pool/${voterId}`
      : role === GovernanceRole.DRep
        ? `/drep/${voterId}`
        : role === GovernanceRole.ConstitutionalCommittee
          ? `/gov/cc/${voterId}`
          : undefined;

  return (
    <div className='relative flex max-h-[75px] w-full items-center gap-2'>
      <Image
        src={imageUrl}
        type='user'
        className='h-8 w-8 rounded-full'
        height={32}
        width={32}
      />
      <div className='flex w-[calc(100%-40px)] flex-col text-sm'>
        {displayName && toPath && (
          <Link to={toPath} className='w-fit text-primary'>
            {displayName.length > 50
              ? `${displayName.slice(0, 50)}...`
              : displayName}
          </Link>
        )}
        <div className='flex items-center gap-1'>
          {toPath ? (
            <Link
              to={toPath}
              className={
                displayName
                  ? "text-xs hover:text-grayTextPrimary"
                  : "text-sm text-primary"
              }
              disabled={!!displayName}
            >
              {formatString(voterId, "long")}
            </Link>
          ) : (
            <span>{formatString(voterId, "long")}</span>
          )}
          <Copy copyText={voterId} size={displayName ? 10 : 13} />
        </div>
      </div>
    </div>
  );
};
