import type { ReactNode } from "react";

interface InfoCardProps {
  title: ReactNode;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export const InfoCard = ({
  title,
  icon,
  children,
  className,
}: InfoCardProps) => {
  return (
    <section
      className={`flex h-[230px] grow flex-col gap-4 rounded-xl border border-border bg-cardBg px-3 py-2 ${className}`}
    >
      <div className='flex items-center gap-2'>
        <div className='rounded-lg border border-border p-1/2'>{icon}</div>
        <p className='text-sm'>{title}</p>
      </div>
      {children}
    </section>
  );
};
