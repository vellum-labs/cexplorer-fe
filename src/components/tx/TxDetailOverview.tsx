import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { useFetchMiscBasic } from "@/services/misc";
import type { TxDetailResponse } from "@/types/txTypes";
import { formatDate, formatNumber, formatString } from "@/utils/format/format";
import { getConfirmations } from "@/utils/getConfirmations";
import { getEpochSlot } from "@/utils/getEpochSlot";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  GitFork,
  Lock,
} from "lucide-react";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TotalSumWithRates } from "../global/TotalSumWithRates";
import AdsCarousel from "../global/ads/AdsCarousel";
import { MintedByCard } from "../global/cards/MintedByCard";
import type { OverviewList } from "../global/cards/OverviewCard";
import { OverviewCard } from "../global/cards/OverviewCard";
import { SizeCard } from "../global/cards/SizeCard";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import TtlCountdown from "./TtlCountdown";
import { useEffect, useState } from "react";
import { getAddonsForMetadata } from "@/utils/addons/getAddonsForMetadata";

interface Props {
  query: UseQueryResult<TxDetailResponse, unknown>;
}

const TxDetailOverview = ({ query }: Props) => {
  const data = query.data?.data;

  const { data: miscBasic } = useFetchMiscBasic();
  const [addonComponents, setAddonComponents] = useState<any[]>([]);
  const confirmations = getConfirmations(
    miscBasic?.data?.block.block_no,
    data?.block?.no,
  );

  const curr = useGetMarketCurrency(
    data?.block?.time ? new Date(data.block.time) : undefined,
  );

  const navigate = useNavigate();

  let outsum: [string, number, number, number] = ["", 0, 0, 0];
  let feesum: [string, number, number, number] = ["", 0, 0, 0];

  if (data?.out_sum) {
    if (Object.values(curr).length) {
      outsum = lovelaceToAdaWithRates(data.out_sum, curr);
      feesum = lovelaceToAdaWithRates(data.fee, curr);
    }
  }

  const overviewListItems: OverviewList = [
    {
      label: "Hash",
      value: (
        <div className='flex items-center gap-1/2'>
          <span title={data?.hash} className='text-text-sm'>
            {formatString(data?.hash || "", "long")}
          </span>
          <Copy copyText={data?.hash || ""} />
        </div>
      ),
    },
    {
      label: "Date",
      value: (
        <div className='flex flex-wrap items-center gap-1/2 text-text-sm'>
          <span className='font-medium leading-none'>
            <DateCell className='' time={data?.block?.time} />
          </span>
          <span className='flex items-center gap-1/2 pr-1/2 text-grayTextPrimary'>
            ({formatDate(data?.block?.time ? data?.block?.time : undefined)}){" "}
            <Clock size={14} className='h-full shrink-0 text-grayTextPrimary' />
          </span>
        </div>
      ),
    },
    {
      label: "Height",
      value: (
        <Link
          to='/block/$hash'
          params={{ hash: String(data?.block?.hash) || "" }}
          className='text-text-sm font-medium text-primary'
        >
          {formatNumber(data?.block?.no ?? 0)}
        </Link>
      ),
    },
    {
      label: "Total Output",
      value: <TotalSumWithRates sum={outsum} ada={data?.out_sum ?? 0} />,
    },
    {
      label: "Fee",
      value: <TotalSumWithRates sum={feesum} ada={data?.fee ?? 0} />,
    },
    {
      label: "Epoch",
      value: (
        <span className='cursor-pointer text-text-sm font-medium text-primary'>
          <Link
            to='/epoch/$no'
            params={{ no: String(data?.epoch_param?.epoch_no ?? 0) }}
            className='text-primary'
          >
            {data?.epoch_param?.epoch_no}
          </Link>
        </span>
      ),
    },
    data?.invalid_before && data?.invalid_hereafter
      ? {
          label: "Slot",
          value: (
            <div className='flex flex-wrap items-center gap-1/2 text-text-sm leading-none'>
              <span className='font-medium text-grayTextPrimary'>
                {data?.invalid_before ? formatNumber(data?.block.slot_no) : "-"}
              </span>
              <span className='pr-1/2 text-grayTextPrimary'>
                (epoch slot{" "}
                {getEpochSlot(data.block.slot_no, data.epoch_param.epoch_no)})
              </span>
            </div>
          ),
        }
      : undefined,
    data?.invalid_hereafter
      ? {
          label: "TTL",
          value: (
            <div className='flex items-center gap-1/2 text-text-sm'>
              <Lock
                size={16}
                strokeWidth={2.5}
                className='shrink-0 text-grayTextPrimary'
              />
              {data && miscBasic?.data && (
                <span className='font-medium text-grayTextPrimary'>
                  <TtlCountdown
                    seconds={data.invalid_hereafter}
                    slot_no={miscBasic?.data?.block.slot_no}
                    blockTime={miscBasic?.data?.block.time}
                  />
                </span>
              )}
            </div>
          ),
        }
      : undefined,
    data?.deposit
      ? {
          label: "Deposit",
          value: (
            <div className='flex items-center gap-1/2 text-text-sm'>
              <span className='font-medium'>
                <AdaWithTooltip data={data.deposit} />
              </span>
            </div>
          ),
        }
      : undefined,
    {
      label: "Confirmations",
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
    data?.treasury_donation && data.treasury_donation > 0
      ? {
          label: "Treasury donation",
          value: <AdaWithTooltip data={data.treasury_donation} />,
        }
      : undefined,
    addonComponents.length
      ? {
          label: "Key message",
          value: (
            <div
              onClick={() => {
                navigate({
                  search: {
                    tab: "view",
                  } as any,
                });
              }}
              className='cursor-pointer'
            >
              {addonComponents[0].component}
            </div>
          ),
        }
      : undefined,
  ];

  useEffect(() => {
    if (!data?.metadata) return;

    getAddonsForMetadata(data?.metadata as any, "embed-view").then(results =>
      setAddonComponents(results),
    );
  }, [data?.metadata]);

  return (
    <div className='flex h-full w-full max-w-desktop flex-col gap-3 px-mobile lg:flex-row lg:px-desktop'>
      {!data ? (
        <>
          <LoadingSkeleton
            height='400px'
            rounded='xl'
            className='grow basis-[450px]'
          />
          <section className='flex w-full flex-col gap-3 lg:h-[400px] lg:w-[400px] lg:justify-between'>
            <LoadingSkeleton
              className='basis-[400px] lg:basis-[400px]'
              height='110px'
              maxHeight='110px'
              rounded='xl'
            />
            <LoadingSkeleton
              className='basis-[450px] lg:basis-[400px]'
              height='104px'
              maxHeight='104px'
              rounded='xl'
            />
            <LoadingSkeleton
              className='basis-[400px] lg:basis-[400px]'
              height='100px'
              maxHeight='100px'
              rounded='xl'
            />
          </section>
        </>
      ) : (
        <>
          <OverviewCard
            title='Transaction Overview'
            overviewList={overviewListItems}
            className='max-h-[450px] pt-2'
            columnGap='clamp(48px, 8vw, 150px)'
          />
          <section className='flex w-full flex-col gap-5 lg:h-[400px] lg:w-[400px]'>
            <MintedByCard
              poolInfo={data?.pool}
              isGenesisBlock={data?.block?.epoch_no === null}
            />
            <SizeCard
              size={data?.size}
              maxSize={data?.epoch_param?.max_block_size}
              title='Transaction size'
              icon={<GitFork size={20} className='text-primary' />}
            />
            <AdsCarousel singleItem className='p-0 md:p-0' />
          </section>
        </>
      )}
    </div>
  );
};

export default TxDetailOverview;
