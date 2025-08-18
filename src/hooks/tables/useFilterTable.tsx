import type { MouseEvent, RefObject } from "react";

import { useLocation, useNavigate } from "@tanstack/react-router";
import { createRef, useEffect, useMemo, useReducer, useState } from "react";
import { useClickOutsideGroup } from "../useClickOutsideGroup";

type DraftState = Record<string, any>;

type ReducerState = {
  [key: string]: boolean;
};

export type FilterState = {
  [key: string]: string | undefined;
};

type Action = { type: "CLOSE" } | { type: "TOGGLE"; key: string };

interface useFilterTableArgs {
  storeKey?: string;
  filterKeys: string[];
  overrideFilters?: {
    [key: string]: any;
  };
  parseMap?: Record<string, (value: string | undefined) => any>;
  disableSearchSync?: boolean;
  tabName?: string;
  hrefName?: string;
  onlyURL?: string[];
}

interface useFilterTableReturn {
  filterVisibility: ReducerState;
  filter: FilterState;
  hasFilter: boolean;
  anchorRefs: Record<string, RefObject<HTMLDivElement>>;
  toggleFilter: (e: MouseEvent<any, any>, key: string) => void;
  changeFilterByKey: (key: string, value?: any) => void;
  filterDraft: DraftState;
  changeDraftFilter: (key: string, value?: any) => void;
}

