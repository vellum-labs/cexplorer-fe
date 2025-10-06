import { colors } from "@/constants/colors";
import { formatString } from "@/utils/format/format";
import { Search, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "../../ui/input";

interface Prefix {
  key: string;
  name: string;
  show: boolean;
}

type Props = {
  placeholder: string;
  className?: string;
  value: string;
  onchange: (value: string) => void;
  showSearchIcon?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  prefixes?: Prefix[];
  searchPrefix?: string;
  setSearchPrefix?: (prefix: string) => void;
  options?: React.HTMLInputTypeAttribute;
  showPrefixPopup?: boolean;
  stretchPrefix?: boolean;
  prefixClassname?: string;
};

const TableSearchInput = ({
  placeholder,
  value,
  onchange,
  inputClassName,
  wrapperClassName,
  searchPrefix,
  setSearchPrefix,
  showSearchIcon,
  prefixes,
  showPrefixPopup = true,
  stretchPrefix = false,
  prefixClassname,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [showPrefixes, setShowPrefixes] = useState(false);
  const activePrefix = prefixes?.find(
    prefix =>
      value.startsWith(`${prefix.name}:`) || value.startsWith(`${prefix.key}:`),
  );

  const hasPrefix = prefixes?.some(prefix =>
    value.startsWith(`${prefix.name}:`),
  );
  const [afterPrefixValue, setAfterPrefixValue] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    setShowPrefixes(false);
    if (event.key === "Backspace") {
      if (searchPrefix && (!value || value === `${searchPrefix}:`)) {
        onchange("");

        if (setSearchPrefix) {
          setSearchPrefix("");
        }
      }
    }

    if (!searchPrefix) {
      setShowPrefixes(true);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (activePrefix && setSearchPrefix && searchPrefix !== activePrefix.key) {
      setSearchPrefix(activePrefix.key);
    }
  }, [activePrefix, setSearchPrefix, searchPrefix]);

  useLayoutEffect(() => {
    if (value && searchPrefix && activePrefix) {
      setAfterPrefixValue(value.slice(value.indexOf(":") + 1));
    } else setAfterPrefixValue(value);
  }, [value, searchPrefix, activePrefix]);

  useLayoutEffect(() => {
    if (inputRef.current) {
      setDropdownWidth(inputRef.current.offsetWidth);
      setDropdownHeight(inputRef.current.offsetHeight);
    }
  }, [inputRef.current?.offsetWidth]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center ${wrapperClassName}`}
    >
      {searchPrefix && (
        <span
          ref={prefixRef}
          className={`absolute bg-darker p-1/2 text-sm font-medium ${stretchPrefix ? "flex h-full items-center pl-2" : "left-3"} ${prefixClassname ? prefixClassname : ""}`}
        >
          {searchPrefix}
          {stretchPrefix ? "" : ":"}
        </span>
      )}
      <Input
        ref={inputRef}
        value={afterPrefixValue}
        onchange={onchange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={
          searchPrefix
            ? {
                paddingLeft: (prefixRef.current?.offsetWidth || 0) + 15 + "px",
              }
            : {}
        }
        className={`relative h-10 pr-4 ${hasPrefix && ""} ${inputClassName}`}
        onFocus={() => {
          !searchPrefix && setShowPrefixes(true);
        }}
        onClick={() => {
          !searchPrefix && setShowPrefixes(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowPrefixes(false);
          }, 150);
        }}
      />
      {value || searchPrefix ? (
        <button
          className='absolute right-2'
          onClick={() => {
            onchange("");
            if (setSearchPrefix) {
              setSearchPrefix("");
            }
          }}
        >
          <X size={20} color={colors.grayTextPrimary} />
        </button>
      ) : showSearchIcon ? (
        <Search
          size={20}
          color={colors.grayTextPrimary}
          className='absolute right-2'
        />
      ) : (
        <></>
      )}
      {showPrefixes && showPrefixPopup && (
        <div
          style={{
            width: dropdownWidth + "px",
            top: dropdownHeight + 1 + "px",
          }}
          className={`absolute right-0 z-30 min-h-[36px] rounded-s border border-border bg-background`}
        >
          {prefixes
            ?.filter(prefix => prefix.show)
            .map((prefix, index) => (
              <button
                key={index}
                className='flex w-full items-center overflow-hidden text-ellipsis border-b border-border px-1.5 py-1 text-sm last:rounded-bl-md last:rounded-br-md last:border-b-0 hover:bg-darker'
                onClick={() => {
                  onchange(`${prefix.name}:${value}`);
                  inputRef.current?.focus();
                }}
              >
                <span className='text-sm font-medium'>{prefix.name}:</span>
                <span className='ml-1/2'>
                  {value.length > 19 ? formatString(value, "long") : value}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default TableSearchInput;
