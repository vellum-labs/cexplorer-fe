import type { FC } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
  nord,
  qtcreatorLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import Copy from "./Copy";

import { useThemeStore } from "@/stores/themeStore";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

import { colors } from "@/constants/colors";

interface JSONDisplayProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  search?: boolean;
  iconsRight?: string;
  onClose?: () => void;
}

export const JsonDisplay: FC<JSONDisplayProps> = ({
  data,
  isError,
  isLoading,
  search,
  iconsRight = "24px",
  onClose,
}) => {
  const { theme } = useThemeStore();
  const [filteredData, setFilteredData] = useState(data);
  const [inputOpen, setInputOpen] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [matchOffsets, setMatchOffsets] = useState<number[]>([]);
  const [currentOffset, setCurrentOffset] = useState<{
    offset: number;
    index: number;
  }>({
    offset: 0,
    index: 0,
  });

  const debouncedInputSearch = useDebounce(inputSearch);

  const codeRef = useRef<HTMLElement>(null);
  const codeRefContainer = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setCurrentOffset({
      offset: matchOffsets[0] ? matchOffsets[0] : 0,
      index: matchOffsets[0] ? 1 : 0,
    });
  }, [matchOffsets]);

  useEffect(() => {
    if (!isLoading && !isError && !Array.isArray(data?.data) && data?.data) {
      setFilteredData(() => {
        const newData = {
          ...data?.data,
        };

        delete newData.datum;
        delete newData.tx;
        delete newData.hash;
        delete newData.datums_in_same_tx;

        return newData;
      });
    } else {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    const closeInput = () => {
      setInputOpen(false);
      setInputSearch("");
    };

    const controller = new AbortController();
    const signal = controller.signal;

    document.addEventListener("click", closeInput, { signal });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (
      !codeRefContainer.current ||
      currentOffset.index === 0 ||
      !codeRef.current
    )
      return;

    const container = codeRefContainer.current as HTMLPreElement;

    container.scrollTo({
      top: currentOffset.offset - 20,
      behavior: "smooth",
    });

    const codeLines = codeRef.current.firstElementChild?.firstChild
      ?.childNodes as NodeListOf<ChildNode>;

    if (!codeLines) return;

    codeLines.forEach(codeLine => {
      if (!codeLine.childNodes) return;

      codeLine.childNodes.forEach((line, _, parent) => {
        const codeLineNumber = (parent[0] as HTMLSpanElement).innerText;
        const codeLineText = (line as HTMLSpanElement).innerText;
        if (
          !line ||
          !codeLineText ||
          (line as HTMLSpanElement).innerText === codeLineNumber
        ) {
          return;
        }

        const lineOffsetTop = (line as HTMLSpanElement).offsetTop;

        if (
          !codeLineText
            .toLowerCase()
            .includes(debouncedInputSearch.toLowerCase().trim())
        )
          return;

        if (lineOffsetTop === currentOffset.offset) {
          (line as HTMLSpanElement).style.backgroundColor = "orange";
        } else {
          (line as HTMLSpanElement).style.backgroundColor = "yellow";
        }
      });
    });
  }, [currentOffset]);

  useEffect(() => {
    if (!codeRef.current || !codeRefContainer.current) return;

    const codeLines = codeRef.current.firstElementChild?.firstChild
      ?.childNodes as NodeListOf<ChildNode>;

    if (!codeLines) return;

    let firstLine = true;
    const container = codeRefContainer.current as HTMLPreElement;
    const offsets: number[] = [];

    codeLines.forEach(codeLine => {
      if (!codeLine.childNodes) return;

      codeLine.childNodes.forEach((line, _, parent) => {
        const codeLineNumber = (parent[0] as HTMLSpanElement).innerText;
        const codeLineText = (line as HTMLSpanElement).innerText;

        if (
          !line ||
          !codeLineText ||
          (line as HTMLSpanElement).innerText === codeLineNumber
        ) {
          return;
        }

        if (debouncedInputSearch === "") {
          (line as HTMLSpanElement).style.backgroundColor = "transparent";
          return;
        }

        if (
          codeLineText
            .toLowerCase()
            .includes(debouncedInputSearch.toLowerCase().trim())
        ) {
          const lineOffsetTop = (line as HTMLSpanElement).offsetTop;
          offsets.push(lineOffsetTop);
          if (firstLine) {
            container.scrollTo({
              top: lineOffsetTop - 20,
              behavior: "smooth",
            });

            firstLine = false;
          }
        } else {
          (line as HTMLSpanElement).style.backgroundColor = "transparent";
        }
      });
    });

    setMatchOffsets(offsets);
  }, [debouncedInputSearch]);

  return (
    <div
      className={`shadow relative h-full w-full overflow-hidden rounded-m border border-border !bg-cardBg text-text-md text-text-xs`}
    >
      {!isError && !Array.isArray(data?.data) && (
        <div
          className='absolute top-2 flex items-center gap-1/2'
          onClick={e => {
            e.stopPropagation();
          }}
          style={{
            right: iconsRight,
          }}
        >
          {search && (
            <div className='relative right-[15px] flex items-center'>
              <Search
                size={15}
                className={`absolute ${inputOpen ? "left-2 top-1" : ""} rounded-lg cursor-pointer`}
                onClick={() => setInputOpen(true)}
                color={inputOpen ? "black" : undefined}
              />
              <input
                type='text'
                className={`${inputOpen ? "w-[200px] pl-3" : "w-0"} transition-width overflow-hidden rounded-m text-black duration-300 ease-in-out`}
                value={inputSearch}
                onChange={e => setInputSearch(e.currentTarget.value)}
              />
              <div
                className={`absolute ${inputOpen && debouncedInputSearch && currentOffset ? "right-2 top-0" : "hidden"} flex items-center gap-1`}
              >
                <span className='text-black'>
                  {currentOffset.index + "/" + matchOffsets.length}
                </span>
                <div className='flex items-center'>
                  <ChevronUp
                    size={15}
                    className={
                      currentOffset.index === 1 ? "pointer-events-none" : ""
                    }
                    color={currentOffset.index === 1 ? colors.border : "black"}
                    onClick={() =>
                      setCurrentOffset(prev => {
                        if (prev.index - 1 < 0) {
                          return prev;
                        }

                        return {
                          offset: matchOffsets[prev.index - 2],
                          index: prev.index - 1,
                        };
                      })
                    }
                  />
                  <ChevronDown
                    size={15}
                    className={
                      currentOffset.index === matchOffsets.length
                        ? "pointer-events-none"
                        : ""
                    }
                    color={
                      currentOffset.index === matchOffsets.length
                        ? colors.border
                        : "black"
                    }
                    onClick={() =>
                      setCurrentOffset(prev => {
                        if (prev.index + 1 > matchOffsets.length) {
                          return prev;
                        }

                        return {
                          offset: matchOffsets[prev.index],
                          index: prev.index + 1,
                        };
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <Copy
            copyText={JSON.stringify(filteredData, (_key, value) =>
              typeof value === "bigint" ? value.toString() : value,
            )}
          />
          {onClose && (
            <X onClick={onClose} size={15} className='cursor-pointer' />
          )}
        </div>
      )}
      <pre className='h-full w-full overflow-y-auto' ref={codeRefContainer}>
        <code className='language-json' ref={codeRef}>
          {!isError ? (
            isLoading ? (
              <LoadingSkeleton height='100%' width='100%' />
            ) : (
              <SyntaxHighlighter
                language='javascript'
                style={theme === "dark" ? nord : qtcreatorLight}
                showLineNumbers
                wrapLines
              >
                {JSON.stringify(
                  filteredData,
                  (_key, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                  2,
                )}
              </SyntaxHighlighter>
            )
          ) : (
            <span className='pl-[10px]'>No data found</span>
          )}
        </code>
      </pre>
    </div>
  );
};
