import { AddressInspectorRow } from "@/components/address/AddressInspectorRow";
import Copy from "@/components/global/Copy";
import { AddressTypeInitialsBadge } from "@/components/global/badges/AddressTypeInitialsBadge";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import type { FC } from "react";

import useDebounce from "@/hooks/useDebounce";
import { useLucidAddressInspector } from "@/hooks/useLucidAddressInspector";
import { Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { ArrowRight } from "lucide-react";
import { PageBase } from "@/components/global/pages/PageBase";

export const AddressInspector: FC = () => {
  const { view } = useSearch({
    from: "/address/inspector",
  });

  const [search, setSearch] = useState<string>(view ?? "");

  const debouncedAddressSearch = useDebounce(search);

  const { data, isFetching, isLoading } = useLucidAddressInspector(
    debouncedAddressSearch ? debouncedAddressSearch : undefined,
  );

  let addr = {} as any;

  if (isValidAddress(data?.address)) {
    addr = Address.from(data?.address as string);
  }

  const rows = [
    {
      title: "Address",
      darker: true,
      value: (() => {
        if (!data?.address) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-2'>
            <span>{data?.address}</span>
            <Copy copyText={data?.address} className='translate-y-[2px]' />
          </div>
        );
      })(),
    },
    {
      title: "Address type",
      darker: false,
      value: (() => {
        if (!data?.address || !addr?.raw) {
          return "Not found";
        }

        return <AddressTypeInitialsBadge address={data?.address} />;
      })(),
    },
    {
      title: "Stake key",
      darker: true,
      value: (() => {
        if (!addr?.rewardAddress) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-2'>
            <span>{addr?.rewardAddress}</span>
            <Copy
              copyText={addr?.rewardAddress}
              className='translate-y-[2px]'
            />
          </div>
        );
      })(),
    },
    {
      title: "Magic",
      darker: false,
      value:
        typeof data?.magic === "undefined" || data.magic === -1
          ? "Not found"
          : data.magic,
    },
    {
      title: "Header",
      darker: true,
      value:
        typeof data?.header === "undefined" || data.magic === -1
          ? "Not found"
          : data.header,
    },
    {
      title: "Raw address",
      darker: false,
      value: (() => {
        if (!addr.raw) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-2 py-3'>
            <span className='max-w-[1000px] text-wrap break-words'>
              {Address.toHexString(addr.raw)}
            </span>
            <Copy
              copyText={Address.toHexString(addr.raw)}
              className='translate-y-[2px]'
            />
          </div>
        );
      })(),
    },
    {
      title: "Payment credential",
      darker: true,
      value: (() => {
        if (!data?.payment) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-2'>
            <span>{data?.payment}</span>
            <Copy copyText={data?.payment} className='translate-y-[2px]' />
          </div>
        );
      })(),
    },
    {
      title: "Staking credential",
      darker: false,
      value: (() => {
        if (!data?.stake) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-2'>
            <span>{data?.stake}</span>
            <Copy copyText={data?.stake} className='translate-y-[2px]' />
          </div>
        );
      })(),
    },
  ];

  const isDataLoading = isFetching || isLoading || !data;

  return (
    <>
      <PageBase
        metadataTitle='addressInspector'
        title='Address inspector'
        breadcrumbItems={[{ label: "Address inspector" }]}
      >
        <section className='flex w-full justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-end gap-4 p-mobile md:p-desktop'>
            <div className='flex w-full'>
              <TableSearchInput
                value={search}
                onchange={val => setSearch(val)}
                placeholder='Address...'
                showSearchIcon
                wrapperClassName='w-full'
                showPrefixPopup={false}
              />
            </div>

            {isValidAddress(data?.address) &&
              (data?.address.includes("stake") ? (
                <div className='w-full'>
                  <Link
                    to='/stake/$stakeAddr'
                    params={{
                      stakeAddr: data?.address as string,
                    }}
                    className='flex items-center gap-1'
                  >
                    <span className='text-sm font-semibold text-primary'>
                      Stake detail
                    </span>
                    <ArrowRight className='text-primary' size={15} />
                  </Link>
                </div>
              ) : (
                <div className='w-full'>
                  <Link
                    to='/address/$address'
                    params={{
                      address: data?.address as string,
                    }}
                    className='flex items-center gap-1'
                  >
                    <span className='text-sm font-semibold text-primary'>
                      Address detail
                    </span>
                    <ArrowRight className='text-primary' size={15} />
                  </Link>
                </div>
              ))}
            {!!debouncedAddressSearch.trim() && (
              <div
                className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-lg border border-border'
                style={{
                  transform: "rotateX(180deg)",
                }}
              >
                <div
                  className='w-full min-w-[1300px]'
                  style={{
                    transform: "rotateX(180deg)",
                  }}
                >
                  {rows.map(item => (
                    <AddressInspectorRow
                      key={item.title}
                      title={item.title}
                      darker={item.darker}
                      value={item.value}
                      isLoading={isDataLoading}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </PageBase>
    </>
  );
};
