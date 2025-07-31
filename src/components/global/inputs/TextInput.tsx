import type { DOMAttributes, ReactNode } from "react";

import { colors } from "@/constants/colors";
import { Search, X } from "lucide-react";
import { Input } from "../../ui/input";

type Props = {
  placeholder: string;
  className?: string;
  value: string;
  showSearchIcon?: boolean;
  prefixContent?: ReactNode;
  inputClassName?: string;
  wrapperClassName?: string;
  options?: React.HTMLInputTypeAttribute;
  onchange: (value: string) => void;
  onKeyDown?: DOMAttributes<HTMLInputElement>["onKeyDown"];
  onFocus?: DOMAttributes<HTMLInputElement>["onFocus"];
  onBlur?: DOMAttributes<HTMLInputElement>["onBlur"];
};

const TextInput = ({
  placeholder,
  value,
  onchange,
  inputClassName,
  wrapperClassName,
  prefixContent,
  showSearchIcon,
  onKeyDown,
  onFocus,
  onBlur,
  disabled,
  ...rest
}: Props & React.ComponentProps<"input">) => {
  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      {prefixContent && prefixContent}
      {showSearchIcon && (
        <Search
          size={20}
          className={`absolute left-3`}
          color={colors.grayTextPrimary}
        />
      )}
      <Input
        value={value}
        onchange={onchange}
        placeholder={placeholder}
        className={`${showSearchIcon && "pl-10"} ${value && !disabled && "pr-8"} bg-cardBg text-sm ${inputClassName}`}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        {...rest}
      />
      {value && !disabled && (
        <button className='absolute right-2' onClick={() => onchange("")}>
          <X size={20} color={colors.grayTextPrimary} />
        </button>
      )}
    </div>
  );
};

export default TextInput;
