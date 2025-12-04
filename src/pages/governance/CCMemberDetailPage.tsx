import { PageBase } from "@/components/global/pages/PageBase";
import { getRouteApi } from "@tanstack/react-router";
import { useFetchCCMemberDetail, useFetchCCMemberVote } from "@/services/governance";
import {
  HeaderBannerSubtitle,
  Image,
  Tabs,
} from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { CCMemberDetailOverview } from "@/components/gov/cc/CCMemberDetailOverview";
import { CCMemberVotesTab } from "@/components/gov/cc/tabs/CCMemberVotesTab";
import { CCMemberHotKeysTab } from "@/components/gov/cc/tabs/CCMemberHotKeysTab";
import { CCMemberStatusHistoryTab } from "@/components/gov/cc/tabs/CCMemberStatusHistoryTab";

export const CCMemberDetailPage = () => {
  const route = getRouteApi("/gov/cc/$coldKey");
  const { coldKey } = route.useParams();
  const { data } = useFetchCCMemberDetail(coldKey);

  const memberData = Array.isArray(data?.data)
    ? data.data.sort(
        (a, b) => (b.expiration_epoch ?? 0) - (a.expiration_epoch ?? 0),
      )[0]
    : data?.data;

  const hotKey = memberData?.ident?.hot;
  const votesQuery = useFetchCCMemberVote(1000, 0, undefined, hotKey, undefined);

  const tabItems = [
    {
      key: "votes",
      label: "Votes",
      content: (
        <div className='w-full max-w-desktop'>
          <CCMemberVotesTab hotKey={hotKey} />
        </div>
      ),
      visible: true,
    },
    {
      key: "hot-keys",
      label: "Hot keys",
      content: (
        <div className='w-full max-w-desktop'>
          <CCMemberHotKeysTab
            memberHistory={
              Array.isArray(data?.data)
                ? data.data
                : data?.data
                  ? [data.data]
                  : undefined
            }
            isLoading={!data}
          />
        </div>
      ),
      visible: true,
    },
    {
      key: "status-history",
      label: "Status history",
      content: (
        <div className='w-full max-w-desktop'>
          <CCMemberStatusHistoryTab
            memberHistory={
              Array.isArray(data?.data)
                ? data.data
                : data?.data
                  ? [data.data]
                  : undefined
            }
            isLoading={!data}
          />
        </div>
      ),
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='ccMemberDetail'
      metadataReplace={{
        before: "%name%",
        after: memberData?.registry?.name ?? "",
      }}
      title={
        <span className='mt-1/2 flex w-full items-center gap-1'>
          {memberData?.registry && (
            <Image
              src={
                memberData.registry.img ||
                generateImageUrl(coldKey, "ico", "cc")
              }
              type='user'
              height={35}
              width={35}
              className='flex-shrink-0 rounded-max'
            />
          )}
          <span className='flex-1 break-all'>
            {memberData?.registry?.name || "CC Member"}
          </span>
        </span>
      }
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        {
          label: (
            <span className='inline pt-1/2'>Constitutional Committee</span>
          ),
          link: "/gov/cc",
        },
        {
          label: (
            <span className=''>{formatString(coldKey ?? "", "long")}</span>
          ),
          ident: coldKey,
        },
      ]}
      subTitle={
        <div className='flex flex-col'>
          <HeaderBannerSubtitle
            hashString={formatString(memberData?.ident?.cold ?? "", "long")}
            hash={memberData?.ident?.cold ?? undefined}
            title='Cold Key'
            className='!mb-0'
          />
          <HeaderBannerSubtitle
            hashString={formatString(memberData?.ident?.hot ?? "", "long")}
            hash={memberData?.ident?.hot ?? undefined}
            title='Hot Key'
            className='!mt-0'
          />
        </div>
      }
      adsCarousel={false}
    >
      <section className='flex w-full flex-col items-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='w-full'>
            <CCMemberDetailOverview
              memberData={memberData}
              isLoading={!data}
              isError={false}
              votesData={votesQuery.data}
            />
          </div>
        </div>
      </section>
      <Tabs items={tabItems} />
    </PageBase>
  );
};
