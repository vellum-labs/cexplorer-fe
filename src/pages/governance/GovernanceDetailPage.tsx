import type { FC } from "react";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { GovernanceDetailMetadataTab } from "@/components/governance/tabs/GovernanceDetailMetadataTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { GovernanceDetailOverview } from "@/components/governance/GovernanceDetailOverview";
import { GovernanceDetailAboutTab } from "@/components/governance/tabs/GovernanceDetailAboutTab";
import { GovernanceDetailNotVotedTab } from "@/components/governance/tabs/GovernanceDetailNotVotedTab";
import { GovernanceDetailStatusHistoryTab } from "@/components/governance/tabs/GovernanceDetailStatusHistoryTab";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { useParams } from "@tanstack/react-router";
import { useFetchGovernanceActionDetail } from "@/services/governance";

import { formatString } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";

export const GovernanceDetailPage: FC = () => {
  const { t } = useAppTranslation();
  const { id } = useParams({
    from: "/gov/action/$id",
  });

  const decodedId = id?.replace(/%23/g, "#");

  const detailQuery = useFetchGovernanceActionDetail(decodedId);
  const data = detailQuery?.data?.data;

  const tabs = [
    {
      key: "voted",
      label: t("governance.tabs.voted"),
      content: <GovernanceDetailAboutTab id={decodedId} key={1} />,
      visible: true,
    },
    {
      key: "not_voted",
      label: t("governance.tabs.notVoted"),
      content: (
        <GovernanceDetailNotVotedTab
          id={decodedId}
          governanceAction={data}
          key={2}
        />
      ),
      visible: true,
    },
    {
      key: "status_history",
      label: t("governance.tabs.statusHistory"),
      content: <GovernanceDetailStatusHistoryTab query={detailQuery} key={3} />,
      visible: true,
    },
    {
      key: "description",
      label: t("governance.tabs.description"),
      content: (
        <JsonDisplay
          data={detailQuery?.data?.data?.description?.contents}
          isError={false}
          isLoading={false}
          noDataLabel={t("sdk:jsonDisplay.noDataLabel")}
        />
      ),
      visible: !!detailQuery?.data?.data?.description?.contents,
    },
    {
      key: "metadata",
      label: t("governance.tabs.metadata"),
      content: <GovernanceDetailMetadataTab query={detailQuery} />,
      visible: !!detailQuery?.data?.data?.anchor?.offchain?.name,
    },
  ];

  return (
    <PageBase
      metadataTitle='governanceActionDetail'
      metadataReplace={{
        before: "%gov%",
        after: decodedId || "Governance Action",
      }}
      breadcrumbItems={[
        {
          label: (
            <span className='inline pt-1/2'>
              {t("governance.breadcrumbs.governance")}
            </span>
          ),
          link: "/gov",
        },
        {
          label: (
            <span className='inline pt-1/2'>
              {t("governance.breadcrumbs.governanceActions")}
            </span>
          ),
          link: "/gov/action",
        },
        {
          label: (
            <span className=''>{formatString(decodedId ?? "", "long")}</span>
          ),
          ident: decodedId,
        },
      ]}
      title={
        <div className='flex items-center gap-1/2'>
          {t("governance.detail.title")}
        </div>
      }
      subTitle={
        <div className='flex flex-col'>
          <HeaderBannerSubtitle
            title={t("governance.detail.governanceActionId")}
            hashString={formatString(data?.ident?.bech ?? "", "long")}
            hash={data?.ident?.bech}
            className='!mb-0'
          />
          <HeaderBannerSubtitle
            hashString={formatString(data?.ident?.id ?? "", "long")}
            hash={data?.ident?.id}
            title={t("governance.detail.legacyGovernanceActionId")}
            className='!mt-0'
          />
        </div>
      }
      homepageAd
    >
      <GovernanceDetailOverview query={detailQuery} />
      <Tabs items={tabs} apiLoading={detailQuery.isLoading} />
    </PageBase>
  );
};