export const useFilterTable = ({
  filterKeys,
  storeKey,
  parseMap,
  overrideFilters,
  disableSearchSync = false,
  tabName,
  hrefName,
  onlyURL = [],
}: useFilterTableArgs): useFilterTableReturn => {
  const { search, searchStr, href } = useLocation();

  const navigate = useNavigate();
  const [hasFilter, setHasFilter] = useState<boolean>(false);

  const hasSearchParams = useMemo(() => {
    if (disableSearchSync) return false;
    return filterKeys.some(key => (search as any)?.[key]);
  }, [search, filterKeys, disableSearchSync]);

  const anchorRefs = useMemo(() => {
    return Object.fromEntries(
      filterKeys.map(key => [key, createRef<HTMLDivElement>()]),
    ) as Record<string, RefObject<HTMLDivElement>>;
  }, [filterKeys]);

  useClickOutsideGroup(Object.values(anchorRefs), () => {
    dispatch({ type: "CLOSE" });
  });

  const STORAGE_KEY = storeKey
    ? storeKey + "_filter"
    : "defi_order_list_filter";

  const initialOpenState: ReducerState = filterKeys.reduce((acc, key) => {
    if (acc) {
      return { ...acc, [key]: false };
    }

    return { [key]: false };
  }, {});

  const reducer = (state: ReducerState, action: Action) => {
    const newState = Object.fromEntries(
      Object.keys(state).map(key => [key, false]),
    ) as ReducerState;

    switch (action.type) {
      case "TOGGLE":
        return { ...newState, [action.key]: !state[action.key] };
      case "CLOSE":
        return newState;
    }
  };

  const [filter, setFilter] = useState<FilterState>(() => {
    const filterStorage = localStorage.getItem(STORAGE_KEY);

    if (!filterStorage || hasSearchParams) {
      return filterKeys.reduce<FilterState>((acc, key) => {
        acc[key] = (search as any)?.[key] ?? undefined;

        if (overrideFilters && overrideFilters[key]) {
          acc[key] = overrideFilters[key];
        }

        return acc;
      }, {});
    }

    const parsedFilterStorage = JSON.parse(filterStorage) as FilterState;

    return filterKeys.reduce<FilterState>((acc, key) => {
      acc[key] = parsedFilterStorage[key];

      if (overrideFilters && overrideFilters[key]) {
        acc[key] = overrideFilters[key];
      }

      return acc;
    }, {});
  });

  const [filterDraft, setFilterDraft] = useState<DraftState>(() => {
    return filterKeys.reduce((acc, key) => {
      const parse = parseMap?.[key];
      acc[key] = parse ? parse(filter[key]) : filter[key];
      return acc;
    }, {} as DraftState);
  });

  const [filterVisibility, dispatch] = useReducer(reducer, initialOpenState);

  const toggleFilter = (e: MouseEvent<any, any>, key: string) => {
    e.stopPropagation();

    return dispatch({ type: "TOGGLE", key });
  };

  const changeFilterByKey = (key: string, value?: any) => {
    dispatch({ type: "CLOSE" });

    setFilter(prev => {
      const newFilter = { ...prev, [key]: value };

      const filteredFilter = Object.fromEntries(
        Object.entries(newFilter).filter(item => !onlyURL.includes(item[0])),
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFilter));

      return newFilter;
    });

    if (!disableSearchSync) {
      navigate({
        search: {
          ...search,
          page: search?.page ? 1 : undefined,
          [key]: value,
        } as any,
      });
    }
  };

  const changeDraftFilter = (
    key: string,
    value: any | ((prev: any) => any),
  ) => {
    setFilterDraft(prev => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key]) : value,
    }));
  };

  useEffect(() => {
    const filterStorage = localStorage.getItem(STORAGE_KEY);

    const hasFilterRaw = filterKeys.some(key => !!filter[key]);
    setHasFilter(hasFilterRaw);

    setFilterDraft(() =>
      filterKeys.reduce((acc, key) => {
        const parse = parseMap?.[key];
        acc[key] = parse ? parse(filter[key]) : filter[key];

        if (overrideFilters && overrideFilters[key]) {
          acc[key] = undefined;
        }
        return acc;
      }, {} as DraftState),
    );

    if (!disableSearchSync && filterStorage && !hasSearchParams) {
      const parsedStorage = JSON.parse(filterStorage) as FilterState;

      const updatedSearch = Object.fromEntries(
        Object.entries(search).filter(
          ([key]) =>
            key === "tab" ||
            key === "subTab" ||
            key === "page" ||
            key === "sort" ||
            key === "order" ||
            key === "search",
        ),
      ) as Record<string, string | undefined>;

      filterKeys.forEach(key => {
        updatedSearch[key] = parsedStorage[key];

        if (overrideFilters && overrideFilters[key]) {
          updatedSearch[key] = undefined;
        }
      });

      if (
        !tabName ||
        searchStr.includes(tabName) ||
        (hrefName && href.includes(hrefName))
      ) {
        navigate({ search: updatedSearch as any, replace: true });
      }
    }
  }, [
    filter,
    hasSearchParams,
    overrideFilters,
    disableSearchSync,
    search,
    searchStr,
  ]);

  useEffect(() => {
    if (disableSearchSync) return;

    const prevPath = window.location.pathname;

    const windowTab = window.location.search.match(/[?&]tab=([^&]*)/);
    const windowTabValue = windowTab ? windowTab[1] : undefined;

    const windowSubTab = window.location.search.match(/[?&]subTab=([^&]*)/);
    const windowSubTabValue = windowSubTab ? windowSubTab[1] : undefined;

    return () => {
      const nextPath = window.location.pathname;
      if (
        prevPath === nextPath &&
        windowTabValue === search.tab &&
        windowSubTabValue === search.subTab
      )
        return;

      const currentParams = new URLSearchParams(window.location.search);

      filterKeys.forEach(key => {
        currentParams.delete(key);
      });

      const updatedParams = Object.fromEntries(
        [...currentParams.entries()].filter(
          ([key]) =>
            (key === "tab" ||
              key === "subTab" ||
              key === "page" ||
              key === "sort" ||
              key === "order" ||
              key === "search") &&
            !filterKeys.includes(key),
        ),
      );

      navigate({ search: updatedParams, replace: true } as any);
    };
  }, [disableSearchSync]);

  return {
    filterVisibility,
    filterDraft,
    filter,
    hasFilter,
    anchorRefs,
    toggleFilter,
    changeDraftFilter,
    changeFilterByKey,
  };
};
