import { AddressesTab } from "@/components/address/tabs/AddressesTab";
import { RewardsTab } from "@/components/address/tabs/RewardsTab";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import Tabs from "@/components/global/Tabs";
import { formatString } from "@/utils/format/format";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { useLayoutEffect, type FC } from "react";

import { AssetsTab } from "@/components/address/tabs/AssetsTab";
import AdaHandleBadge from "@/components/global/badges/AdaHandleBadge";
import { StakeDetailOverview } from "@/components/stake/StakeDetailOverview";
import StakeDelegationsTab from "@/components/stake/tabs/StakeDelegationsTab";
import { StakeWithdrawalsTab } from "@/components/stake/tabs/StakeWithdrawalsTab";
import { Tooltip } from "@/components/ui/tooltip";
import { UserBadge } from "@/components/user/UserBadge";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchStakeDetail } from "@/services/stake";
import { useNotFound } from "@/stores/useNotFound";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { QrCode } from "lucide-react";
import { TxListPage } from "../tx/TxListPage";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { PageBase } from "@/components/global/pages/PageBase";

export const StakeDetailPage: FC = () => {
  const route = getRouteApi("/stake/$stakeAddr");
  const { stakeAddr: address } = route.useParams();
  const stakeQuery = useFetchStakeDetail(address);
  const data = stakeQuery.data;
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);
  const { setNotFound } = useNotFound();
  const assets = stakeQuery.data?.asset || [];
  const user = stakeQuery.data?.user;
  const hideDelegTab =
    !data?.stake.active.deleg.id &&
    !data?.stake.live.deleg.id &&
    !data?.reward.withdrawn;

  const { page } = useSearch({
    from: "/stake/$stakeAddr",
  });

  const tabs = [
    {
      key: "assets",
      label: "Assets",
      content: <AssetsTab assets={assets} addressQuery={stakeQuery} isStake />,
      visible: true,
    },
    {
      key: "transactions",
      label: "Transactions",
      content: <TxListPage key='stake' stake={address} />,
      visible: true,
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      content: <StakeWithdrawalsTab view={address} miscConst={miscConst} />,
      visible: !hideDelegTab,
    },
    {
      key: "addresses",
      label: "Addresses",
      content: <AddressesTab view={address} stakeKey={data?.view} />,
      visible: true,
    },
    {
      key: "delegations",
      label: "Delegations",
      content: <StakeDelegationsTab address={address} miscConst={miscConst} />,
      visible: !hideDelegTab,
    },
    {
      key: "rewards",
      label: "Rewards",
      content: <RewardsTab stakeAddress={address} parentPage='stake' />,
      visible: !hideDelegTab,
    },
    {
      key: "defi",
      label: "Trading",
      content: () => (
        <DeFiOrderList
          storeKey='stake_detail_defi_order'
          stakeAddress={address}
          tabName='defi'
          page={page}
        />
      ),
      visible: true,
    },
  ];

  useLayoutEffect(() => {
    if (!isValidAddress(address)) {
      setNotFound(true);
    }
  }, []);

  return (
    <PageBase
      metadataTitle='stakeAddressDetail'
      metadataReplace={{
        before: "%address%",
        after: address,
      }}
      title='Stake Detail'
      breadcrumbItems={[
        { label: "Address", link: "/address" },
        { label: formatString(address, "long"), ident: address },
      ]}
      subTitle={
        <HeaderBannerSubtitle
          title='Stake address'
          hashString={formatString(address ?? "", "long")}
          hash={address}
        />
      }
      badge={
        stakeQuery.data?.adahandle && (
          <AdaHandleBadge hex={stakeQuery.data?.adahandle?.hex} />
        )
      }
      qrCode={
        <Tooltip content={<QRCodeSVG value={address} size={120} />}>
          <QrCode size={15} className='-translate-y-0.5' />
        </Tooltip>
      }
    >
      <div className='mb-3 flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
        <UserBadge
          address={address}
          isLoading={stakeQuery.isLoading}
          user={user}
        />
      </div>
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-5 px-mobile md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex grow basis-[980px] flex-wrap items-stretch gap-5'>
            {stakeQuery.isLoading || stakeQuery.isError ? (
              <>
                <LoadingSkeleton
                  height='330px'
                  rounded='xl'
                  className='grow basis-[410px] px-8 py-4'
                />
                <LoadingSkeleton
                  height='330px'
                  rounded='xl'
                  className='grow basis-[410px] px-8 py-4'
                />
              </>
            ) : (
              <StakeDetailOverview
                data={stakeQuery.data}
                stakeAddress={address}
              />
            )}
          </div>
        </div>
      </section>
      <Tabs items={tabs} apiLoading={stakeQuery.isLoading} />
    </PageBase>
  );
};
