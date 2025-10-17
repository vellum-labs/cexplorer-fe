import { AddressInspectorRow } from "@/components/address/AddressInspectorRow";
import { Copy } from "@vellumlabs/cexplorer-sdk";
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

  const { data } = useLucidAddressInspector(
    debouncedAddressSearch ? debouncedAddressSearch : undefined,
  );

  let addr = {} as any;

  if (isValidAddress(data?.address)) {
    addr = Address.from(data?.address as string);
  }

  const getAddressTypeInfo = () => {
    if (!data?.header || data.header === -1) {
      return { type: "Unknown", network: "Unknown" };
    }

    const headerByte = data.header;
    const addressType = (headerByte >> 4) & 0x0f;
    const networkId = headerByte & 0x0f;

    let typeDescription = "";
    switch (addressType) {
      case 0:
        typeDescription = "Payment address (key)";
        break;
      case 1:
        typeDescription = "Payment address (script)";
        break;
      case 2:
        typeDescription = "Payment address with stake key";
        break;
      case 3:
        typeDescription = "Payment address with stake script";
        break;
      case 4:
        typeDescription = "Payment address with stake pointer";
        break;
      case 5:
        typeDescription = "Payment address with stake script pointer";
        break;
      case 6:
        typeDescription = "Enterprise address (key)";
        break;
      case 7:
        typeDescription = "Enterprise address (script)";
        break;
      case 14:
        typeDescription = "Stake address (key)";
        break;
      case 15:
        typeDescription = "Stake address (script)";
        break;
      default:
        typeDescription = `Unknown type (${addressType})`;
    }

    const network = networkId === 1 ? "Mainnet" : "Testnet";

    return { type: typeDescription, network };
  };

  const addressTypeInfo = getAddressTypeInfo();

  const rows = [
    {
      title: "Address",
      darker: true,
      value: (() => {
        if (!data?.address) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-1'>
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
      title: "Address details",
      darker: true,
      value: (() => {
        if (!data?.header || data.header === -1) {
          return "Not found";
        }

        return (
          <div className='flex flex-col gap-1/2'>
            <span className='font-medium'>{addressTypeInfo.type}</span>
            <span className='text-text-sm text-grayTextPrimary'>
              {addressTypeInfo.network}
            </span>
          </div>
        );
      })(),
    },
    {
      title: "Stake key",
      darker: false,
      value: (() => {
        const isStakeAddress =
          data?.address?.startsWith("stake") ||
          data?.address?.startsWith("stake_test");

        if (isStakeAddress && data?.address) {
          return (
            <div className='flex items-center gap-1'>
              <span>{data.address}</span>
              <Copy copyText={data.address} className='translate-y-[2px]' />
            </div>
          );
        }

        if (!addr?.rewardAddress) {
          return "Not found";
        }

        return (
          <div className='flex items-center gap-1'>
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
      title: "Network",
      darker: true,
      value: (() => {
        if (typeof data?.magic === "undefined" || data.magic === -1) {
          return "Not found";
        }
        return data.magic === 1 ? "Mainnet" : "Testnet";
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
        typeof data?.header === "undefined" || data?.header === -1
          ? "Not found"
          : `0x${data.header.toString(16).padStart(2, "0")}`,
    },
    {
      title: "Raw address",
      darker: false,
      value: (() => {
        if (!data?.address) {
          return "Not found";
        }

        const addressInput = debouncedAddressSearch;
        const isHexInput =
          /^[0-9a-fA-F]+$/.test(addressInput) &&
          addressInput.length % 2 === 0 &&
          addressInput.length >= 58;

        let rawHex: string;
        if (isHexInput) {
          rawHex = addressInput;
        } else {
          try {
            const decodedBytes = Address.bech32DecodeToBytes(data.address);
            rawHex = Address.toHexString(decodedBytes);
          } catch {
            if (addr.raw && addr.raw.length > 0) {
              rawHex = Address.toHexString(addr.raw);
            } else {
              return "Not found";
            }
          }
        }

        return (
          <div className='flex items-center gap-1 py-1.5'>
            <span className='max-w-[1000px] text-wrap break-words'>
              {rawHex}
            </span>
            <Copy copyText={rawHex} className='translate-y-[2px]' />
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
          <div className='flex items-center gap-1'>
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
          <div className='flex items-center gap-1'>
            <span>{data?.stake}</span>
            <Copy copyText={data?.stake} className='translate-y-[2px]' />
          </div>
        );
      })(),
    },
  ];

  const isDataLoading = !data;

  return (
    <>
      <PageBase
        metadataTitle='addressInspector'
        title='Address inspector'
        breadcrumbItems={[{ label: "Address inspector" }]}
      >
        <section className='flex w-full justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-end gap-2 p-mobile md:p-desktop'>
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
                    className='flex items-center gap-1/2'
                  >
                    <span className='text-text-sm font-semibold text-primary'>
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
                    className='flex items-center gap-1/2'
                  >
                    <span className='text-text-sm font-semibold text-primary'>
                      Address detail
                    </span>
                    <ArrowRight className='text-primary' size={15} />
                  </Link>
                </div>
              ))}
            {!!debouncedAddressSearch.trim() && (
              <div
                className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-m border border-border'
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
