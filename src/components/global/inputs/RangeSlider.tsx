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
      <style>{`
        .range-slider-input {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 8px;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          outline: none;
        }

        .range-slider-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          appearance: none;
          -webkit-appearance: none;
          border-radius: 9999px;
          background: transparent;
        }

        .range-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 1px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-top: -8px;
        }

        .range-slider-input::-moz-range-track {
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }

        .range-slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 1px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: none;
        }
      `}</style>
    </div>
  );
};
