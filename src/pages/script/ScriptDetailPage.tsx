import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import Tabs from "@/components/global/Tabs";
import { ScriptDetailOverview } from "@/components/script/ScriptDetailOverview";
import { ScriptDetailStatsTab } from "@/components/script/tabs/ScriptDetailStatsTab";
import { ScriptDetailUsesTab } from "@/components/script/tabs/ScriptDetailUsesTab";
import { useFetchScriptDetail } from "@/services/script";
import { formatString } from "@/utils/format/format";
import { getRouteApi } from "@tanstack/react-router";
import { TxListPage } from "../tx/TxListPage";
import { PageBase } from "@/components/global/pages/PageBase";

export const ScriptDetailPage = () => {
  const route = getRouteApi("/script/$hash");
  const { hash } = route.useParams();

  const query = useFetchScriptDetail(hash);

  const scriptDetailTabItems = [
    {
      key: "stats",
      label: "Stats",
      content: <ScriptDetailStatsTab items={query.data?.data.stat} />,
      visible: true,
    },
    {
      key: "uses",
      label: "Uses",
      content: <ScriptDetailUsesTab />,
      visible: true,
    },
    {
      key: "transactions",
      label: "Transactions",
      content: <TxListPage script={hash} />,
      visible: true,
    },
    // {
    //   key: "mints",
    //   label: "Mints",
    //   content: <ScriptDetailMintsTab />,
    //   visible: true,
    // },
  ];

  return (
    <PageBase
      metadataTitle='scriptDetail'
      metadataReplace={{
        before: "%script%",
        after: hash,
      }}
      title='Script detail'
      breadcrumbItems={[
        {
          label: <span className='inline pt-1'>Script List</span>,
          link: "/script",
        },
        {
          label: <span className=''>{formatString(hash, "longer")}</span>,
          ident: hash,
        },
      ]}
      subTitle={
        <div className='flex flex-col'>
          <HeaderBannerSubtitle
            hashString={formatString(hash, "long")}
            hash={hash}
            className='-mb-0'
          />
        </div>
      }
    >
      <ScriptDetailOverview query={query} />
      <Tabs items={scriptDetailTabItems} />
    </PageBase>
  );
};
