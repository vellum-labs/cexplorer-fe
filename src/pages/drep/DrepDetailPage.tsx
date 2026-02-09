import { DrepDetailOverview } from "@/components/drep/DrepDetailOverview";
import { DrepDetailAboutTab } from "@/components/drep/tabs/DrepDetailAboutTab";
import { DrepDetailDelegatorsTab } from "@/components/drep/tabs/DrepDetailDelegatorsTab";
import { DrepDetailGovernanceActionsTab } from "@/components/drep/tabs/DrepDetailGovernanceActionsTab";
import { DrepDetailEmbedTab } from "@/components/drep/tabs/DrepDetailEmbedTab";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useEffect, useState, type FC } from "react";

import { useFetchDrepDetail } from "@/services/drep";

import { WatchlistSection } from "@/components/global/watchlist/WatchlistSection";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { DrepDetailStatsTab } from "@/components/drep/tabs/DrepDetailStatsTab";
import { generateImageUrl } from "@/utils/generateImageUrl";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { useDelegateAction } from "@/hooks/useDelegateAction";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const DrepDetailPage: FC = () => {
  const { t } = useAppTranslation("pages");
  const [title, setTitle] = useState<string>("");
  const route = getRouteApi("/drep/$hash");
  const { hash } = route.useParams();

  const { showWalletModal, setShowWalletModal } = useDelegateAction({
    type: "drep",
    ident: hash,
  });

  const drepDetailQuery = useFetchDrepDetail(hash);

  const drepHash = drepDetailQuery?.data?.hash?.view;
  const drepName = drepDetailQuery?.data?.data?.given_name;

  const tabs = [
    {
      key: "governance_actions",
      label: t("dreps.detailPage.tabs.governanceActions"),
      content: <DrepDetailGovernanceActionsTab />,
      visible: true,
    },
    {
      key: "delegators",
      label: t("dreps.detailPage.tabs.delegators"),
      content: <DrepDetailDelegatorsTab view={drepHash ?? ""} />,
      visible: true,
    },
    {
      key: "stats",
      label: t("dreps.detailPage.tabs.stats"),
      content: <DrepDetailStatsTab data={drepDetailQuery.data?.distr ?? []} />,
      visible: true,
    },
    {
      key: "embed",
      label: t("dreps.detailPage.tabs.embed"),
      content: (
        <DrepDetailEmbedTab drepId={hash} drepName={drepName ?? undefined} />
      ),
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
      label: t("dreps.detailPage.tabs.about"),
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
          label: <span className='inline pt-1/2'>{t("governance.title")}</span>,
          link: "/gov",
        },
        {
          label: <span className='inline pt-1/2'>{t("dreps.breadcrumb")}</span>,
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
        <div className='mt-1/2 flex items-center gap-1'>
          <Image
            src={generateImageUrl(
              drepDetailQuery.data?.hash?.view ?? "",
              "ico",
              "drep",
            )}
            type='user'
            height={35}
            width={35}
            className='rounded-max'
          />
          {title}
        </div>
      }
      subTitle={
        <HeaderBannerSubtitle
          title={t("dreps.detailPage.drepId")}
          hashString={formatString(drepHash ?? "", "long")}
          hash={drepHash ?? ""}
        />
      }
      homepageAd
    >
      <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
        <WatchlistSection
          ident={drepHash ?? ""}
          isLoading={drepDetailQuery.isLoading}
          drepDetailQuery={drepDetailQuery}
        />
      </div>
      <DrepDetailOverview query={drepDetailQuery} />
      <Tabs items={tabs} />
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </PageBase>
  );
};
