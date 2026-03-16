import type { TxAsset } from "@/types/assetsTypes";
import {
  getAssetFingerprint,
  formatNumberWithSuffix,
  formatNumber,
  Tooltip,
  Copy,
} from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { Link } from "@tanstack/react-router";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { adaHandlePolicies } from "@/constants/confVariables";

interface Props {
  asset: TxAsset;
  type: "input" | "output";
  className?: string;
}

const AssetLink = ({ asset, type, className }: Props) => {
  const divideNumber = asset.registry?.decimals
    ? 10 ** asset.registry.decimals
    : 1;
  const fingerprint = getAssetFingerprint(asset?.name);
  const matchedPolicy = adaHandlePolicies.find(p => asset?.name?.includes(p));
  const isAdaHandle = !!matchedPolicy;

  return (
    <Link
      to='/asset/$fingerprint'
      params={{ fingerprint: fingerprint }}
      title={fingerprint}
      key={fingerprint}
      className={`flex w-fit max-w-full rounded-s border border-border bg-background px-1 py-[1px] text-text-xs font-medium text-primary ${className}`}
    >
      <span className='flex items-center overflow-hidden text-ellipsis whitespace-nowrap'>
        {isAdaHandle && (
          <AdaHandleBadge
            variant='icon'
            className='mr-1/2 h-1.5 w-1.5 shrink-0'
            policyId={matchedPolicy}
          />
        )}
        {renderAssetName({ asset, fingerprint, type: "long" })}
      </span>
      <span className='ml-auto min-w-fit pl-1'>
        <Tooltip
          content={
            <p className='flex items-center gap-1/2 text-text'>
              <span className='text-text-sm'>
                {formatNumber(asset.quantity / divideNumber)}
              </span>
              <Copy copyText={String(asset.quantity / divideNumber)} />
            </p>
          }
        >
          <span className='text-sm !text-primary'>
            {type === "input" ? "-" : ""}
            {formatNumberWithSuffix(asset.quantity / divideNumber)}
          </span>
        </Tooltip>
      </span>
    </Link>
  );
};

export default AssetLink;
