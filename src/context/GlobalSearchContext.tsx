import type { MiscSearch } from "@/types/miscTypes";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import useDebounce from "@/hooks/useDebounce";
import { useFetchMiscSearch } from "@/services/misc";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useLocaleStore } from "@/stores/localeStore";
import { getCategories } from "@/utils/globalSearch/getCategories";

export type Category =
  | "all"
  | "tx"
  | "block"
  | "pool"
  | "asset"
  | "policy"
  | "address"
  | "stake"
  | "adahandle"
  | "user"
  | "article"
  | "page"
  | "gov_action_proposal";

interface GlobalSearchContextProps {
  focused: boolean;
  categoriesOverflow: boolean;
  search: string;
  recentSearch: string[];
  searchCategory: Category;
  activeTab: string;
  categories: ReturnType<typeof getCategories>;
  categoriesRef: React.RefObject<HTMLDivElement>;
  searchRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  data: MiscSearch[];
  setRecentSearch: Dispatch<SetStateAction<string[]>>;
  setSearchCategory: Dispatch<SetStateAction<Category>>;
  handleSearchChange: (value: string) => void;
  handleInput: (type: "focus" | "blur") => void;
  handleCategoryChange: (category: string) => void;
  handleSearchRecentDelete: (index: number) => void;
  scroll: (direction: "left" | "right") => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextProps | null>(
  null,
);

interface GlobalSearchProviderProps {
  children: ReactNode;
}

export const GlobalSearchProvider: React.FC<GlobalSearchProviderProps> = ({
  children,
}) => {
  const { locale } = useLocaleStore();

  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState<Category>("all");
  const [categoriesOverflow, setCategoriesOverflow] = useState(false);

  const [recentSearch, setRecentSearch] = useState<string[]>([]);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search.toLowerCase());
  const debouncedCategoriesOverflow = useDebounce(categoriesOverflow, 300);

  const { data, isLoading, isFetching } = useFetchMiscSearch(
    debouncedSearch ? debouncedSearch.replace("$", "") : undefined,
    searchCategory !== "all" ? searchCategory : undefined,
    locale,
  );

  const categories = getCategories(data?.data);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleInput = (type: "focus" | "blur") => {
    setFocused(type === "focus");
  };

  const handleCategoryChange = (category: string) => {
    setActiveTab(category);
  };

  const handleSearchRecentDelete = (index: number) => {
    const GLOBAL_SEARCH_KEY = "global_search";
    const globalSearchStorage = localStorage.getItem(GLOBAL_SEARCH_KEY);

    if (globalSearchStorage && recentSearch[index]) {
      const newArr = [...recentSearch];
      newArr.splice(index, 1);

      localStorage.setItem(GLOBAL_SEARCH_KEY, JSON.stringify(newArr));
      setRecentSearch(newArr);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = categoriesRef.current;
    if (container) {
      const scrollAmount = 150;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!categoriesRef.current) return;

    const container = categoriesRef.current;
    const resizeObserver = new ResizeObserver(() => {
      const threshold = 20;
      const scrollWidth = Math.floor(container.scrollWidth);
      const clientWidth = Math.floor(container.clientWidth);
      setCategoriesOverflow(scrollWidth - clientWidth > threshold);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        handleInput("blur");
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (isLoading || isFetching) {
      const GLOBAL_SEARCH_KEY = "global_search";
      const globalSearchStorage = localStorage.getItem(GLOBAL_SEARCH_KEY);

      if (!globalSearchStorage) {
        localStorage.setItem(GLOBAL_SEARCH_KEY, JSON.stringify([search]));
        return;
      }

      const recentSearches = [
        search,
        ...JSON.parse(globalSearchStorage).slice(0, 9).flat(),
      ];

      localStorage.setItem(
        GLOBAL_SEARCH_KEY,
        JSON.stringify([...new Set(recentSearches)]),
      );
    }
  }, [isLoading, isFetching]);

  const value: GlobalSearchContextProps = {
    focused,
    categoriesOverflow: debouncedCategoriesOverflow,
    search,
    searchCategory,
    recentSearch,
    activeTab,
    categories,
    categoriesRef,
    isLoading,
    searchRef,
    data: Array.isArray(data?.data)
      ? data.data
      : typeof data === "undefined"
        ? []
        : [data.data],
    setRecentSearch,
    setSearchCategory,
    handleSearchChange,
    handleInput,
    handleCategoryChange,
    handleSearchRecentDelete,
    scroll,
  };

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearch = (): GlobalSearchContextProps => {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error(
      "useGlobalSearch must be used within a GlobalSearchProvider",
    );
  }
  return context;
};
