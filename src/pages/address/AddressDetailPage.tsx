import { AddressDetailOverview } from "@/components/address/AddressDetailOverview";
import { AddressesTab } from "@/components/address/tabs/AddressesTab";
import { AssetsTab } from "@/components/address/tabs/AssetsTab";
import { RewardsTab } from "@/components/address/tabs/RewardsTab";
import { UTXOTab } from "@/components/address/tabs/UTXOTab";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { QRCodeSVG } from "qrcode.react";
import { type FC } from "react";
import { TxListPage } from "../tx/TxListPage";

import { Address } from "@/utils/address/getStakeAddress";

import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getRouteApi, useSearch } from "@tanstack/react-router";

import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { WatchlistSection } from "@/components/global/watchlist/WatchlistSection";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { UserBadge } from "@/components/user/UserBadge";
import { useFetchAddressDetail } from "@/services/address";
import { useNotFound } from "@/stores/useNotFound";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { QrCode } from "lucide-react";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { PageBase } from "@/components/global/pages/PageBase";
import { configJSON } from "@/constants/conf";

export const AddressDetailPage: FC = () => {
  const route = getRouteApi("/address/$address");
  const { address } = route.useParams();

  const { page } = useSearch({
    from: "/address/$address",
  });

  const { setNotFound } = useNotFound();
  const addressQuery = useFetchAddressDetail(address);

  if (!isValidAddress(address)) {
    setNotFound(true);
    return undefined;
  }

  let paymentAddress: string;
  let rewardsAddress: string | undefined;
  let stakeKey: string | undefined;

  const addrObj = Address.from(address!);
  if ((addrObj as any).isByron) {
    paymentAddress = addrObj.payment;
    rewardsAddress = undefined;
    stakeKey = undefined;
  } else {
    paymentAddress = addrObj.payment;
    rewardsAddress = addrObj.rewardAddress;
    stakeKey = addrObj.stake;
  }

  const user = addressQuery.data?.data?.[0]?.user;
  const addressData = addressQuery.data?.data[0];
  const assets = addressData?.asset ?? [];

  const policyId = configJSON.integration[0].adahandle[0].policy;

  const tabs = [
    {
      key: "assets",
      label: "Assets",
      content: (
        <AssetsTab
          assets={assets}
          addressQuery={addressQuery}
          stakeKey={stakeKey}
        />
      ),
      visible: true,
    },
    {
      key: "transactions",
      label: "Transactions",
      content: <TxListPage key='address' address={address} />,
      visible: true,
    },
    {
      key: "utxos",
      label: "UTXOs",
      content: <UTXOTab address={address} />,
      visible: true,
    },
    {
      key: "defi",
      label: "Trading",
      content: () => (
        <DeFiOrderList
          storeKey='address_detail_defi_order'
          address={address}
          tabName='defi'
          pulseDot={false}
          page={page}
          titleClassname='text-text-md'
        />
      ),
      visible: true,
    },
  ];

  if (stakeKey) {
    tabs.push({
      key: "addresses",
      label: "Addresses",
      content: <AddressesTab paymentAddress={paymentAddress} />,
      visible: true,
    });
  }

  if (
    addressData?.stake?.reward?.total ||
    addressData?.stake?.reward.withdrawn
  ) {
    tabs.push({
      key: "rewards",
      label: "Rewards",
      content: (
        <RewardsTab stakeAddress={rewardsAddress ?? ""} parentPage='addr' />
      ),
      visible: true,
    });
  }

  const stakeAddr = Address.from(address).rewardAddress;

  return (
    <PageBase
      metadataTitle='addressDetail'
      metadataReplace={{ before: "%address%", after: address }}
      breadcrumbItems={[
        stakeKey
          ? {
              label: "Stake",
              link: `/stake/${stakeAddr}` as any,
            }
          : {
              label: "Address",
            },
        {
          label: formatString(address, "long"),
          ident: address,
        },
      ]}
      title={<div className='flex items-center gap-1/2'>Address detail</div>}
      subTitle={
        <HeaderBannerSubtitle
          title='Address'
          hashString={formatString(address ?? "", "long")}
          hash={address}
        />
      }
      badge={
        addressData?.adahandle && (
          <AdaHandleBadge
            hex={addressData?.adahandle?.hex}
            link
            policyId={policyId}
          />
        )
      }
      qrCode={
        <Tooltip content={<QRCodeSVG value={address} size={120} />}>
          <QrCode size={15} className='-translate-y-2' />
        </Tooltip>
      }
      homepageAd
    >
      <section className='flex w-full flex-col items-center'>
        <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
          <UserBadge
            address={address}
            isLoading={addressQuery.isLoading}
            user={user}
          />
          <WatchlistSection
            ident={address}
            isLoading={addressQuery.isLoading}
            enableWatchlistModal={!!stakeKey}
            stakeKey={rewardsAddress}
          />
        </div>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pb-3 pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex w-full shrink grow flex-wrap items-stretch gap-3'>
            {addressQuery.isLoading || addressQuery.isError ? (
              <>
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
              </>
            ) : (
              <AddressDetailOverview
                data={addressQuery.data?.data ?? []}
                address={address}
              />
            )}
          </div>
        </div>
      </section>
      <Tabs items={tabs} wrapperClassname='mt-0' />
    </PageBase>
  );
};
