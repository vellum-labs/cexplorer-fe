import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ScriptDetailOverview } from "@/components/script/ScriptDetailOverview";
import { ScriptDetailStatsTab } from "@/components/script/tabs/ScriptDetailStatsTab";
import { ScriptDetailUsesTab } from "@/components/script/tabs/ScriptDetailUsesTab";
import { useFetchScriptDetail } from "@/services/script";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getRouteApi } from "@tanstack/react-router";
import { TxListPage } from "../tx/TxListPage";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ScriptDetailPage = () => {
  const { t } = useAppTranslation();
  const route = getRouteApi("/script/$hash");
  const { hash } = route.useParams();

  const query = useFetchScriptDetail(hash);

  const scriptDetailTabItems = [
    {
      key: "stats",
      label: t("tabs.scriptDetail.stats"),
      content: <ScriptDetailStatsTab items={query.data?.data.stat} />,
      visible: true,
    },
    {
      key: "uses",
      label: t("tabs.scriptDetail.uses"),
      content: <ScriptDetailUsesTab />,
      visible: true,
    },
    {
      key: "transactions",
      label: t("tabs.scriptDetail.transactions"),
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
      title={t("pages.scriptDetail.title")}
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>{t("breadcrumbs.scriptList")}</span>,
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
