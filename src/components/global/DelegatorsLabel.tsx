import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Info } from "lucide-react";

interface DelegatorsLabelProps {
  minDelegationAda: string;
}

export const DelegatorsLabel = ({ minDelegationAda }: DelegatorsLabelProps) => {
  return (
    <span className='flex items-center gap-1'>
      Delegators
      <Tooltip
        content={`Only delegations above ${minDelegationAda} ADA are counted.`}
      >
        <Info size={14} className='text-grayTextPrimary' />
      </Tooltip>
    </span>
  );
};
