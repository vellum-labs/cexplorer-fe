import { DrepDetailOverview } from "@/components/drep/DrepDetailOverview";
import { DrepDetailAboutTab } from "@/components/drep/tabs/DrepDetailAboutTab";
import { DrepDetailDelegatorsTab } from "@/components/drep/tabs/DrepDetailDelegatorsTab";
import { DrepDetailGovernanceActionsTab } from "@/components/drep/tabs/DrepDetailGovernanceActionsTab";
import { Image } from "@/components/global/Image";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import Tabs from "@/components/global/Tabs";
import { useEffect, useState, type FC } from "react";

import { useFetchDrepDetail } from "@/services/drep";

import { WatchlistSection } from "@/components/global/watchlist/WatchlistSection";
import { formatString } from "@/utils/format/format";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { DrepDetailStatsTab } from "@/components/drep/tabs/DrepDetailStatsTab";
import { generateImageUrl } from "@/utils/generateImageUrl";

export const DrepDetailPage: FC = () => {
  const [title, setTitle] = useState<string>("");
  const route = getRouteApi("/drep/$hash");
  const { hash } = route.useParams();

  const drepDetailQuery = useFetchDrepDetail(hash);

  const drepHash = drepDetailQuery?.data?.hash?.view;

  const tabs = [
    {
      key: "governance_actions",
      label: "Governance actions",
      content: <DrepDetailGovernanceActionsTab />,
      visible: true,
    },
    {
      key: "delegators",
      label: "Delegators",
      content: <DrepDetailDelegatorsTab view={drepHash ?? ""} />,
      visible: true,
    },
    {
      key: "stats",
      label: "Stats",
      content: <DrepDetailStatsTab data={drepDetailQuery.data?.distr ?? []} />,
      visible: true,
    },
  ];

  if (
    drepDetailQuery.data?.data &&
    (drepDetailQuery.data?.data.given_name ||
      drepDetailQuery.data?.data.objectives ||
      drepDetailQuery.data?.data.motivations ||
      drepDetailQuery.data?.data.qualifications ||
      drepDetailQuery.data?.data.payment_address ||
      drepDetailQuery.data?.data.image_url)
  ) {
    tabs.push({
      key: "about",
      label: "About",
      content: (
        <DrepDetailAboutTab
          data={{
            image_url: drepDetailQuery.data?.data?.image_url ?? "",
            given_name: drepDetailQuery.data?.data?.given_name ?? "",
            objectives: drepDetailQuery.data?.data?.objectives ?? "",
            motivations: drepDetailQuery.data?.data?.motivations ?? "",
            qualifications: drepDetailQuery.data?.data?.qualifications ?? "",
            payment_address: drepDetailQuery.data?.data?.payment_address ?? "",
          }}
        />
      ),
      visible: true,
    });
  }

  useEffect(() => {
    if (drepDetailQuery.data?.data === undefined) return;

    if (drepDetailQuery.data?.data?.given_name === null) {
      setTitle(drepHash ?? "");
      return;
    }

    setTitle(drepDetailQuery.data?.data?.given_name || "");
  }, [drepDetailQuery.data?.data, drepHash]);

  return (
    <PageBase
      metadataTitle='drepDetail'
      metadataReplace={{
        before: "%drep%",
        after: title,
      }}
      breadcrumbItems={[
        {
          label: <span className='inline pt-1'>Drep</span>,
          link: "/drep",
        },
        {
          label: (
            <span className=''>{formatString(drepHash ?? "", "long")}</span>
          ),
          ident: drepHash ?? "",
        },
      ]}
      title={
        <div className='mt-1 flex items-center gap-2'>
          <Image
            src={generateImageUrl(
              drepDetailQuery.data?.hash?.view ?? "",
              "ico",
              "drep",
            )}
            type='user'
            height={35}
            width={35}
            className='rounded-full'
          />
          {title}
        </div>
      }
      subTitle={
        <HeaderBannerSubtitle
          title='Drep ID'
          hashString={formatString(drepHash ?? "", "long")}
          hash={drepHash ?? ""}
        />
      }
    >
      <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
        <WatchlistSection
          ident={drepHash ?? ""}
          isLoading={drepDetailQuery.isLoading}
        />
      </div>
      <DrepDetailOverview query={drepDetailQuery} />
      <Tabs items={tabs} />
    </PageBase>
  );
};
