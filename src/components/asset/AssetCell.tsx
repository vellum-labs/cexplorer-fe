import { alphabetWithNumbers } from "@/constants/alphabet";
import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName, getNodeText } from "@vellumlabs/cexplorer-sdk";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";

import { configJSON } from "@/constants/conf";

interface AssetProps {
  asset: TxAsset;
  name?: string;
  formattedHex?: string;
  isNft?: boolean;
  hideImage?: boolean;
  imageSize?: number;
  withCopy?: boolean;
  formatTitle?: "short" | "long" | "shorter";
}

const AssetCell = memo((props: AssetProps) => {
  const {
    asset,
    name,
    isNft,
    hideImage,
    imageSize,
    formattedHex,
    formatTitle = "long",
  } = props;

  const assetName = asset?.name || name || "";

  const adaHandlePolicy = configJSON.integration[0].adahandle[0].policy;

  const adaHandleName = assetName
    .replace(adaHandlePolicy, "")
    .replace(/^(000de140|0014df10|000643b0|000010)/, "");

  const fingerprint = getAssetFingerprint(assetName);
  const isAdaHandle = assetName.includes(adaHandlePolicy);
  const encodedNameArr = encodeAssetName(assetName).split("");

  const withCopy = "withCopy" in props ? props.withCopy : false;

  const nameByRegistry =
    asset?.registry?.name && asset?.registry?.ticker
      ? `[${asset?.registry?.ticker}] ${asset?.registry?.name}`
      : undefined;

  return (
    <div className='relative flex w-full items-center gap-1'>
      {!hideImage && (
        <Link to='/asset/$fingerprint' params={{ fingerprint: fingerprint }}>
          <Image
            type='asset'
            height={imageSize || 40}
            width={imageSize || 40}
            className='aspect-square h-[40px] max-h-[40px] w-[40px] max-w-[40px] shrink-0 rounded-max'
            src={generateImageUrl(
              isNft ? fingerprint : assetName,
              "sm",
              isNft ? "nft" : "token",
            )}
            fallbackletters={[...encodedNameArr]
              .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
              .join("")}
          />
        </Link>
      )}
      <div
        className={`block w-full ${isAdaHandle ? "" : "overflow-hidden"} text-text-sm text-primary`}
      >
        <span className='flex w-full flex-col items-start'>
          <Link
            to='/asset/$fingerprint'
            params={{ fingerprint: fingerprint }}
            title={fingerprint}
            key={fingerprint}
            className={`flex w-full items-center text-text-sm text-primary`}
          >
            {isAdaHandle && (
              <AdaHandleBadge
                variant='icon'
                className='h-2 w-2'
                policyId={adaHandlePolicy}
              />
            )}
            <span
              className={`${withCopy ? "" : "w-full"} block overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {nameByRegistry
                ? nameByRegistry
                : formattedHex
                  ? formattedHex
                  : renderAssetName({
                      asset,
                      name: isAdaHandle ? adaHandleName : name,
                      type: formatTitle,
                      fingerprint,
                    })}
            </span>
            {withCopy && (
              <Copy
                copyText={
                  nameByRegistry
                    ? nameByRegistry
                    : formattedHex
                      ? formattedHex
                      : getNodeText(
                          renderAssetName({ asset, name, fingerprint }),
                        )
                }
                className='ml-1'
              />
            )}
          </Link>
          <span className='flex items-center gap-1/2'>
            {nameByRegistry ||
            renderAssetName({ asset, name, fingerprint }) !== "n/a" ? (
              <p className='break-words break-all text-text-xs text-grayTextPrimary'>
                {formatString(fingerprint, "long")}
              </p>
            ) : (
              <Link
                to='/asset/$fingerprint'
                params={{ fingerprint: fingerprint }}
                title={fingerprint}
                key={fingerprint}
                className='break-words break-all text-text-sm text-primary'
              >
                {formatString(fingerprint, "long")}
              </Link>
            )}
            <Copy
              size={
                renderAssetName({ asset, name, fingerprint }) !== "n/a"
                  ? 10
                  : 13
              }
              copyText={fingerprint}
            />
          </span>
        </span>
      </div>
    </div>
  );
});

export default AssetCell;
