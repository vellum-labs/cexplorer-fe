import type { FC } from "react";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { GovernanceDetailMetadataTab } from "@/components/governance/tabs/GovernanceDetailMetadataTab";
import Tabs from "@/components/global/Tabs";
import { GovernanceDetailOverview } from "@/components/governance/GovernanceDetailOverview";
import { GovernanceDetailAboutTab } from "@/components/governance/tabs/GovernanceDetailAboutTab";
import { GovernanceDetailNotVotedTab } from "@/components/governance/tabs/GovernanceDetailNotVotedTab";

import { useParams } from "@tanstack/react-router";
import { useFetchGovernanceActionDetail } from "@/services/governance";

import { formatString } from "@/utils/format/format";
import { PageBase } from "@/components/global/pages/PageBase";
import { JsonDisplay } from "@/components/global/JsonDisplay";

export const GovernanceDetailPage: FC = () => {
  const { id } = useParams({
    from: "/gov/action/$id",
  });

  const detailQuery = useFetchGovernanceActionDetail(id);
  const data = detailQuery?.data?.data;

  const tabs = [
    {
      key: "voted",
      label: "Voted",
      content: <GovernanceDetailAboutTab id={id} key={1} />,
      visible: true,
    },
    {
      key: "not_voted",
      label: "Not voted",
      content: <GovernanceDetailNotVotedTab id={id} key={2} />,
      visible: true,
    },
    {
      key: "description",
      label: "Description",
      content: (
        <JsonDisplay
          data={detailQuery?.data?.data?.description?.contents}
          isError={false}
          isLoading={false}
        />
      ),
      visible: !!detailQuery?.data?.data?.description?.contents,
    },
    {
      key: "metadata",
      label: "Metadata",
      content: <GovernanceDetailMetadataTab query={detailQuery} />,
      visible: !!detailQuery?.data?.data?.anchor?.offchain?.name,
    },
  ];

  return (
    <PageBase
      metadataTitle='governanceActionDetail'
      metadataReplace={{
        before: "%gov%",
        after: id || "Governance Action",
      }}
      breadcrumbItems={[
        {
          label: <span className='inline pt-1'>Governance</span>,
          link: "/gov",
        },
        {
          label: <span className='inline pt-1'>Governance actions</span>,
          link: "/gov/action",
        },
        {
          label: <span className=''>{formatString(id ?? "", "long")}</span>,
          ident: id,
        },
      ]}
      title={
        <div className='flex items-center gap-1'>Governance action detail</div>
      }
      subTitle={
        <div className='flex flex-col'>
          <HeaderBannerSubtitle
            title='Governance Action ID'
            hashString={formatString(data?.ident?.bech ?? "", "long")}
            hash={data?.ident?.bech}
            className='!mb-0'
          />
          <HeaderBannerSubtitle
            hashString={formatString(data?.ident?.id ?? "", "long")}
            hash={data?.ident?.id}
            title='Legacy Governance Action ID'
            className='!mt-0'
          />
        </div>
      }
    >
      <GovernanceDetailOverview query={detailQuery} />
      <Tabs items={tabs} apiLoading={detailQuery.isLoading} />
    </PageBase>
  );
};
