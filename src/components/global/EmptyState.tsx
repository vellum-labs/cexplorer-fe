import { type FC, type ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  primaryText: string;
  secondaryText: string;
  button?: ReactNode;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  primaryText,
  secondaryText,
  button,
  className = "",
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center rounded-xl border border-border bg-cardBg px-6 py-6 text-center ${className}`}
    >
      {/* Icon with 24px bottom margin */}
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background p-2 text-primary">
        {icon}
      </div>

      {/* Primary text with 4px bottom margin */}
      <h3 className="mb-1 text-lg font-semibold text-text">{primaryText}</h3>

      {/* Secondary text */}
      <p className="mb-6 max-w-md text-sm text-grayTextPrimary">
        {secondaryText}
      </p>

      {/* Optional button */}
      {button}
    </div>
  );
};