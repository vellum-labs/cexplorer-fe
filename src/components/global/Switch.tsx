import type { FC } from "react";

import { useEffect, useState } from "react";

interface SwitchProps {
  onClick?: () => void;
  active?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({
  onClick,
  onChange,
  active = false,
  className,
}) => {
  const [isOn, setIsOn] = useState(active);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(open => !open);
    onChange?.(newState);

    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    setIsOn(active);
  }, [active]);

  return (
    <label
      className={`relative inline-flex cursor-pointer items-center ${className ? className : ""}`}
    >
      <input
        type='checkbox'
        checked={isOn}
        onChange={toggleSwitch}
        className='sr-only'
      />
      <div
        className={`h-[20px] w-[35px] rounded-max shadow-inner transition-colors duration-300 ease-in-out ${
          isOn ? "bg-darkBlue" : "bg-border"
        }`}
      >
        <div
          className={`absolute left-[2px] aspect-square w-[16px] translate-y-[2px] transform rounded-max bg-white shadow transition-transform duration-300 ease-in-out ${
            isOn ? "translate-x-[15px]" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};
