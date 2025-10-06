import type { FC } from "react";

interface MinMaxRangeProps {
  min: number;
  max: number;
  current: number | string;
  showPercentage?: boolean;
  showLabels?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md";
  labelPosition?: "above" | "right";
  colorMode?: "neutral" | "scaling";
}

export const MinMaxRange: FC<MinMaxRangeProps> = ({
  min,
  max,
  current,
  showPercentage = false,
  showLabels = false,
  className = "",
  size = "sm",
  labelPosition = "above",
  colorMode = "scaling",
}) => {
  const calculatePercentage = (): number => {
    const numericCurrent =
      typeof current === "string"
        ? parseFloat(current.replace(/[^\d.-]/g, ""))
        : current;

    if (max === min) return 0;
    if (numericCurrent <= min) return 0;
    if (numericCurrent >= max) return 100;

    return ((numericCurrent - min) / (max - min)) * 100;
  };

  const percentage = calculatePercentage();

  const getFillColor = (): string => {
    if (colorMode === "neutral") {
      return "#0094D4";
    }

    if (percentage <= 5) {
      return "#F04438";
    } else if (percentage <= 25) {
      return "#FDB022";
    } else {
      return "#17B26A";
    }
  };

  const fillColor = getFillColor();

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return {
          bar: "h-1 w-8",
          text: "text-xs",
        };
      case "sm":
        return {
          bar: "h-2 w-12",
          text: "text-sm",
        };
      case "md":
        return {
          bar: "h-2 w-16",
          text: "text-sm",
        };
      default:
        return {
          bar: "h-2 w-12",
          text: "text-sm",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const currentValueElement = (
    <span className={`${sizeClasses.text} text-grayTextPrimary`}>
      {current}
      {showPercentage && ` (${percentage.toFixed(1)}%)`}
    </span>
  );

  const progressBarElement = (
    <div title='Range visualization' className='flex items-center justify-end'>
      {showLabels && (
        <span className={`${sizeClasses.text} mr-1 text-grayTextSecondary`}>
          {min}
        </span>
      )}

      <div
        className={`relative ${sizeClasses.bar} overflow-hidden rounded-[4px]`}
        style={{ backgroundColor: "#D0D5DD" }}
      >
        <span
          className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] transition-all duration-300'
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>

      {showLabels && (
        <span className={`${sizeClasses.text} ml-1/2 text-grayTextSecondary`}>
          {max}
        </span>
      )}
    </div>
  );

  if (labelPosition === "right") {
    return (
      <div className={`flex items-center gap-1/2 ${className}`}>
        {progressBarElement}
        {currentValueElement}
      </div>
    );
  }

  // Default: label above
  return (
    <div className={`flex flex-col gap-1/2 ${className}`}>
      <p className='text-right'>{currentValueElement}</p>
      {progressBarElement}
    </div>
  );
};
