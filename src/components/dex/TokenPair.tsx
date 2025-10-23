import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AssetDisplay } from "./AssetDisplay";
import { getAssetImage } from "@/utils/asset/getAssetImage";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";

interface TokenPairProps {
  tokenIn: string;
  tokenOut: string;
  variant?: "full" | "simple";
  clickable?: boolean;
  tokenInRegistry?: {
    ticker?: string;
    name?: string;
  } | null;
  tokenOutRegistry?: {
    ticker?: string;
    name?: string;
  } | null;
}

export const TokenPair: FC<TokenPairProps> = ({
  tokenIn,
  tokenOut,
  variant = "full",
  clickable = true,
  tokenInRegistry,
  tokenOutRegistry,
}) => {
  const tokenInFingerprint = getAssetFingerprint(tokenIn);
  const tokenOutFingerprint = getAssetFingerprint(tokenOut);

  if (variant === "simple") {
    return (
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {getAssetImage(tokenIn)}
          {clickable ? (
            <Link
              to='/asset/$fingerprint'
              params={{ fingerprint: tokenInFingerprint }}
            >
              <AssetDisplay
                tokenName={tokenIn}
                fingerprint={tokenInFingerprint}
                fontWeight='normal'
                registry={tokenInRegistry}
              />
            </Link>
          ) : (
            <AssetDisplay
              tokenName={tokenIn}
              fingerprint={tokenInFingerprint}
              fontWeight='normal'
              registry={tokenInRegistry}
            />
          )}
        </div>
        <ArrowRight size={15} className='block min-w-[20px]' />
        <div className='flex items-center gap-2'>
          {getAssetImage(tokenOut)}
          {clickable ? (
            <Link
              to='/asset/$fingerprint'
              params={{ fingerprint: tokenOutFingerprint }}
            >
              <AssetDisplay
                tokenName={tokenOut}
                fingerprint={tokenOutFingerprint}
                fontWeight='normal'
                registry={tokenOutRegistry}
              />
            </Link>
          ) : (
            <AssetDisplay
              tokenName={tokenOut}
              fingerprint={tokenOutFingerprint}
              fontWeight='normal'
              registry={tokenOutRegistry}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-2'>
        {getAssetImage(tokenIn)}
        {clickable ? (
          <Link
            to='/asset/$fingerprint'
            params={{ fingerprint: tokenInFingerprint }}
          >
            <AssetDisplay
              tokenName={tokenIn}
              fingerprint={tokenInFingerprint}
              registry={tokenInRegistry}
            />
          </Link>
        ) : (
          <AssetDisplay
            tokenName={tokenIn}
            fingerprint={tokenInFingerprint}
            registry={tokenInRegistry}
          />
        )}
      </div>
      <ArrowRight size={15} className='block' />
      <div className='flex items-center gap-2'>
        {getAssetImage(tokenOut)}
        {clickable ? (
          <Link
            to='/asset/$fingerprint'
            params={{ fingerprint: tokenOutFingerprint }}
          >
            <AssetDisplay
              tokenName={tokenOut}
              fingerprint={tokenOutFingerprint}
              registry={tokenOutRegistry}
            />
          </Link>
        ) : (
          <AssetDisplay
            tokenName={tokenOut}
            fingerprint={tokenOutFingerprint}
            registry={tokenOutRegistry}
          />
        )}
      </div>
    </div>
  );
};
