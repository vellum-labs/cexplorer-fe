import type { FC } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const RangeSlider: FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  className = "",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className='pointer-events-none absolute left-0 top-1/2 z-0 h-2 w-full -translate-y-1/2 rounded-s'
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--border) ${percentage}%, var(--border) 100%)`,
        }}
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className='range-slider-input'
      />
    </div>
  );
};
