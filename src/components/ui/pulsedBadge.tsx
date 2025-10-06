import type { FC } from "react";
import PulseDot from "../global/PulseDot";

interface PulsedBadgeProps {
  title: string;
  badgeColor?: string;
  withoutPulse?: boolean;
}

export const PulsedBadge: FC<PulsedBadgeProps> = ({
  title,
  badgeColor,
  withoutPulse = false,
}) => {
  return (
    <div className='relative flex h-[24px] w-fit items-center gap-[5px] rounded-lg border border-border px-1'>
      {!withoutPulse && (
        <div className='flex items-center justify-center'>
          <PulseDot overrideColor={badgeColor} />
        </div>
      )}
      <span className='text-xs font-medium'>{title}</span>
    </div>
  );
};
