import type { FC } from "react";
import type { useFetchMiscBasic } from "@/services/misc";
import type { DeFiOrder } from "@/types/tokenTypes";

import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Ellipsis,
  X,
} from "lucide-react";
import DexhunterIcon from "@/resources/images/icons/dexhunter.svg";
import SundaeSwapIcon from "@/resources/images/icons/sundaeswap.png";
import MinSwapIcon from "@/resources/images/icons/minswap.png";

import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { TimeDateIndicator } from "../global/TimeDateIndicator";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";

import { useDeFiOrderListTableStore } from "@/stores/tables/deFiOrderListTableStore";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";

import { addressIcons } from "@/constants/address";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { ADATokenName, currencySigns } from "@/constants/currencies";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { getConfirmations } from "@/utils/getConfirmations";
import { renderWithException } from "@/utils/renderWithException";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatNumberWithSuffix } from "@/utils/format/format";

interface DexSwapDetailCardProps {
  miscBasic: ReturnType<typeof useFetchMiscBasic>["data"];
  swapDetail: DeFiOrder | undefined;
  isLoading: boolean;
}

export const DexSwapDetailCard: FC<DexSwapDetailCardProps> = ({
  miscBasic,
  swapDetail,
  isLoading,
}) => {
  const { currency, setCurrency } = useDeFiOrderListTableStore()();

  const curr = useGetMarketCurrency(undefined, currency as any);

  const balanceAda = (swapDetail?.user?.balance ?? 0) / 1_000_000;

  const getLevel = (balance: number) => {
    if (balance >= 20_000_000) return "leviathan";
    if (balance >= 5_000_000) return "humpback";
    if (balance >= 1_000_000) return "whale";
    if (balance >= 250_000) return "shark";
    if (balance >= 100_000) return "dolphin";
    if (balance >= 25_000) return "tuna";
    if (balance >= 5_000) return "fish";
    if (balance >= 1_000) return "crab";
    if (balance >= 10) return "shrimp";
    return "plankton";
  };

  const level = getLevel(balanceAda);

  const Icon = addressIcons[level];

  const tokenInFingerPrint = getAssetFingerprint(
    swapDetail?.token_in?.name ?? "",
  );
  const tokenOutFingerPrint = getAssetFingerprint(
    swapDetail?.token_out?.name ?? "",
  );

  const isBuying = swapDetail?.token_in?.name === ADATokenName;

  const tokenAmount = isBuying
    ? swapDetail?.actual_out_amount
    : swapDetail?.amount_in;
  const adaPriceRaw = isBuying
    ? swapDetail?.amount_in
    : swapDetail?.actual_out_amount;

  const adaPrice = Number.isFinite((adaPriceRaw ?? 0) / (tokenAmount ?? 0))
    ? ((adaPriceRaw ?? 0) / (tokenAmount ?? 0)) * 1e6
    : 0;

  const [ada, usd] = lovelaceToAdaWithRates(adaPrice, curr);

  const isSuccess = swapDetail?.status === "COMPLETE";
  const isCanceled = swapDetail?.status === "CANCELLED";

  const confirmations = getConfirmations(
    miscBasic?.data.block.block_no,
    swapDetail?.block?.no,
  );

  const dexConfig: Record<
    string,
    {
      label: string;
      icon: string;
      textColor: string;
      bgColor: string;
      borderColor: string;
    }
  > = {
    SUNDAESWAP: {
      label: "Sundaeswap",
      icon: SundaeSwapIcon,
      textColor: "#E04F16",
      bgColor: "#FFF4ED",
      borderColor: "#FFD6AE",
    },
    SUNDAESWAPV3: {
      label: "Sundaeswapv3",
      icon: SundaeSwapIcon,
      textColor: "#E04F16",
      bgColor: "#FFF4ED",
      borderColor: "#FFD6AE",
    },
    MINSWAP: {
      label: "Minswap",
      icon: MinSwapIcon,
      textColor: "#001947",
      bgColor: "#DFE8FF",
      borderColor: "#83A2DC",
    },
    MINSWAPV2: {
      label: "Minswapv2",
      icon: MinSwapIcon,
      textColor: "#001947",
      bgColor: "#DFE8FF",
      borderColor: "#83A2DC",
    },
  };

  const dexKey = swapDetail?.dex?.toUpperCase() ?? "";
  const dex = dexConfig[dexKey];

  console.log(swapDetail);

  const detailItems = [
    {
      key: "address",
      title: "Address",
      value: renderWithException(
        swapDetail?.user?.address,
        <div className='flex items-center gap-2'>
          {swapDetail?.user?.balance && (
            <Image src={Icon} className='h-4 w-4 rounded-full' />
          )}
          <div className='flex items-center gap-2'>
            <Link
              to={"/address/$address"}
              params={{
                address: swapDetail?.user?.address ?? "",
              }}
              className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm text-primary`}
            >
              {swapDetail?.user?.address}
            </Link>
            <Copy copyText={swapDetail?.user?.address} />
          </div>
        </div>,
      ),
    },
    {
      key: "timestamp",
      title: "Timestamp",
      value: renderWithException(
        swapDetail?.submission_time,
        <TimeDateIndicator time={swapDetail?.submission_time} />,
      ),
    },
    {
      key: "tx",
      title: "Transaction",
      value: renderWithException(
        swapDetail?.tx_hash,
        <div className='flex items-center gap-2'>
          <Link
            to='/tx/$hash'
            params={{
              hash: swapDetail?.tx_hash as string,
            }}
            className='text-primary'
          >
            <span
              className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm`}
            >
              {swapDetail?.tx_hash}
            </span>
          </Link>
          <Copy copyText={swapDetail?.tx_hash} />
        </div>,
      ),
    },
    {
      key: "confirmation",
      title: "Confirmation",
      value: renderWithException(
        swapDetail?.block?.no,
        <div className='flex items-center gap-[2.5px] text-sm'>
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
        </div>,
      ),
      divider: true,
    },
    {
      key: "pair",
      title: "Pair",
      value: renderWithException(
        swapDetail?.token_in && swapDetail?.token_out,
        <div className='flex items-center gap-3'>
          <Link
            to='/asset/$fingerprint'
            params={{
              fingerprint: tokenInFingerPrint,
            }}
          >
            <p className='min-w-[50px] text-primary'>
              {renderAssetName({ name: swapDetail?.token_in?.name ?? "" })}
            </p>
          </Link>
          <ArrowRight size={15} className='block min-w-[20px]' />
          <Link
            to='/asset/$fingerprint'
            params={{
              fingerprint: tokenOutFingerPrint,
            }}
          >
            <p className='w-fit text-primary'>
              {renderAssetName({ name: swapDetail?.token_out?.name ?? "" })}
            </p>
          </Link>
        </div>,
      ),
    },
    {
      key: "input",
      title: "Input",
      value: renderWithException(
        swapDetail?.amount_in,
        <AdaWithTooltip data={(swapDetail?.amount_in ?? 0) * 1e6} />,
      ),
    },
    {
      key: "adaPrice",
      title: (
        <div>
          <span
            className='inline-block w-[33px] cursor-pointer select-none text-primary'
            onClick={() => setCurrency(currency === "ada" ? "usd" : "ada")}
          >
            {currency === "ada" ? "ADA" : "USD"}{" "}
          </span>
          <span>price</span>
        </div>
      ),
      value: renderWithException(
        swapDetail?.token_in?.name && swapDetail?.token_out?.name,
        currency === "ada" ? (
          <p title={ada} className='w-fit text-right'>
            <AdaWithTooltip data={adaPrice} />
          </p>
        ) : (
          <p title={ada} className='w-fit text-right'>
            {currencySigns["usd"]} {formatNumberWithSuffix(usd)}
          </p>
        ),
      ),
    },
    {
      key: "estimatedOutput",
      title: "Estimated Output",
      value: renderWithException(
        swapDetail?.expected_out_amount,
        <AdaWithTooltip data={(swapDetail?.expected_out_amount ?? 0) * 1e6} />,
      ),
    },
    {
      key: "actualOutput",
      title: "Actual Output",
      value: renderWithException(
        typeof swapDetail?.actual_out_amount === "number",
        <AdaWithTooltip data={(swapDetail?.actual_out_amount ?? 0) * 1e6} />,
      ),
    },
    {
      key: "status",
      title: "Status",
      value: renderWithException(
        swapDetail?.status,
        <div className='flex items-center'>
          <p className='flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
            {isSuccess ? (
              <Check className='text-greenText' size={15} />
            ) : isCanceled ? (
              <X size={15} className='text-redText' />
            ) : (
              <Ellipsis size={15} className='text-yellowText' />
            )}
            {swapDetail?.status
              ? (swapDetail?.status[0] ?? "").toUpperCase() +
                swapDetail?.status.slice(1).toLowerCase()
              : ""}
          </p>
        </div>,
      ),
    },
    {
      key: "lastUpdate",
      title: "Last Update",
      value: renderWithException(
        swapDetail?.last_update,
        <TimeDateIndicator time={swapDetail?.last_update} />,
      ),
      divider: true,
    },
    {
      key: "type",
      title: "Type",
      value: renderWithException(
        typeof swapDetail?.is_dexhunter === "boolean",
        <div className='flex items-center'>
          <p className='flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
            {isSuccess ? (
              <Image src={DexhunterIcon} className='h-4 w-4 rounded-full' />
            ) : (
              <ArrowLeftRight size={15} className='text-primary' />
            )}
            {swapDetail?.is_dexhunter ? "Aggregator swap" : "Direct swap"}
          </p>
        </div>,
      ),
    },
    {
      key: "dexes",
      title: "Dexes",
      value: renderWithException(
        swapDetail?.dex,
        <div className='flex items-center'>
          <p
            className={`flex w-fit items-center gap-1 rounded-xl border px-1.5 text-sm`}
            style={{
              backgroundColor: dex?.bgColor ?? "transparent",
              borderColor: dex?.borderColor ?? "var(--border)",
            }}
          >
            {!!dex?.icon && (
              <Image src={dex.icon} className='rounded-full' alt={dex?.label} />
            )}
            <span style={{ color: dex?.textColor ?? "var(--text)" }}>
              {dex?.label ??
                (dexKey
                  ? dexKey[0].toUpperCase() + dexKey.slice(1).toLowerCase()
                  : "")}
            </span>
          </p>
        </div>,
      ),
    },
    {
      key: "batcherFees",
      title: "Batcher Fees",
      value: renderWithException(
        typeof swapDetail?.batcher_fee === "number",
        <AdaWithTooltip data={(swapDetail?.batcher_fee ?? 0) * 1e6} />,
      ),
    },
    {
      key: "deposits",
      title: "Deposits",
      value: renderWithException(
        typeof swapDetail?.batcher_fee === "number",
        <AdaWithTooltip data={(swapDetail?.batcher_fee ?? 0) * 1e6} />,
      ),
    },
  ];

  console.log(swapDetail);

  return (
    <div
      className='thin-scrollbar w-full overflow-x-auto rounded-xl border border-border px-5 py-4'
      style={{
        transform: "rotateX(180deg)",
      }}
    >
      <div
        className='min-w-[1100px] xl:min-w-[auto]'
        style={{
          transform: "rotateX(180deg)",
        }}
      >
        <>
          <h2 className='text-base'>Overview</h2>
          <div className='flex flex-col gap-4 pt-4'>
            {detailItems.map(({ key, title, value, divider }) => (
              <div key={key}>
                <div className='flex w-full items-start'>
                  <p className='min-w-[200px] text-sm text-grayTextSecondary'>
                    {title}
                  </p>
                  <div className='w-full'>
                    {isLoading ? (
                      <LoadingSkeleton width='100%' height='20px' />
                    ) : (
                      value
                    )}
                  </div>
                </div>
                {divider && (
                  <div className='my-2 w-full self-center border border-border' />
                )}
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};
