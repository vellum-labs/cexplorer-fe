import { PageBase } from "@/components/global/pages/PageBase";
import { getRouteApi } from "@tanstack/react-router";
import { useFetchCCMemberDetail } from "@/services/governance";
import {
  HeaderBannerSubtitle,
  Image,
  Tabs,
  GlobalTable,
} from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { CCMemberDetailOverview } from "@/components/gov/cc/CCMemberDetailOverview";
import type { TableColumns } from "@/types/tableTypes";
import { useMemo } from "react";

export const CCMemberDetailPage = () => {
  const route = getRouteApi("/gov/cc/$coldKey");
  const { coldKey } = route.useParams();
  const { data } = useFetchCCMemberDetail(coldKey);

  const memberData = Array.isArray(data?.data)
    ? data.data.sort(
        (a, b) => (b.expiration_epoch ?? 0) - (a.expiration_epoch ?? 0),
      )[0]
    : data?.data;

  interface CCVoteData {
    date: string;
    type: string;
    actionName: string;
    vote: string;
    tx: string;
  }

  interface CCStatusHistoryData {
    date: string;
    type: string;
    effective: string;
    expiration: string;
    tx: string;
  }

  const votesColumns: TableColumns<CCVoteData> = useMemo(
    () => [
      {
        key: "date",
        render: () => <span>TBD</span>,
        title: <p>Date</p>,
        visible: true,
        widthPx: 80,
      },
      {
        key: "type",
        render: () => <span>TBD</span>,
        title: "Type",
        visible: true,
        widthPx: 110,
      },
      {
        key: "actionName",
        render: () => <span>TBD</span>,
        title: "Governance action name",
        visible: true,
        widthPx: 200,
      },
      {
        key: "vote",
        render: () => <span className='flex justify-end'>TBD</span>,
        title: <p className='w-full text-right'>Vote</p>,
        visible: true,
        widthPx: 80,
      },
      {
        key: "tx",
        render: () => <span className='flex justify-end'>TBD</span>,
        title: <p className='w-full text-right'>Tx</p>,
        visible: true,
        widthPx: 50,
      },
    ],
    [],
  );

  const mockVotesData: CCVoteData[] = [
    {
      date: "TBD",
      type: "TBD",
      actionName: "TBD",
      vote: "TBD",
      tx: "TBD",
    },
  ];

  const mockVotesQuery = {
    data: mockVotesData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => Promise.resolve({} as any),
  } as any;

  const statusHistoryColumns: TableColumns<CCStatusHistoryData> = useMemo(
    () => [
      {
        key: "date",
        render: () => <span>TBD</span>,
        title: <p>Date</p>,
        visible: true,
        widthPx: 80,
      },
      {
        key: "type",
        render: () => <span>TBD</span>,
        title: "Type",
        visible: true,
        widthPx: 110,
      },
      {
        key: "effective",
        render: () => <span>TBD</span>,
        title: "Effective",
        visible: true,
        widthPx: 110,
      },
      {
        key: "expiration",
        render: () => <span>TBD</span>,
        title: "Expiration",
        visible: true,
        widthPx: 110,
      },
      {
        key: "tx",
        render: () => <span className='flex justify-end'>TBD</span>,
        title: <p className='w-full text-right'>Tx</p>,
        visible: true,
        widthPx: 50,
      },
    ],
    [],
  );

  const mockStatusHistoryData: CCStatusHistoryData[] = [
    {
      date: "TBD",
      type: "TBD",
      effective: "TBD",
      expiration: "TBD",
      tx: "TBD",
    },
  ];

  const mockStatusHistoryQuery = {
    data: mockStatusHistoryData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => Promise.resolve({} as any),
  } as any;

  const tabItems = [
    {
      key: "votes",
      label: "Votes",
      content: (
        <div className='w-full max-w-desktop'>
          <GlobalTable
            type='default'
            itemsPerPage={10}
            rowHeight={60}
            scrollable
            query={mockVotesQuery}
            items={mockVotesData}
            columns={votesColumns}
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
          <GlobalTable
            type='default'
            itemsPerPage={10}
            rowHeight={60}
            scrollable
            query={mockStatusHistoryQuery}
            items={mockStatusHistoryData}
            columns={statusHistoryColumns}
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
          <div className='flex-grow basis-[410px]'>
            <CCMemberDetailOverview
              memberData={memberData}
              isLoading={!data}
              isError={false}
            />
          </div>
        </div>
      </section>
      <Tabs items={tabItems} />
    </PageBase>
  );
};
