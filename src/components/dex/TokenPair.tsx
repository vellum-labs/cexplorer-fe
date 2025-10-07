import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AssetDisplay } from "./AssetDisplay";
import { getAssetImage } from "@/utils/asset/getAssetImage";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";

interface TokenPairProps {
  tokenIn: string;
  tokenOut: string;
  variant?: "full" | "simple";
  clickable?: boolean;
}

export const TokenPair = ({
  tokenIn,
  tokenOut,
  variant = "full",
  clickable = true,
}: TokenPairProps) => {
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
              />
            </Link>
          ) : (
            <AssetDisplay
              tokenName={tokenIn}
              fingerprint={tokenInFingerprint}
              fontWeight='normal'
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
              />
            </Link>
          ) : (
            <AssetDisplay
              tokenName={tokenOut}
              fingerprint={tokenOutFingerprint}
              fontWeight='normal'
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
            />
          </Link>
        ) : (
          <AssetDisplay tokenName={tokenIn} fingerprint={tokenInFingerprint} />
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
            />
          </Link>
        ) : (
          <AssetDisplay
            tokenName={tokenOut}
            fingerprint={tokenOutFingerprint}
          />
        )}
      </div>
    </div>
  );
};
