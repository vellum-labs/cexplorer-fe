import type { TxAsset } from "@/types/assetsTypes";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatNumberWithSuffix } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";

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

  return (
    <Link
      to='/asset/$fingerprint'
      params={{ fingerprint: fingerprint }}
      title={fingerprint}
      key={fingerprint}
      className={`flex w-fit max-w-full rounded-s border border-border bg-background px-1 py-[1px] text-text-xs font-medium text-primary ${className}`}
    >
      <span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
        {renderAssetName(asset)}
      </span>
      <span className='ml-auto min-w-fit pl-1'>
        {`${type === "input" ? "-" : ""}${formatNumberWithSuffix(asset.quantity / divideNumber, true)}`}
      </span>
    </Link>
  );
};

export default AssetLink;
