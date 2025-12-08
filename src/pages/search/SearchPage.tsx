import type { FC } from "react";

import { PageBase } from "@/components/global/pages/PageBase";
import {
  HeaderBannerSubtitle,
  TableSearchInput,
  useDebounce,
  DateCell,
  AdaWithTooltip,
  formatString,
  EmptyState,
} from "@vellumlabs/cexplorer-sdk";

import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useFetchMiscSearch } from "@/services/misc";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export const SearchPage: FC = () => {
  const { query } = useSearch({ from: "/search/" });
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const [searchValue, setSearchValue] = useState<string>(query || "");

  const debouncedValue = useDebounce(searchValue);

  const { data, isLoading } = useFetchMiscSearch(
    debouncedValue ? debouncedValue : undefined,
    "all",
    "en",
  );

  useEffect(() => {
    navigate({
      to: "/search",
      search: old => ({ ...old, query: debouncedValue || undefined }),
      replace: true,
    });
  }, [debouncedValue]);

  const results = Array.isArray(data?.data) ? data.data : [];

  const getCategoryRoute = (category: string, ident: string, url: string) => {
    const routes: Record<string, string> = {
      pool: `/pool/${ident}`,
      asset: `/asset/${ident}`,
      tx: `/tx/${ident}`,
      block: `/block/${ident}`,
      stake: `/stake/${ident}`,
      address: `/address/${ident}`,
      adahandle: `/address/${ident}`,
      policy: `/policy/${ident}`,
      drep: `/drep/${ident}`,
      gov_action_proposal: `/gov/action/${url.replace("/gov/action", "").replace("#", "%23")}`,
      page: url,
      user: url,
      article: url,
    };
    return routes[category] || url;
  };

  return (
    <PageBase
      metadataTitle='Search'
      title='Search'
      breadcrumbItems={[{ label: "Search", link: "/search" }]}
      subTitle={
        query && (
          <HeaderBannerSubtitle title='Query' hashString={query} hash={query} />
        )
      }
      withoutSearch
    >
      <div className='flex w-full max-w-desktop flex-col gap-4 p-mobile md:p-desktop'>
        <TableSearchInput
          value={searchValue}
          onchange={val => setSearchValue(val)}
          placeholder='Enter an address, transaction hash, block ID, or entity name to explore the Cardano blockchain'
          showSearchIcon
          wrapperClassName='w-full'
          showPrefixPopup={false}
        />

        {isLoading && debouncedValue ? (
          <div className='flex h-[150px] w-full items-center justify-center'>
            <div
              className={`loader h-[40px] w-[40px] border-[4px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"} border-t-[4px]`}
            ></div>
          </div>
        ) : debouncedValue && results.length > 0 ? (
          <div className='flex flex-col gap-3'>
            {results.map((item, index) => (
              <Link
                key={index}
                to={getCategoryRoute(item.category, item.ident, item.url)}
              >
                <div className='bg-card flex items-center justify-between rounded-l border border-border p-4 transition-all hover:bg-cardBg'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-base font-semibold text-primary'>
                      {item.title}
                    </span>
                    <span className='text-sm text-grayTextPrimary'>
                      {["page", "article"].includes(item.category)
                        ? item.url
                        : formatString(item.ident, "long")}
                    </span>
                  </div>
                  {item.extra?.value && item.extra?.type && (
                    <div className='flex flex-col items-end gap-0.5'>
                      {typeof item.extra.value === "string" ? (
                        <DateCell
                          time={item.extra.value}
                          className='text-sm'
                          tabularNums={false}
                          withoutConvert
                        />
                      ) : (
                        <span className='text-sm text-text'>
                          <AdaWithTooltip data={item.extra.value} />
                        </span>
                      )}
                      <span className='text-sm text-grayTextPrimary'>
                        {item.extra.type.charAt(0).toUpperCase() +
                          item.extra.type.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          debouncedValue &&
          results.length === 0 && (
            <EmptyState
              icon={<Search size={24} />}
              primaryText='No results found'
              secondaryText='Try adjusting your search query or use different keywords.'
            />
          )
        )}
      </div>
    </PageBase>
  );
};
