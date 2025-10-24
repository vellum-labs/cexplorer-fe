import { Helmet } from "react-helmet";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import metadata from "../../../conf/metadata/en-metadata.json";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import PoolListTab from "@/components/pool/tabs/PoolListTab";
import PoolAnalyticsTab from "@/components/pool/tabs/PoolAnalyticsTab";
import type { FC } from "react";
import { useFetchMiscBasic } from "@/services/misc";
import { generateImageUrl } from "@/utils/generateImageUrl";

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

  const miscBasicQuery = useFetchMiscBasic();

  return (
    <main className='flex min-h-minHeight w-full flex-col items-center'>
      <Helmet>{<title>{metadata.poolsList.title}</title>}</Helmet>
      <HeaderBanner
        title='Cardano Stake Pools'
        breadcrumbItems={[{ label: "Pools" }]}
      />
      <AdsCarousel
        generateImageUrl={generateImageUrl}
        miscBasicQuery={miscBasicQuery}
      />
      <Tabs items={tabs} wrapperClassname='mt-0' />
    </main>
  );
};

export default PoolListPage;
