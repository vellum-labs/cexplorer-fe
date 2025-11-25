import type { Dispatch, SetStateAction } from "react";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useNavigate, useSearch } from "@tanstack/react-router";

type UseTableSearch = [
  {
    tableSearch: string;
    debouncedTableSearch: string;
    searchPrefix: string;
  },
  setTableSearch: Dispatch<SetStateAction<string>>,
  setSearchPrefix: Dispatch<SetStateAction<string>>,
];

interface UseSearchTableArgs {
  withoutURL?: boolean;
  defaultSearchValue?: string;
  debounceFilter?: (tableSearch: string) => string;
  validPrefixes?: string[];
}

interface UseSearch extends ReturnType<typeof useSearch> {
  search?: string;
}

export const useSearchTable = ({
  withoutURL = false,
  debounceFilter,
  validPrefixes = [],
}: UseSearchTableArgs = {}): UseTableSearch => {
  const { search, ...rest } = useSearch({ strict: false }) as UseSearch;
  const navigate = useNavigate();

  const prevSearchRef = useRef<string | undefined>(search);

  const parseSearchFromURL = (urlSearch: string) => {
    if (!urlSearch || !urlSearch.includes(":")) {
      return { prefix: "", searchString: urlSearch };
    }

    const [prefix, ...searchParts] = urlSearch.split(":");
    const searchString = searchParts.join(":");

    if (validPrefixes.length > 0 && !validPrefixes.includes(prefix)) {
      return { prefix: "", searchString: urlSearch };
    }

    return { prefix, searchString };
  };

  const initialParsed = parseSearchFromURL(search ?? "");

  const [searchPrefix, setSearchPrefix] = useState<string>(
    withoutURL ? "" : initialParsed.prefix,
  );

  const [tableSearch, setTableSearch] = useState<string>(
    withoutURL ? "" : initialParsed.searchString,
  );

  const debouncedTableSearch = useDebounce(
    debounceFilter?.(tableSearch) ?? tableSearch,
  );

  useEffect(() => {
    if (withoutURL) {
      return;
    }

    const currentUrlSearch = search ?? "";
    const prevUrlSearch = prevSearchRef.current ?? "";

    if (prevUrlSearch && !currentUrlSearch) {
      const currentStateSearch = searchPrefix
        ? `${searchPrefix}:${tableSearch}`
        : tableSearch;

      if (currentStateSearch !== currentUrlSearch) {
        setSearchPrefix("");
        setTableSearch("");
        prevSearchRef.current = search;
        return;
      }
    }

    prevSearchRef.current = search;

    const formatSearchForURL = () => {
      if (!debouncedTableSearch) {
        return undefined;
      }

      if (
        searchPrefix &&
        validPrefixes.length > 0 &&
        validPrefixes.includes(searchPrefix)
      ) {
        return `${searchPrefix}:${debouncedTableSearch}`;
      }

      return debouncedTableSearch;
    };

    const urlSearch = formatSearchForURL();

    const shouldUpdate =
      validPrefixes.length === 0 || !debouncedTableSearch || !!searchPrefix;

    if (shouldUpdate) {
      const currentSearch = search ?? "";
      const newSearch = urlSearch ?? "";

      if (currentSearch !== newSearch) {
        navigate({
          search: {
            ...rest,
            search: urlSearch,
            page: 1,
          } as any,
        });
      }
    }
  }, [search, debouncedTableSearch, searchPrefix, withoutURL, validPrefixes]);

  return [
    {
      tableSearch,
      debouncedTableSearch,
      searchPrefix,
    },
    setTableSearch,
    setSearchPrefix,
  ];
};
