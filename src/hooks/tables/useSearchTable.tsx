import type { Dispatch, SetStateAction } from "react";

import { useEffect, useState } from "react";
import useDebounce from "../useDebounce";
import { useNavigate, useSearch } from "@tanstack/react-router";

type UseTableSearch = [
  {
    tableSearch: string;
    debouncedTableSearch: string;
  },
  setTableSearch: Dispatch<SetStateAction<string>>,
];

interface UseSearchTableArgs {
  withoutURL?: boolean;
  showAfter?: boolean;
  defaultSearchValue?: string;
  debounceFilter?: (tableSearch: string) => string;
}

interface UseSearch extends ReturnType<typeof useSearch> {
  search?: string;
}

export const useSearchTable = ({
  withoutURL = false,
  showAfter = true,
  debounceFilter,
}: UseSearchTableArgs = {}): UseTableSearch => {
  const { search, ...rest } = useSearch({ strict: false }) as UseSearch;
  const navigate = useNavigate();

  const [tableSearch, setTableSearch] = useState<string>(
    withoutURL ? "" : (search ?? ""),
  );

  const debouncedTableSearch = useDebounce(
    debounceFilter?.(tableSearch) ?? tableSearch,
  );

  useEffect(() => {
    if (withoutURL) {
      return;
    }

    if (!debouncedTableSearch) {
      navigate({
        search: {
          ...rest,
          search: undefined,
        } as any,
      });
      return;
    }

    if (showAfter) {
      navigate({
        search: {
          ...rest,
          search: debouncedTableSearch,
        } as any,
      });
    }
  }, [search, debouncedTableSearch, withoutURL, showAfter]);

  return [
    {
      tableSearch,
      debouncedTableSearch,
    },
    setTableSearch,
  ];
};
