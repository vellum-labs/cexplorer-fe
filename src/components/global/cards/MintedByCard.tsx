import type { FC } from "react";

import { CircleHelp, GitCompareArrows } from "lucide-react";

import Copy from "@/components/global/Copy";
import { Tooltip } from "@/components/ui/tooltip";
import type { PoolInfo } from "@/types/poolTypes";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { Link } from "@tanstack/react-router";
import { Image } from "../Image";
import { ProtocolDot } from "../ProtocolDot";

interface BlockDetailMintedProps {
  icon?: string;
  vrfKey?: string;
  protoMajor?: number;
  protoMinor?: number;
  poolInfo: PoolInfo;
}

export const MintedByCard: FC<BlockDetailMintedProps> = ({
  icon,
  vrfKey,
  protoMajor,
  protoMinor,
  poolInfo,
}) => {
  return (
    <div className='flex max-h-[110px] min-h-[110px] w-full flex-col gap-1 rounded-xl border border-border bg-cardBg px-4 py-3 shadow'>
      <div className='flex w-full items-center gap-2'>
        <div className='rounded-lg border border-border p-1'>
          <GitCompareArrows size={20} className='text-primary' />
        </div>
        <span className='text-sm text-grayTextPrimary'>Minted by</span>
      </div>
      <div className='flex w-full items-center gap-3'>
        {icon && <img src={icon} alt='Cexplorer' width={28} height={28} />}
        {/* <PoolCell fontSize='18px' poolInfo={poolInfo} /> */}
        <Link
          to='/pool/$id'
          params={{ id: poolInfo.id }}
          className='flex w-full items-center gap-2'
        >
          <Image
            src={generateImageUrl(poolInfo.id, "ico", "pool")}
            type='pool'
            height={25}
            width={25}
            className='rounded-full'
          />
          <p
            className={`block max-h-10 min-h-5 w-full overflow-hidden text-ellipsis whitespace-nowrap break-all text-base font-bold hover:text-text`}
          >
            {poolInfo.meta?.name
              ? `[${poolInfo.meta.ticker}] ${poolInfo.meta?.name}`
              : formatString(poolInfo.id, "long")}
          </p>
        </Link>
      </div>
      {vrfKey && (
        <div className='flex w-full items-center gap-2'>
          {protoMajor && (
            <span className='flex items-center gap-2 text-sm text-grayTextPrimary'>
              Protocol version
              <ProtocolDot protNo={Number(`${protoMajor}.${protoMinor}`)} />
              {protoMajor}
              {protoMinor ? `.${protoMinor}` : ""}, VRF Key
            </span>
          )}
          <Tooltip
            content={
              <div className='inline-block w-[200px] max-w-xs md:w-full xl:flex xl:max-w-full xl:items-center xl:gap-2'>
                <span className='break-words pr-2 xl:break-normal xl:pr-0'>
                  {vrfKey}
                </span>
                <Copy copyText={vrfKey} className='inline' />
              </div>
            }
          >
            <CircleHelp size={12} className='h-full text-grayTextPrimary' />
          </Tooltip>
        </div>
      )}
    </div>
  );
};
