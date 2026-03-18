import type { FC } from "react";
import { Modal, Button, formatString, DateCell, formatDate } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Link } from "@tanstack/react-router";
import {
  CheckSquare,
  Wallet,
  CircleX,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetailSilent } from "@/services/tx";
import { useFetchMiscBasic } from "@/services/misc";
import { getConfirmations } from "@/utils/getConfirmations";

interface PaymentSuccessModalProps {
  address: string;
  amount: number;
  message?: string;
  txHash: string;
  adaPrice?: number | null;
  onClose: () => void;
  onSendAnother: () => void;
}

export const PaymentSuccessModal: FC<PaymentSuccessModalProps> = ({
  address,
  amount,
  message,
  txHash,
  adaPrice,
  onClose,
  onSendAnother,
}) => {
  const { t } = useAppTranslation("common");

  const txDetail = useFetchTxDetailSilent(txHash);

  const miscBasic = useFetchMiscBasic(true);

  const txData = txDetail.data?.data;
  const txBlockNo = txData?.block?.no;
  const txBlockTime = txData?.block?.time;
  const miscBlockNo = miscBasic.data?.data?.block?.block_no;
  const hasTxData = !!txBlockNo;
  const confirmations = getConfirmations(miscBlockNo, txBlockNo);

  const usdValue =
    adaPrice && amount > 0
      ? `($${formatNumber((amount * adaPrice).toFixed(2))})`
      : null;

  return (
    <Modal maxWidth='min(520px, 95vw)' onClose={onClose}>
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center gap-2'>
          <CheckSquare size={20} className='text-primary' />
          <h2 className='text-text-md font-semibold'>
            {t("wallet.payment.successTitle")}
          </h2>
        </div>

        <div className='flex flex-col divide-y divide-border'>
          <div className='flex items-center justify-between gap-4 py-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("wallet.payment.recipient")}
            </span>
            <Link
              to='/address/$address'
              params={{ address }}
              className='min-w-0 truncate text-text-sm text-primary'
            >
              {formatString(address, "long")}
            </Link>
          </div>

          <div className='flex items-center justify-between gap-4 py-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("wallet.payment.amount")}
            </span>
            <span className='text-text-sm'>
              ₳ {formatNumber(amount)}{" "}
              {usdValue && (
                <span className='text-grayTextPrimary'>{usdValue}</span>
              )}
            </span>
          </div>

          {message && (
            <div className='flex items-center justify-between gap-4 py-2'>
              <span className='shrink-0 text-text-sm text-grayTextPrimary'>
                {t("wallet.payment.message")}
              </span>
              <span className='min-w-0 truncate text-text-sm'>{message}</span>
            </div>
          )}

          <div className='flex items-center justify-between gap-4 py-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("wallet.payment.transactionHash")}
            </span>
            <Link
              to='/tx/$hash'
              params={{ hash: txHash }}
              className='min-w-0 truncate text-text-sm text-primary'
            >
              {formatString(txHash, "long")}
            </Link>
          </div>

          <div className='flex items-center justify-between gap-4 py-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("tx.labels.date")}
            </span>
            <div className='text-text-sm'>
              {txBlockTime ? (
                <span className='flex flex-wrap items-center gap-1'>
                  <DateCell time={txBlockTime} />
                  <span className='hidden text-grayTextPrimary sm:inline'>
                    ({formatDate(txBlockTime)})
                  </span>
                </span>
              ) : (
                <span className='text-grayTextPrimary'>
                  {t("wallet.payment.pendingConfirmation")}
                </span>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between gap-4 py-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("tx.labels.confirmations")}
            </span>
            <div className='flex items-center gap-1 text-text-sm'>
              {!hasTxData ? (
                <span className='text-grayTextPrimary'>
                  {t("wallet.payment.pendingConfirmation", "Pending...")}
                </span>
              ) : (
                <>
                  {confirmations[1] < 3 && (
                    <CircleX size={15} className='text-red-500' />
                  )}
                  {confirmations[1] > 2 && confirmations[1] < 9 && (
                    <CircleAlert size={15} className='text-yellow-500' />
                  )}
                  {confirmations[1] > 9 && (
                    <CircleCheck size={15} className='text-green-600' />
                  )}
                  <span
                    className={`font-bold ${confirmations[1] > 9 ? "text-green-500" : confirmations[1] > 2 ? "text-yellow-500" : "text-red-500"}`}
                  >
                    {confirmations[0]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='mt-2 flex justify-end'>
          <Button
            label={t("wallet.payment.sendAnother")}
            variant='primary'
            size='md'
            leftIcon={<Wallet size={16} />}
            onClick={onSendAnother}
          />
        </div>
      </div>
    </Modal>
  );
};
