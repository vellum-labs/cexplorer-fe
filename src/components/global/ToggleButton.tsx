import type { FC } from "react";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ToggleButtonProps {
  toggle?: () => void;
}

export const ToggleButton: FC<ToggleButtonProps> = ({ toggle }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <button
      onClick={() => {
        setIsOpen(!isOpen);
        toggle?.();
      }}
      className='flex items-center justify-center'
    >
      <ChevronDown
        className={`h-4 w-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
};
