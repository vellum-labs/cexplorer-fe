import { colors } from "@/constants/colors";
import type { TxInfo } from "@/types/txTypes";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  FileDigit,
  Hash,
  Flame,
  CreditCard,
} from "lucide-react";
import AddressCell from "../address/AddressCell";
import ConstLabelBadge from "../global/badges/ConstLabelBadge";
import Copy from "../global/Copy";
import { Tooltip } from "../ui/tooltip";
import type { UtxoSearchMatchType } from "@/utils/tx/filterUtxoBySearch";

interface Props {
  utxo: TxInfo;
  isOutput?: boolean;
  enableHover?: boolean;
  matchTypes?: UtxoSearchMatchType[];
}

export const AddressWithTxBadges = ({
  utxo,
  isOutput,
  enableHover = false,
  matchTypes = [],
}: Props) => {
  const shouldHighlightAddress =
    enableHover && matchTypes.includes("payment_address");
  const shouldHighlightPaymentCred =
    enableHover && matchTypes.includes("payment_credential");
  const shouldHighlightStakeKey =
    enableHover && matchTypes.includes("stake_address");
  const shouldHighlightUtxo = enableHover && matchTypes.includes("tx_hash");
  const shouldHighlightConsumedBy =
    enableHover && matchTypes.includes("consumed_by");
  const shouldHighlightIndex = enableHover && matchTypes.includes("index");

  return (
    <div className='mb-1 flex items-center gap-1'>
      <ConstLabelBadge type='sc' name={utxo.reference_script?.hash} />
      <AddressCell
        enableHover={shouldHighlightAddress}
        forceHighlight={shouldHighlightAddress}
        highlightStakeKey={shouldHighlightStakeKey}
        address={utxo.payment_addr_bech32}
      />
      <Tooltip
        content={
          <div className='text-text-sm flex w-[200px] flex-col items-center'>
            <p className='font-medium'>UTXO</p>
            <div className='mt-1/2 text-text-sm flex items-end justify-end break-all text-center'>
              <Link
                to='/tx/$hash'
                params={{ hash: utxo.tx_hash }}
                className='text-primary'
              >
                {`${utxo.tx_hash}#${utxo.tx_index}`}
              </Link>{" "}
              <Copy copyText={`${utxo.tx_hash}#${utxo.tx_index}`} />
            </div>
          </div>
        }
      >
        <div
          className={`rounded-max flex h-4 w-4 items-center justify-center border-[1.5px] border-primary p-[2px] ${shouldHighlightUtxo ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""}`}
        >
          <ArrowLeftRight size={12} color={colors.primary} strokeWidth={3} />
        </div>
      </Tooltip>
      {utxo.datum_hash && (
        <Tooltip
          content={
            <div className='flex w-[200px] flex-col items-center'>
              <p className='w-full text-center font-medium'>Inline datum</p>
              <div className='mt-1/2 text-text-sm flex items-end justify-end break-all text-center'>
                <Link
                  to='/datum'
                  search={{ hash: utxo.datum_hash }}
                  className='text-primary'
                >
                  {utxo.datum_hash}
                </Link>
                <Copy copyText={utxo.datum_hash} />
              </div>
            </div>
          }
        >
          <FileDigit size={16} color={colors.primary} />
        </Tooltip>
      )}
      {utxo.reference_script?.hash && (
        <Tooltip
          content={
            <div className='flex w-[200px] flex-col items-center'>
              <p className='w-full text-center font-medium'>Script Hash</p>
              <div className='mt-1/2 text-text-sm flex items-end justify-end break-all text-center'>
                <Link
                  to='/script/$hash'
                  params={{ hash: utxo.reference_script.hash }}
                  className='text-primary'
                >
                  {utxo.reference_script.hash}
                </Link>
                <Copy copyText={utxo.reference_script.hash} />
              </div>
            </div>
          }
        >
          <Hash size={16} color={colors.primary} />
        </Tooltip>
      )}
      {utxo.consumed_utxo && isOutput && (
        <Tooltip
          content={
            <div className='flex w-[200px] flex-col items-center'>
              <p className='w-full text-center font-medium'>
                Consumed by transaction
              </p>
              <div className='mt-1/2 text-text-sm flex items-end justify-end break-all text-center'>
                <Link
                  to='/tx/$hash'
                  params={{ hash: utxo.consumed_utxo }}
                  className='text-primary'
                >
                  {utxo.consumed_utxo}
                </Link>
                <Copy copyText={utxo.consumed_utxo} />
              </div>
            </div>
          }
        >
          <div
            className={`flex items-center ${shouldHighlightConsumedBy ? "px-1/2 rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""}`}
          >
            <Flame size={16} color={colors.primary} />
          </div>
        </Tooltip>
      )}

      {utxo.payment_addr_cred && (
        <Tooltip
          content={
            <div className='text-text-sm flex w-[200px] flex-col items-center'>
              <p className='font-medium'>Payment Credential</p>
              <div className='mt-1/2 text-text-sm flex items-end justify-end break-all text-center'>
                <span className='break-all text-primary'>
                  {utxo.payment_addr_cred}
                </span>
                <Copy copyText={utxo.payment_addr_cred} />
              </div>
            </div>
          }
        >
          <div
            className={`flex items-center ${shouldHighlightPaymentCred ? "px-1/2 rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""}`}
          >
            <CreditCard size={15} color={colors.primary} />
          </div>
        </Tooltip>
      )}

      <span
        className={`text-text-xs text-grayTextPrimary ${shouldHighlightIndex ? "px-1/2 rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""}`}
      >
        #{utxo?.tx_index}
      </span>
    </div>
  );
};
