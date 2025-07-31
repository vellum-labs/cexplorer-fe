import { colors } from "@/constants/colors";
import type { TxInfo } from "@/types/txTypes";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, FileDigit, Hash, Flame } from "lucide-react";
import AddressCell from "../address/AddressCell";
import ConstLabelBadge from "../global/badges/ConstLabelBadge";
import Copy from "../global/Copy";
import { Tooltip } from "../ui/tooltip";

interface Props {
  utxo: TxInfo;
  isOutput?: boolean;
}

export const AddressWithTxBadges = ({ utxo, isOutput }: Props) => {
  return (
    <div className='mb-2 flex items-center gap-2'>
      <ConstLabelBadge type='sc' name={utxo.reference_script?.hash} />
      <AddressCell enableHover address={utxo.payment_addr_bech32} />
      <Tooltip
        content={
          <div className='flex w-[200px] flex-col items-center text-sm'>
            <p className='font-medium'>UTXO</p>
            <div className='mt-1 flex items-end justify-end break-all text-center text-sm'>
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
        <div className='flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-primary p-[2px]'>
          <ArrowLeftRight size={12} color={colors.primary} strokeWidth={3} />
        </div>
      </Tooltip>
      {utxo.datum_hash && (
        <Tooltip
          content={
            <div className='flex w-[200px] flex-col items-center'>
              <p className='w-full text-center font-medium'>Inline datum</p>
              <div className='mt-1 flex items-end justify-end break-all text-center text-sm'>
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
              <div className='mt-1 flex items-end justify-end break-all text-center text-sm'>
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
              <p className='w-full text-center font-medium'>Consumed by transaction</p>
              <div className='mt-1 flex items-end justify-end break-all text-center text-sm'>
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
          <Flame size={16} color={colors.primary} />
        </Tooltip>
      )}

      <span className='text-xs text-grayTextPrimary'>#{utxo?.tx_index}</span>
    </div>
  );
};
