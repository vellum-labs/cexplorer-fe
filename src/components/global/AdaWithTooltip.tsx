import { formatNumber } from "@/utils/format/format";
import type { FC } from "react";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { Copy } from "@vellumlabs/cexplorer-sdk";

interface AdaWithTooltipProps {
  data: number;
  triggerClassName?: string;
  tooltip?: boolean;
}

export const AdaWithTooltip: FC<AdaWithTooltipProps> = ({
  data,
  triggerClassName,
  tooltip = true,
}) => {
  return tooltip ? (
    <Tooltip
      content={
        <p className='flex items-center gap-1/2 text-text'>
          <span className='text-text-sm'>{formatNumber(data ?? 0)}</span>
          <Copy copyText={String(data)} />
        </p>
      }
    >
      <span className={`text-sm text-grayTextPrimary ${triggerClassName}`}>
        {lovelaceToAda(data ?? 0)}
      </span>
    </Tooltip>
  ) : (
    <span className={`text-sm text-grayTextPrimary ${triggerClassName}`}>
      {lovelaceToAda(data ?? 0)}
    </span>
  );
};
