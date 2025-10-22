import { useEffect, useState, type FC } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  HardDrive,
} from "lucide-react";

import { BlockDetailTable } from "@/components/blocks/BlockDetail/BlockDetailTable";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

import { useFetchBlockDetail } from "@/services/blocks";
import { useFetchMiscBasic, useFetchMiscSearch } from "@/services/misc";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";

import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { getConfirmations } from "@/utils/getConfirmations";

import { MintedByCard } from "@/components/global/cards/MintedByCard";
import type { OverviewList } from "@/components/global/cards/OverviewCard";
import { OverviewCard } from "@/components/global/cards/OverviewCard";
import { SizeCard } from "@vellumlabs/cexplorer-sdk";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { TotalSumWithRates } from "@/components/global/TotalSumWithRates";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";

const BlockDetailPage: FC = () => {
  const route = getRouteApi("/block/$hash");
  const { hash } = route.useParams();
  const blockDetail = useFetchBlockDetail(hash ?? "");

  const [blockHeight, setBlockHeight] = useState<number>();

  const navigate = useNavigate();

  const { data: searchData } = useFetchMiscSearch(
    blockHeight ? String(blockHeight) : undefined,
    "block",
    "en",
  );

  const { data } = blockDetail;
  const { data: miscBasic } = useFetchMiscBasic(true);
  const curr = useGetMarketCurrency();

  const confirmations = getConfirmations(
    miscBasic?.data.block.block_no,
    data?.block_no,
  );

  let outsum: [string, number, number, number] = ["", 0, 0, 0];
  let feesum: [string, number, number, number] = ["", 0, 0, 0];
  let rewards: [string, number, number, number] = ["", 0, 0, 0];

  if (Array.isArray(data?.txs) && data.txs[0] !== undefined) {
    if (curr && curr.ada) {
      outsum = lovelaceToAdaWithRates(
        data.txs?.map(item => item.out_sum).reduce((a, b) => a + b, 0),
        curr,
      );
      feesum = lovelaceToAdaWithRates(
        data.txs.map(item => item.fee).reduce((a, b) => a + b, 0),
        curr,
      );
    }
  }

  if (data?.rewards && data.time && curr && curr.ada) {
    rewards = lovelaceToAdaWithRates(data.rewards, curr);
  }

  const disableNextBlock =
    data?.block_no && miscBasic
      ? data?.block_no >= miscBasic?.data?.block?.block_no
      : true;

  const disablePreviousBlock = data?.block_no ? data?.block_no < 1 : true;

  const overviewListItems: OverviewList = [
    {
      label: "Date",
      value: <TimeDateIndicator time={data?.time} />,
    },
    {
      label: "Height",
      value: (
        <div className='flex items-center gap-1'>
          <span className='text-text-sm font-medium text-text'>
            {formatNumber(data?.block_no ?? 0)}
          </span>
          <div>
            <div className='flex items-center gap-1/2'>
              <Tooltip
                content={
                  <p className='text-nowrap'>
                    {disablePreviousBlock
                      ? "Can't move to previous block"
                      : "View previous block"}
                  </p>
                }
              >
                <div
                  className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[4px] border border-border ${disablePreviousBlock ? "pointer-events-none" : ""}`}
                  onClick={() =>
                    setBlockHeight(
                      data?.block_no ? data?.block_no - 1 : undefined,
                    )
                  }
                >
                  <ChevronLeft
                    size={14}
                    className={disablePreviousBlock ? "text-border" : ""}
                  />
                </div>
              </Tooltip>
              <Tooltip
                content={
                  <p className='text-nowrap'>
                    {disableNextBlock
                      ? "Can't move to next block"
                      : "View next block"}
                  </p>
                }
              >
                <div
                  className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[4px] border border-border ${disableNextBlock ? "pointer-events-none" : ""}`}
                  onClick={() =>
                    setBlockHeight(
                      data?.block_no ? data?.block_no + 1 : undefined,
                    )
                  }
                >
                  <ChevronRight
                    size={14}
                    className={disableNextBlock ? "text-border" : ""}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Epoch",
      value: (
        <span className='cursor-pointer text-text-sm font-medium text-primary'>
          <Link to='/epoch/$no' params={{ no: String(data?.epoch_no ?? 0) }}>
            {data?.epoch_no}
          </Link>
        </span>
      ),
    },
    {
      label: "Slot",
      value: (
        <div className='flex flex-wrap items-center gap-1/2 text-text-sm leading-none'>
          <span className='font-medium text-text'>
            {formatNumber(data?.slot_no ?? 0)}
          </span>
          <span className='pr-1/2 text-grayTextPrimary'>
            (epoch slot {formatNumber(data?.epoch_slot_no ?? 0)})
          </span>
        </div>
      ),
    },
    {
      label: <span className='inline-block break-words'>Confirmations</span>,
      value: (
        <div className='flex items-center gap-[2.5px] text-text-sm'>
          {confirmations[1] < 3 && (
            <CircleX size={15} className='translate-y-[1px] text-red-500' />
          )}
          {confirmations[1] > 2 && confirmations[1] < 9 && (
            <CircleAlert
              size={15}
              className='translate-y-[1px] text-yellow-500'
            />
          )}
          {confirmations[1] > 9 && (
            <CircleCheck
              size={15}
              className='translate-y-[1px] text-green-600'
            />
          )}
          <span
            className={`font-bold ${confirmations[1] > 9 ? "text-green-500" : confirmations[1] > 2 ? "text-yellow-500" : "text-red-500"}`}
          >
            {confirmations[0]}
          </span>
        </div>
      ),
    },
  ];

  const overviewTransactionsListItems: OverviewList = [
    {
      label: <span className='text-nowrap'>Total Transactions</span>,
      value: (
        <span className='text-text-sm font-medium text-text'>
          {data?.tx_count ? data.tx_count : 0}
        </span>
      ),
    },
    {
      label: "Total Output",
      value: (
        <TotalSumWithRates
          sum={outsum}
          ada={
            data?.txs?.map(item => item.out_sum).reduce((a, b) => a + b, 0) ?? 0
          }
        />
      ),
    },
    {
      label: "Total Fees",
      value: (
        <TotalSumWithRates
          sum={feesum}
          ada={data?.txs?.map(item => item.fee).reduce((a, b) => a + b, 0) ?? 0}
        />
      ),
    },
    {
      label: "Total Rewards",
      value: <TotalSumWithRates sum={rewards} ada={data?.rewards ?? 0} />,
    },
  ];

  useEffect(() => {
    if (
      searchData?.data &&
      Array.isArray(searchData?.data) &&
      searchData?.data.length > 0
    ) {
      navigate({
        to: "/block/$hash",
        params: {
          hash: searchData?.data[0]?.ident,
        },
      });
    }
  }, [searchData]);

  return (
    <PageBase
      metadataTitle='blockDetail'
      metadataReplace={{
        before: "%block%",
        after: hash,
      }}
      breadcrumbItems={[
        {
          label: (
            <span className='inline pt-1/2'>
              Epoch{" "}
              {data?.epoch_param?.epoch_no &&
                `(${data?.epoch_param?.epoch_no})`}
            </span>
          ),
          ...(data?.epoch_param?.epoch_no
            ? {
                link: "/epoch/$no",
                params: {
                  no: String(data?.epoch_param?.epoch_no) || "",
                },
              }
            : {}),
        },
        {
          label: <span className=''>{formatString(hash ?? "", "long")}</span>,
          ident: hash,
        },
      ]}
      title='Block Detail'
      subTitle={
        <HeaderBannerSubtitle
          hashString={formatString(hash ?? "", "long")}
          hash={hash}
        />
      }
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 p-mobile md:p-desktop xl:flex-nowrap xl:justify-start'>
          {!data ? (
            <>
              <div className='flex grow basis-[980px] flex-wrap gap-3'>
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[460px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[430px] px-4 py-2'
                />
              </div>
              <div className='flex min-h-full w-[400px] flex-grow flex-col gap-3 xl:justify-between xl:gap-0'>
                <LoadingSkeleton
                  className='basis-[400px] lg:basis-[416px]'
                  maxHeight='110px'
                  rounded='xl'
                />
                <LoadingSkeleton
                  className='basis-[450px] lg:basis-[400px]'
                  maxHeight='105px'
                  rounded='xl'
                />
              </div>
            </>
          ) : (
            <>
              <div className='flex grow basis-[980px] flex-wrap gap-3'>
                <OverviewCard
                  title='Block Overview'
                  overviewList={overviewListItems}
                  className='h-auto min-h-[227px]'
                />
                <OverviewCard
                  title='Transactions and Fees'
                  overviewList={overviewTransactionsListItems}
                  className='h-auto'
                />
              </div>
              <div className='flex w-[400px] flex-grow flex-col gap-3 xl:justify-between xl:gap-0'>
                <MintedByCard
                  poolInfo={data?.pool}
                  vrfKey={data?.vrf_key ?? ""}
                  protoMajor={data?.proto_major}
                  protoMinor={data?.proto_minor}
                  isGenesisBlock={data?.epoch_no === null}
                />
                <SizeCard
                  size={data.size}
                  maxSize={data.epoch_param?.max_block_size}
                  title='Block size'
                  icon={<HardDrive size={20} className='text-primary' />}
                />
              </div>
            </>
          )}
        </div>
      </section>
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col flex-wrap justify-center gap-3 px-mobile pb-3 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <BlockDetailTable txs={data?.txs} blockDetail={blockDetail} />
        </div>
      </section>
    </PageBase>
  );
};

export default BlockDetailPage;
