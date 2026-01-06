import type { FC } from "react";
import { useState, useEffect } from "react";

import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useFetchAdaHandle, useFetchAssetMetadata } from "@/services/assets";
import { CheckCircle, XCircle } from "lucide-react";
import { adaHandlePolicy } from "@/constants/confVariables";
import { getHandleStandard } from "@/utils/getHandleStandard";

const HANDLE_VALIDATOR_SEARCH_KEY = "handle_validator_search";

const stringToHex = (str: string): string => {
  return Array.from(str)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
};

interface HandleValidatorTabProps {
  initialHandle?: string;
}

export const HandleValidatorTab: FC<HandleValidatorTabProps> = ({
  initialHandle,
}) => {
  const [search, setSearch] = useState<string>(
    initialHandle ?? localStorage.getItem(HANDLE_VALIDATOR_SEARCH_KEY) ?? "",
  );
  const debouncedSearch = useDebounce(search.replace(/^\$/, ""), 500);

  useEffect(() => {
    localStorage.setItem(HANDLE_VALIDATOR_SEARCH_KEY, search);
  }, [search]);
  const hexSearch = debouncedSearch ? stringToHex(debouncedSearch) : undefined;

  const handleQuery = useFetchAdaHandle(hexSearch);
  const handleData = handleQuery.data?.data;

  const assetName = handleData
    ? `${adaHandlePolicy}${handleData.hex}`
    : undefined;
  const metadataQuery = useFetchAssetMetadata(assetName);
  const metadata = metadataQuery.data?.data?.data?.[0];

  const isSearching = handleQuery.isLoading || handleQuery.isFetching;
  const hasSearched = !!debouncedSearch;
  const isError = handleQuery.isError || handleQuery.data?.code === 404;
  const handleExists =
    !!handleData && !isError && handleQuery.data?.code === 200;

  const rows = handleExists
    ? [
        {
          label: "Handle",
          value: (
            <div className='flex items-center gap-2'>
              {handleData.image && (
                <img
                  src={handleData.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/",
                  )}
                  alt={handleData.name}
                  className='rounded-sm h-8 w-8 object-cover'
                />
              )}
              <div className='flex items-center gap-1'>
                <img src={DollarIcon} alt='$' className='h-[14px] w-[14px]' />
                <span className='font-medium'>{handleData.name}</span>
              </div>
              <Copy copyText={`$${handleData.name}`} size={14} />
            </div>
          ),
        },
        {
          label: "Rarity",
          value: <Badge color='gray'>{handleData.rarity}</Badge>,
        },
        {
          label: "Linked to",
          value: (
            <div className='flex items-center gap-1'>
              <Link
                to='/address/$address'
                params={{ address: handleData.holder?.address ?? "" }}
                className='text-primary'
              >
                {formatString(handleData.holder?.address ?? "", "long")}
              </Link>
              <Copy copyText={handleData.holder?.address ?? ""} size={14} />
            </div>
          ),
        },
        {
          label: "Stake key",
          value: (
            <div className='flex items-center gap-1'>
              <Link
                to='/stake/$stakeAddr'
                params={{ stakeAddr: handleData.holder?.holder ?? "" }}
                className='text-primary'
              >
                {formatString(handleData.holder?.holder ?? "", "long")}
              </Link>
              <Copy copyText={handleData.holder?.holder ?? ""} size={14} />
            </div>
          ),
        },
        {
          label: "UTXO",
          value: (
            <div className='flex items-center gap-1'>
              <Link
                to='/tx/$hash'
                params={{ hash: handleData.utxo?.split("#")[0] ?? "" }}
                className='text-primary'
              >
                {formatString(handleData.utxo ?? "", "long")}
              </Link>
              <Copy copyText={handleData.utxo ?? ""} size={14} />
            </div>
          ),
        },
        ...(metadata
          ? [
              {
                label: "Last change",
                value: (
                  <div className='flex flex-col gap-1'>
                    <span>Date: {metadata.tx?.time ?? "-"}</span>
                    <div className='flex items-center gap-1'>
                      <span>Transaction:</span>
                      <Link
                        to='/tx/$hash'
                        params={{ hash: metadata.tx?.hash ?? "" }}
                        className='text-primary'
                      >
                        {formatString(metadata.tx?.hash ?? "", "long")}
                      </Link>
                      <Copy copyText={metadata.tx?.hash ?? ""} size={14} />
                    </div>
                  </div>
                ),
              },
              {
                label: "Metadata standard",
                value: (
                  <Badge color='gray'>
                    {getHandleStandard(handleData.hex)}
                  </Badge>
                ),
              },
              {
                label: "Metadata",
                value: (
                  <pre className='rounded-sm max-h-[300px] overflow-auto bg-darker p-2 text-text-xs'>
                    {JSON.stringify(metadata.json, null, 2)}
                  </pre>
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className='flex w-full flex-col gap-3'>
      <TableSearchInput
        value={search}
        onchange={val => setSearch(val)}
        placeholder='Search by $handle or asset ID...'
        showSearchIcon
        wrapperClassName='w-full'
        showPrefixPopup={false}
      />

      {hasSearched && (
        isSearching ? (
          <div className='rounded-m border border-border p-3'>
            <LoadingSkeleton height='20px' width='150px' rounded='sm' />
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 rounded-m border p-3 ${
              handleExists
                ? "border-greenText bg-[rgba(16,185,129,0.1)]"
                : "border-redText bg-[rgba(239,68,68,0.1)]"
            }`}
          >
            {handleExists ? (
              <>
                <CheckCircle size={20} className='text-greenText' />
                <span className='text-greenText'>Handle is valid.</span>
              </>
            ) : (
              <>
                <XCircle size={20} className='text-redText' />
                <span className='text-redText'>Not a valid handle.</span>
              </>
            )}
          </div>
        )
      )}

      {hasSearched && (
        <div className='w-full rounded-m border border-border'>
          {isSearching ? (
            <div className='flex flex-col gap-2 p-3'>
              <LoadingSkeleton height='24px' rounded='sm' />
              <LoadingSkeleton height='24px' rounded='sm' />
              <LoadingSkeleton height='24px' rounded='sm' />
            </div>
          ) : handleExists ? (
            <div className='flex flex-col'>
              {rows.map((row, index) => (
                <div
                  key={row.label}
                  className={`flex gap-3 px-3 py-2 text-text-sm ${
                    index % 2 === 0 ? "bg-cardBg" : ""
                  } ${row.label === "Metadata" || row.label === "Last change" ? "items-start" : "items-center"}`}
                >
                  <span className='min-w-[120px] text-grayTextPrimary'>
                    {row.label}
                  </span>
                  <span className='flex-1'>{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex w-full items-center justify-center p-6 text-grayTextPrimary'>
              Handle "${debouncedSearch}" not found
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
