import type { FC } from "react";
import { useState } from "react";

import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useFetchMiscSearch } from "@/services/misc";
import { useFetchAssetDetail } from "@/services/assets";
import { CheckCircle, XCircle } from "lucide-react";

export const HandleValidatorTab: FC = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search.replace(/^\$/, ""), 500);

  const searchQuery = useFetchMiscSearch(
    debouncedSearch || undefined,
    "adahandle",
  );

  const searchResult = Array.isArray(searchQuery.data?.data)
    ? searchQuery.data?.data?.[0]
    : searchQuery.data?.data;

  const fingerprint = searchResult?.ident;

  const detailQuery = useFetchAssetDetail(fingerprint ?? "", {
    enabled: !!fingerprint,
  });

  const isSearching = searchQuery.isLoading || searchQuery.isFetching;
  const isLoadingDetails = detailQuery.isLoading || detailQuery.isFetching;
  const hasSearched = !!debouncedSearch;
  const handleExists = !!searchResult && !!fingerprint;

  const detail = detailQuery.data?.data;

  const rows = [
    {
      label: "Handle",
      value: handleExists ? (
        <Link
          to='/asset/$fingerprint'
          params={{ fingerprint: fingerprint ?? "" }}
          className='text-primary'
        >
          ${debouncedSearch}
        </Link>
      ) : (
        `$${debouncedSearch}`
      ),
    },
    {
      label: "Status",
      value: handleExists ? (
        <div className='flex items-center gap-1 text-greenText'>
          <CheckCircle size={16} />
          <span>Exists</span>
        </div>
      ) : (
        <div className='flex items-center gap-1 text-redText'>
          <XCircle size={16} />
          <span>Not found</span>
        </div>
      ),
    },
    ...(handleExists && detail
      ? [
          {
            label: "Fingerprint",
            value: (
              <div className='flex items-center gap-1'>
                <span>{formatString(detail.fingerprint ?? "", "long")}</span>
                <Copy copyText={detail.fingerprint ?? ""} size={14} />
              </div>
            ),
          },
          {
            label: "Policy ID",
            value: (
              <div className='flex items-center gap-1'>
                <Link
                  to='/policy/$policyId'
                  params={{ policyId: detail.policy ?? "" }}
                  className='text-primary'
                >
                  {formatString(detail.policy ?? "", "long")}
                </Link>
                <Copy copyText={detail.policy ?? ""} size={14} />
              </div>
            ),
          },
          {
            label: "Minted",
            value: detail.stat?.asset?.first_mint ? (
              <TimeDateIndicator time={detail.stat.asset.first_mint} />
            ) : (
              "-"
            ),
          },
        ]
      : []),
  ];

  return (
    <div className='flex w-full flex-col gap-3'>
      <div className='flex w-full'>
        <TableSearchInput
          value={search}
          onchange={val => setSearch(val)}
          placeholder='Enter handle name (e.g. $viktor)...'
          showSearchIcon
          wrapperClassName='w-full max-w-[500px]'
          showPrefixPopup={false}
        />
      </div>

      {hasSearched && (
        <div className='w-full rounded-m border border-border'>
          {isSearching || isLoadingDetails ? (
            <div className='flex flex-col gap-2 p-3'>
              <LoadingSkeleton height='24px' rounded='sm' />
              <LoadingSkeleton height='24px' rounded='sm' />
              <LoadingSkeleton height='24px' rounded='sm' />
            </div>
          ) : (
            <div className='flex flex-col'>
              {rows.map((row, index) => (
                <div
                  key={row.label}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    index % 2 === 0 ? "bg-cardBg" : ""
                  }`}
                >
                  <span className='min-w-[120px] text-grayTextPrimary'>
                    {row.label}
                  </span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className='flex w-full items-center justify-center rounded-m border border-border p-6 text-grayTextPrimary'>
          Enter a handle name to check if it exists
        </div>
      )}
    </div>
  );
};
