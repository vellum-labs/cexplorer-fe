import { Helmet } from "react-helmet";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import metadata from "../../../conf/metadata/en-metadata.json";
import { webUrl } from "@/constants/confVariables";
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
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.poolsList.title}</title>}
        <meta name='description' content={metadata.poolsList.description} />
        <meta name='keywords' content={metadata.poolsList.keywords} />
        <meta property='og:title' content={metadata.poolsList.title} />
        <meta
          property='og:description'
          content={metadata.poolsList.description}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
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
