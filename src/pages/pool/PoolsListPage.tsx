import { Helmet } from "react-helmet";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import AdsCarousel from "@/components/global/ads/AdsCarousel";
import metadata from "../../../conf/metadata/en-metadata.json";
import Tabs from "@/components/global/Tabs";
import PoolListTab from "@/components/pool/tabs/PoolListTab";
import PoolAnalyticsTab from "@/components/pool/tabs/PoolAnalyticsTab";
import type { FC } from "react";

interface PoolListProps {
  watchlist?: boolean;
}

const PoolListPage: FC<PoolListProps> = ({ watchlist }) => {
  const tabs = [
    {
      key: "list",
      label: "List",
      content: <PoolListTab watchlist={watchlist} />,
      visible: true,
    },
    {
      key: "analytics",
      label: "Analytics",
      content: <PoolAnalyticsTab />,
      visible: true,
    },
  ];

  return (
    <main className='flex min-h-minHeight w-full flex-col items-center'>
      <Helmet>{<title>{metadata.poolsList.title}</title>}</Helmet>
      <HeaderBanner
        title='Cardano Stake Pools'
        breadcrumbItems={[{ label: "Pools" }]}
      />
      <AdsCarousel />
      <Tabs items={tabs} wrapperClassname='mt-0' />
    </main>
  );
};

export default PoolListPage;
