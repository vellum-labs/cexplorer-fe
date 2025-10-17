import type { PoolInfo } from "@/types/poolTypes";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Image } from "../global/Image";
import { formatString } from "@/utils/format/format";

interface Props {
  poolInfo: PoolInfo;
  width?: number;
  className?: string;
  fontSize?: string;
  cropPoolHash?: boolean;
}

const PoolCell = ({
  poolInfo,
  className,
  fontSize = "text-sm",
  cropPoolHash = true,
}: Props) => {
  const id = poolInfo?.id;
  const ticker = poolInfo?.meta?.ticker;
  const name = poolInfo?.meta?.name;

  if (!id)
    return (
      <p className="className='block text-primary' w-fit max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
        -
      </p>
    );

  return (
    <div
      className={`relative flex max-h-[75px] w-full items-center gap-1 ${className}`}
    >
      {ticker && (
        <Image
          key={poolInfo.id}
          src={generateImageUrl(id, "ico", "pool")}
          type='pool'
          className='h-8 w-8 rounded-max'
          height={32}
          width={32}
        />
      )}
      <div
        className={`flex ${ticker ? "w-[calc(100%-40px)]" : "w-full"} flex-col`}
      >
        <Link
          to='/pool/$id'
          params={{ id: poolInfo.id }}
          className='text-primary'
        >
          <span
            title={poolInfo.id}
            className={`block w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[${fontSize}] leading-[1.1] text-primary`}
          >
            {ticker && `[${ticker}] `}
            {name && name}
          </span>
        </Link>
        <div className='flex w-fit items-center gap-1/2'>
          <Link
            to='/pool/$id'
            params={{ id: poolInfo.id }}
            className={`block w-full overflow-hidden text-ellipsis whitespace-nowrap ${ticker ? "text-text-xs" : "text-[13px]"} text-primary`}
          >
            {cropPoolHash ? formatString(poolInfo.id, "long") : poolInfo.id}
          </Link>
          <Copy copyText={poolInfo.id} size={10} className='stroke-grayText' />
        </div>
      </div>
    </div>
  );
};

export default PoolCell;
