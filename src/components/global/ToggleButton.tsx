import type { FC } from "react";

import { ChevronDown } from "lucide-react";

interface ToggleButtonProps {
  isOpen: boolean;
  toggle?: () => void;
}

export const ToggleButton: FC<ToggleButtonProps> = ({ isOpen, toggle }) => {
  return (
    <button
      className='flex items-center justify-center'
      onClick={() => {
        if (toggle) toggle();
      }}
    >
      <ChevronDown
        className={`h-4 w-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
};
