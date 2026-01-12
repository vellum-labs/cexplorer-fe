import { AssetMintTab } from "@/components/asset/tabs/AssetMintTab";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { PolicyDetailOverview } from "@/components/policy/PolicyDetailOverview";
import { PolicyAnalyticsTab } from "@/components/policy/tabs/PolicyAnalyticsTab";
import { PolicyDetailNftAsset } from "@/components/policy/tabs/PolicyDetailNftAsset";
import { PolicyOwnersTab } from "@/components/policy/tabs/PolicyOwnersTab";
import { type FC } from "react";
import { TxListPage } from "../tx/TxListPage";

import { useFetchPolicyDetail } from "@/services/policy";

import { AssetTimelockTab } from "@/components/asset/tabs/AssetTimelockTab";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { AssetListPage } from "../assets/AssetListPage";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PolicyDetailPage: FC = () => {
  const { t } = useAppTranslation();
  const route = getRouteApi("/policy/$policyId");
  const { policyId } = route.useParams();

  const policyDetailQuery = useFetchPolicyDetail(policyId);

  const stats = policyDetailQuery.data?.data.policy.stats;
  const collectionName = policyDetailQuery.data?.data?.collection?.name;
  const type = collectionName ? "nft" : "token";
  const policyScript = policyDetailQuery.data?.data?.policy?.script;

  const timelock = !!policyScript && policyScript?.type === "timelock";

  const tabs = [
    {
      key: "assets",
      label: t("tabs.policy.assets"),
      content:
        type === "token" ? (
          <AssetListPage policyId={policyId} showHeader={false} />
        ) : (
          <PolicyDetailNftAsset policyId={policyId} />
        ),
      visible: true,
    },
    {
      key: "market_activity",
      label: t("tabs.policy.marketActivity"),
      content: <>TBD</>,
      visible: false,
    },
    {
      key: "owners",
      label: t("tabs.policy.owners"),
      content: <PolicyOwnersTab policyId={policyId} />,
      visible: true,
    },
    {
      key: "mint",
      label: t("tabs.policy.mint"),
      content: <AssetMintTab policyId={policyId} />,
      visible: true,
    },
    {
      key: "timelock",
      label: t("tabs.policy.timelock"),
      content: <AssetTimelockTab json={policyScript?.json} />,
      visible: timelock,
    },
    ...(stats
      ? [
          {
            key: "analytics",
            label: t("tabs.policy.analytics"),
            content: <PolicyAnalyticsTab policyId={policyId} />,
            visible: true,
          },
        ]
      : []),
    {
      key: "tx",
      label: t("tabs.policy.transactions"),
      content: <TxListPage policyId={policyId} />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='policyDetail'
      metadataReplace={{
        before: "%policy%",
        after: collectionName ? collectionName : policyId,
      }}
      title={
        <div className='flex items-center gap-1/2'>
          {collectionName ? collectionName : t("pages:policyDetail.title")}
        </div>
      }
      breadcrumbItems={[
        {
          label: t("pages:breadcrumbs.assets"),
          link: "/asset",
        },
        {
          label: formatString(policyId, "long"),
          ident: policyId,
        },
      ]}
      subTitle={
        <HeaderBannerSubtitle
          title={t("labels.policyId")}
          hash={policyId}
          hashString={formatString(policyId, "long")}
        />
      }
      homepageAd
    >
      <PolicyDetailOverview
        type={type}
        query={policyDetailQuery}
        json={policyScript?.json}
        timelock={timelock}
      />
      <Tabs items={tabs} />
    </PageBase>
  );
};
