import type { FC, ReactNode } from "react";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";

interface AnalyticsStatListProps {
  isLoading: boolean;
  statCards: {
    key: string;
    icon: JSX.Element;
    label: string;
    content: ReactNode;
    footer: ReactNode;
  }[];
}

export const AnalyticsStatList: FC<AnalyticsStatListProps> = ({
  isLoading,
  statCards,
}) => {
  return (
    <div className='flex h-full w-full flex-wrap gap-2'>
      {statCards.map(({ icon, key, label, content, footer }) =>
        isLoading ? (
          <LoadingSkeleton
            key={key}
            height='140px'
            rounded='xl'
            className='flex-1 basis-[300px]'
          />
        ) : (
          <OverviewStatCard
            key={key}
            icon={icon}
            title={label}
            value={content}
            description={footer}
            className='flex-grow'
          />
        ),
      )}
    </div>
  );
};
