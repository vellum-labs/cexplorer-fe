import type { FC } from "react";

import {
  Clipboard,
  CornerRightUp,
  Info,
  Shuffle,
  SquareEqual,
  SquarePen,
  Users,
} from "lucide-react";

export type ActionTypes =
  | "InfoAction"
  | "NoConfidence"
  | "ParameterChange"
  | "NewCommittee"
  | "NewConstitution"
  | "TreasuryWithdrawals"
  | "HardForkInitiation";

interface ActionTypesProps {
  title: ActionTypes;
}

export const ActionTypes: FC<ActionTypesProps> = ({ title }) => {
  const types = {
    InfoAction: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <Info size={12} className='text-primary' />
        <span className='text-xs font-medium'>Info action</span>
      </div>
    ),
    NoConfidence: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <SquareEqual size={12} className='text-primary' />
        <span className='text-xs font-medium'>No confidence</span>
      </div>
    ),
    ParameterChange: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <SquarePen size={12} className='text-[#47CD89]' />
        <span className='text-xs font-medium'>Parameter change</span>
      </div>
    ),
    NewCommittee: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <Users size={12} className='text-[#47CD89]' />
        <span className='text-xs font-medium'>New Committee</span>
      </div>
    ),
    NewConstitution: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <Clipboard size={12} className='text-[#47CD89]' />
        <span className='text-xs font-medium'>New Constitution</span>
      </div>
    ),
    TreasuryWithdrawals: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <CornerRightUp size={12} className='text-[#FEC84B]' />
        <span className='text-xs font-medium'>TreasuryWithdrawals</span>
      </div>
    ),
    HardForkInitiation: (
      <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-xs'>
        <Shuffle size={12} className='text-[#f04438]' />
        <span className='text-xs font-medium'>Hardfork Initiation</span>
      </div>
    ),
  };

  return types[title];
};
