import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectItem = {
  key: string;
  value: ReactNode;
  disabled?: boolean;
};

interface SortByProps {
  selectItems: (SelectItem | undefined)[];
  setSelectedItem: Dispatch<SetStateAction<string | undefined>>;
  selectedItem?: string;
  label?: boolean;
  labelName?: string;
  width?: string;
  className?: string;
  disabled?: boolean;
}

const SortBy: FC<SortByProps> = ({
  selectItems,
  selectedItem,
  setSelectedItem,
  label = true,
  labelName,
  width = "140px",
  className,
  disabled = false,
}) => {
  return (
    <div
      className={`flex items-center gap-1 ${className} ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
    >
      {label && (
        <span className='min-w-fit text-sm text-grayTextPrimary'>
          {labelName || "Sort By:"}
        </span>
      )}
      <Select
        onValueChange={value => setSelectedItem(value)}
        defaultValue={selectedItem || selectItems[0]?.key}
        value={selectedItem || selectItems[0]?.key}
      >
        <SelectTrigger
          style={{
            width,
            height: "40px",
          }}
        >
          <SelectValue
            placeholder={
              <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                <span className='capitalize'>{selectItems[0]?.value}</span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent align='end'>
          {selectItems
            .filter(item => item !== undefined)
            .map(({ key, value, disabled }) => (
              <SelectItem key={key} value={key} disabled={disabled}>
                <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                  <span className='text-[11px] font-semibold capitalize'>
                    {value}
                  </span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortBy;
