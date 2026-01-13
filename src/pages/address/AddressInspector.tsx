import { AddressInspectorRow } from "@/components/address/AddressInspectorRow";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import type { FC } from "react";

import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useLucidAddressInspector } from "@/hooks/useLucidAddressInspector";
import { Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { ArrowRight } from "lucide-react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const AddressInspector: FC = () => {
  const { t } = useAppTranslation();
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
      return { type: t("addressInspector.addressTypes.unknown"), network: t("addressInspector.network.unknown") };
    }

    const headerByte = data.header;
    const addressType = (headerByte >> 4) & 0x0f;
    const networkId = headerByte & 0x0f;

    let typeDescription = "";
    switch (addressType) {
      case 0:
        typeDescription = t("addressInspector.addressTypes.paymentKey");
        break;
      case 1:
        typeDescription = t("addressInspector.addressTypes.paymentScript");
        break;
      case 2:
        typeDescription = t("addressInspector.addressTypes.paymentStakeKey");
        break;
      case 3:
        typeDescription = t("addressInspector.addressTypes.paymentStakeScript");
        break;
      case 4:
        typeDescription = t("addressInspector.addressTypes.paymentStakePointer");
        break;
      case 5:
        typeDescription = t("addressInspector.addressTypes.paymentStakeScriptPointer");
        break;
      case 6:
        typeDescription = t("addressInspector.addressTypes.enterpriseKey");
        break;
      case 7:
        typeDescription = t("addressInspector.addressTypes.enterpriseScript");
        break;
      case 14:
        typeDescription = t("addressInspector.addressTypes.stakeKey");
        break;
      case 15:
        typeDescription = t("addressInspector.addressTypes.stakeScript");
        break;
      default:
        typeDescription = t("addressInspector.addressTypes.unknownType", { type: addressType });
    }

    const network = networkId === 1 ? t("addressInspector.network.mainnet") : t("addressInspector.network.testnet");

    return { type: typeDescription, network };
  };

  const addressTypeInfo = getAddressTypeInfo();

  const rows = [
    {
      title: t("addressInspector.rows.address"),
      darker: true,
      value: (() => {
        if (!data?.address) {
          return t("addressInspector.notFound");
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
      title: t("addressInspector.rows.addressType"),
      darker: false,
      value: (() => {
        if (!data?.address || !addr?.raw) {
          return t("addressInspector.notFound");
        }

        return <AddressTypeInitialsBadge address={data?.address} />;
      })(),
    },
    {
      title: t("addressInspector.rows.addressDetails"),
      darker: true,
      value: (() => {
        if (!data?.header || data.header === -1) {
          return t("addressInspector.notFound");
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
      title: t("addressInspector.rows.stakeKey"),
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
          return t("addressInspector.notFound");
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
      title: t("addressInspector.rows.network"),
      darker: true,
      value: (() => {
        if (typeof data?.magic === "undefined" || data.magic === -1) {
          return t("addressInspector.notFound");
        }
        return data.magic === 1 ? t("addressInspector.network.mainnet") : t("addressInspector.network.testnet");
      })(),
    },
    {
      title: t("addressInspector.rows.magic"),
      darker: false,
      value:
        typeof data?.magic === "undefined" || data.magic === -1
          ? t("addressInspector.notFound")
          : data.magic,
    },
    {
      title: t("addressInspector.rows.header"),
      darker: true,
      value:
        typeof data?.header === "undefined" || data?.header === -1
          ? t("addressInspector.notFound")
          : `0x${data.header.toString(16).padStart(2, "0")}`,
    },
    {
      title: t("addressInspector.rows.rawAddress"),
      darker: false,
      value: (() => {
        if (!data?.address) {
          return t("addressInspector.notFound");
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
              return t("addressInspector.notFound");
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
      title: t("addressInspector.rows.paymentCredential"),
      darker: true,
      value: (() => {
        if (!data?.payment) {
          return t("addressInspector.notFound");
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
      title: t("addressInspector.rows.stakingCredential"),
      darker: false,
      value: (() => {
        if (!data?.stake) {
          return t("addressInspector.notFound");
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
        title={t("addressInspector.title")}
        breadcrumbItems={[
          { label: t("addressInspector.breadcrumbs.developers"), link: "/dev" },
          { label: t("addressInspector.breadcrumbs.addressInspector") },
        ]}
      >
        <section className='flex w-full justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-end gap-2 p-mobile md:p-desktop'>
            <div className='flex w-full'>
              <TableSearchInput
                value={search}
                onchange={val => setSearch(val)}
                placeholder={t("addressInspector.placeholder")}
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
                      {t("addressInspector.stakeDetail")}
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
                      {t("addressInspector.addressDetail")}
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
