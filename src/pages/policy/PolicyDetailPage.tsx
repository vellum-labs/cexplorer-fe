import { AssetMintTab } from "@/components/asset/tabs/AssetMintTab";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import Tabs from "@/components/global/Tabs";
import { PolicyDetailOverview } from "@/components/policy/PolicyDetailOverview";
import { PolicyAnalyticsTab } from "@/components/policy/tabs/PolicyAnalyticsTab";
import { PolicyDetailNftAsset } from "@/components/policy/tabs/PolicyDetailNftAsset";
import { PolicyOwnersTab } from "@/components/policy/tabs/PolicyOwnersTab";
import { type FC } from "react";
import { TxListPage } from "../tx/TxListPage";

import { useFetchPolicyDetail } from "@/services/policy";

import { AssetTimelockTab } from "@/components/asset/tabs/AssetTimelockTab";
import { formatString } from "@/utils/format/format";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { AssetListPage } from "../assets/AssetListPage";

export const PolicyDetailPage: FC = () => {
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
      label: "Assets",
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
      label: "Market Activity",
      content: <>TBD</>,
      visible: false,
    },
    {
      key: "owners",
      label: "Owners",
      content: <PolicyOwnersTab policyId={policyId} />,
      visible: true,
    },
    {
      key: "mint",
      label: "Mint",
      content: <AssetMintTab policyId={policyId} />,
      visible: true,
    },
    {
      key: "timelock",
      label: "Timelock",
      content: <AssetTimelockTab json={policyScript?.json} />,
      visible: timelock,
    },
    ...(stats
      ? [
          {
            key: "analytics",
            label: "Analytics",
            content: <PolicyAnalyticsTab policyId={policyId} />,
            visible: true,
          },
        ]
      : []),
    {
      key: "tx",
      label: "Transactions",
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
        <div className='flex items-center gap-1'>
          {collectionName ? collectionName : "Policy ID detail"}
        </div>
      }
      breadcrumbItems={[
        {
          label: "Assets",
          link: "/asset",
        },
        {
          label: formatString(policyId, "long"),
          ident: policyId,
        },
      ]}
      subTitle={
        <HeaderBannerSubtitle
          title='Policy ID'
          hash={policyId}
          hashString={formatString(policyId, "long")}
        />
      }
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
