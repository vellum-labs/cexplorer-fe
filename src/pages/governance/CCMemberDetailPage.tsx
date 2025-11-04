import { PageBase } from "@/components/global/pages/PageBase";
import { getRouteApi } from "@tanstack/react-router";
import { useFetchCCMemberDetail } from "@/services/governance";
import {
  HeaderBannerSubtitle,
  Image,
  InfoCard,
  Tabs,
} from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { CCMemberDetailOverview } from "@/components/gov/cc/CCMemberDetailOverview";
import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useFetchEpochDetailParam } from "@/services/epoch";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

export const CCMemberDetailPage = () => {
  const route = getRouteApi("/gov/cc/$coldKey");
  const { coldKey } = route.useParams();
  const { data } = useFetchCCMemberDetail(coldKey);

  // Get current epoch and epoch params
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpoch = miscConst?.epoch?.no ?? 0;
  const { data: epochParam } = useFetchEpochDetailParam(currentEpoch);

  // Get the most recent member record (highest expiration_epoch)
  const memberData = Array.isArray(data?.data)
    ? data.data.sort(
        (a, b) => (b.expiration_epoch ?? 0) - (a.expiration_epoch ?? 0),
      )[0]
    : data?.data;

  // Calculate mandate duration using committee_max_term_length
  const committeeMaxTermLength = epochParam?.committee_max_term_length;
  const expirationEpoch = memberData?.expiration_epoch;

  const startEpoch =
    expirationEpoch && committeeMaxTermLength
      ? expirationEpoch - committeeMaxTermLength
      : null;
  const endEpoch = expirationEpoch ?? null;

  const tabItems = [
    {
      key: "votes",
      label: "Votes",
      content: (
        <div className="w-full max-w-desktop p-mobile lg:p-desktop">
          <div className="w-full rounded-l border border-border bg-cardBg p-2">
            <p className="text-text-sm text-grayTextPrimary">
              Votes content coming soon...
            </p>
          </div>
        </div>
      ),
      visible: true,
    },
    {
      key: "status-history",
      label: "Status history",
      content: (
        <div className="w-full max-w-desktop p-mobile lg:p-desktop">
          <div className="w-full rounded-l border border-border bg-cardBg p-2">
            <p className="text-text-sm text-grayTextPrimary">
              Status history content coming soon...
            </p>
          </div>
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
            hashString={formatString(memberData?.key?.cold ?? "", "long")}
            hash={memberData?.key?.cold ?? undefined}
            title='Cold Key'
            className='!mb-0'
          />
          <HeaderBannerSubtitle
            hashString={formatString(memberData?.key?.hot ?? "", "long")}
            hash={memberData?.key?.hot ?? undefined}
            title='Hot Key'
            className='!mt-0'
          />
        </div>
      }
      adsCarousel={false}
    >
      <section className='flex w-full flex-col items-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex-grow basis-[410px]'>
            <CCMemberDetailOverview
              memberData={memberData}
              isLoading={!data}
              isError={false}
            />
          </div>

          <div className='h-[110px] w-full max-w-[390px] flex-shrink-0'>
            <InfoCard
              icon={<Calendar size={20} className='text-primary' />}
              title='Mandate duration'
              className='h-full'
            >
              {startEpoch && endEpoch ? (
                <div className='text-text-lg font-semibold'>
                  Epoch{" "}
                  <Link
                    to='/epoch/$no'
                    params={{ no: startEpoch.toString() }}
                    className='text-primary'
                  >
                    {startEpoch}
                  </Link>
                  {" - "}Epoch{" "}
                  <Link
                    to='/epoch/$no'
                    params={{ no: endEpoch.toString() }}
                    className='text-primary'
                  >
                    {endEpoch}
                  </Link>
                </div>
              ) : (
                <span className='text-text-lg font-semibold'>Unknown</span>
              )}
            </InfoCard>
          </div>
        </div>
      </section>
      <Tabs items={tabItems} />
    </PageBase>
  );
};
