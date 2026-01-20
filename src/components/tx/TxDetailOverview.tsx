import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { useFetchMiscBasic } from "@/services/misc";
import type { TxDetailResponse } from "@/types/txTypes";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  formatDate,
  formatNumber,
  formatString,
  EpochCell,
  BlockCell,
} from "@vellumlabs/cexplorer-sdk";
import { getConfirmations } from "@/utils/getConfirmations";
import { getEpochSlot } from "@/utils/getEpochSlot";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import type { UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  GitFork,
  Lock,
} from "lucide-react";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TotalSumWithRates } from "@vellumlabs/cexplorer-sdk";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { MintedByCard } from "@vellumlabs/cexplorer-sdk";
import type { OverviewList } from "@vellumlabs/cexplorer-sdk";
import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { SizeCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import TtlCountdown from "./TtlCountdown";
import { useEffect, useState } from "react";
import { getAddonsForMetadata } from "@/utils/addons/getAddonsForMetadata";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";

interface Props {
  query: UseQueryResult<TxDetailResponse, unknown>;
}

const TxDetailOverview = ({ query }: Props) => {
  const { t } = useAppTranslation("common");
  const data = query.data?.data;

  const miscBasicQuery = useFetchMiscBasic();

  const { data: miscBasic } = miscBasicQuery;

  const miscData = useMiscConst(miscBasic?.data.version.const);

  const { currency } = useCurrencyStore();

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

  const tx_ex_mem =
    data?.plutus_contracts
      ?.flatMap(contract => contract.input || [])
      .reduce((sum, input) => sum + (input?.redeemer?.unit?.mem || 0), 0) || 0;

  const tx_ex_steps =
    data?.plutus_contracts
      ?.flatMap(contract => contract.input || [])
      .reduce((sum, input) => sum + (input?.redeemer?.unit?.steps || 0), 0) ||
    0;

  const overviewListItems: OverviewList = [
    {
      label: t("tx.labels.hash"),
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
      label: t("tx.labels.date"),
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
      label: t("tx.labels.height"),
      value: (
        <div className='text-text-sm'>
          <BlockCell
            hash={String(data?.block?.hash) || ""}
            no={data?.block?.no ?? 0}
            justify='start'
          />
        </div>
      ),
    },
    {
      label: t("tx.labels.totalOutput"),
      value: (
        <TotalSumWithRates
          sum={outsum}
          ada={data?.out_sum ?? 0}
          currency={currency}
        />
      ),
    },
    {
      label: t("tx.labels.fee"),
      value: (
        <TotalSumWithRates
          sum={feesum}
          ada={data?.fee ?? 0}
          currency={currency}
        />
      ),
    },
    {
      label: t("tx.labels.epoch"),
      value: (
        <div className='text-text-sm'>
          <EpochCell no={data?.epoch_param?.epoch_no} justify='start' />
        </div>
      ),
    },
    data?.invalid_before && data?.invalid_hereafter
      ? {
          label: t("tx.labels.slot"),
          value: (
            <div className='flex flex-wrap items-center gap-1/2 text-text-sm leading-none'>
              <span className='font-medium text-grayTextPrimary'>
                {data?.invalid_before ? formatNumber(data?.block.slot_no) : "-"}
              </span>
              <span className='pr-1/2 text-grayTextPrimary'>
                ({t("tx.epochSlot")}{" "}
                {getEpochSlot(data.block.slot_no, data.epoch_param.epoch_no)})
              </span>
            </div>
          ),
        }
      : undefined,
    data?.invalid_hereafter
      ? {
          label: t("tx.labels.ttl"),
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
          label: t("tx.labels.deposit"),
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
      label: t("tx.labels.confirmations"),
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
          label: t("tx.labels.treasuryDonation"),
          value: <AdaWithTooltip data={data.treasury_donation} />,
        }
      : undefined,
    addonComponents.length
      ? {
          label: t("tx.labels.keyMessage"),
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
            title={t("tx.transactionOverview")}
            overviewList={overviewListItems}
            className='max-h-[450px] pt-2'
            columnGap='clamp(48px, 8vw, 150px)'
          />
          <section className='flex w-full flex-col gap-5 lg:h-[400px] lg:w-[400px]'>
            <MintedByCard
              poolInfo={data?.pool}
              isGenesisBlock={data?.block?.epoch_no === null}
              miscData={miscData}
              generateImageUrl={generateImageUrl}
            />
            <SizeCard
              size={data?.size}
              maxSize={data?.epoch_param?.max_tx_size}
              title={t("tx.transactionSize")}
              icon={<GitFork size={20} className='text-primary' />}
              isTx={true}
              max_tx_ex_mem={data?.epoch_param?.max_tx_ex_mem}
              max_tx_ex_steps={data?.epoch_param?.max_tx_ex_steps}
              tx_ex_mem={tx_ex_mem}
              tx_ex_steps={tx_ex_steps}
            />
            <AdsCarousel
              generateImageUrl={generateImageUrl}
              miscBasicQuery={miscBasicQuery}
              singleItem
              className='p-0 md:p-0'
            />
          </section>
        </>
      )}
    </div>
  );
};

export default TxDetailOverview;
