import { Tooltip } from "@/components/ui/tooltip";
import Dollar from "@/resources/images/dollar.svg";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { Link, type ReactNode } from "@tanstack/react-router";
import { Badge } from "./Badge";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";

import { configJSON } from "@/constants/conf";

interface HexProps {
  className?: string;
  hex?: string;
  link?: boolean;
  variant?: never;
}

interface VariantProps {
  className?: string;
  variant?: "long" | "icon";
  hex?: never;
  link?: never;
}

type Props = HexProps | VariantProps;

const AdaHandleBadge = ({ className, hex, variant, link = false }: Props) => {
  let inner: ReactNode | null = null;

  if (hex) {
    const formattedHex = String(hex).replace(
      /^(000de140|0014df10|000643b0)/,
      "",
    );

    const policyId = configJSON.integration[0].adahandle[0].policy;

    inner = (
      <Badge color='gray' rounded className={className}>
        <img src={Dollar} alt='dollar' />
        {link ? (
          <Link
            to='/asset/$fingerprint'
            params={{
              fingerprint: getAssetFingerprint(policyId + hex),
            }}
            className='hover:text-text'
          >
            {encodeAssetName(formattedHex)}
          </Link>
        ) : (
          <span>{encodeAssetName(formattedHex)}</span>
        )}
      </Badge>
    );
  } else if (variant === "long") {
    inner = (
      <Badge color='gray' rounded className={className}>
        <img src={Dollar} alt='dollar' />
        <span className='text-[14px] font-bold'>handle</span>
      </Badge>
    );
  } else {
    inner = (
      <img src={Dollar} alt='dollar' className={`h-4 w-4 ${className}`} />
    );
  }

  return (
    <Tooltip content={<div className='min-w-[90px]'>Ada Handle</div>}>
      {inner}
    </Tooltip>
  );
};

export default AdaHandleBadge;
