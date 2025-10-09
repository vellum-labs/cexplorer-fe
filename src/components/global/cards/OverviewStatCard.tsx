import type { ReactNode } from "react";

interface OverviewStatCardProps {
  title: ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassname?: string;
  subTitle?: string;
  fullContentHeight?: boolean;
}

export const OverviewStatCard = ({
  title,
  icon,
  value,
  description,
  className,
  titleClassname,
  subTitle,
  fullContentHeight,
}: OverviewStatCardProps) => {
  return (
    <div
      className={`flex min-h-[100px] shrink grow basis-[280px] flex-col gap-1.5 rounded-l border border-border bg-cardBg px-2 py-1.5 shadow-md ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div
          className={`flex items-center justify-start gap-1 ${titleClassname ? titleClassname : ""}`}
        >
          {icon && (
            <div className='rounded-m border border-border p-1/2'>{icon}</div>
          )}
          <p className='text-text-sm text-grayTextPrimary'>{title}</p>
        </div>
        {subTitle && (
          <p className='text-text-xs text-grayTextPrimary'>{subTitle}</p>
        )}
      </div>
      <div
        className={`text-lg font-semibold ${fullContentHeight ? "h-full" : ""}`}
      >
        {value}
      </div>
      {description && (
        <p className='text-grayText text-text-sm'>{description}</p>
      )}
    </div>
  );
};
