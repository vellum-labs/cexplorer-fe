import type { PaymentData } from "@/utils/payment/paymentLink";
import type { FC } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { buildPaymentUrl } from "@/utils/payment/paymentLink";
import { Button, Copy, Modal } from "@vellumlabs/cexplorer-sdk";
import { QRCodeSVG } from "qrcode.react";

interface GenerateLinkModalProps {
  paymentData: PaymentData;
  onClose: () => void;
}

export const GenerateLinkModal: FC<GenerateLinkModalProps> = ({
  paymentData,
  onClose,
}) => {
  const { t } = useAppTranslation("common");
  const paymentUrl = buildPaymentUrl(paymentData);

  return (
    <Modal maxWidth='min(480px, 95vw)' maxHeight='90vh' onClose={onClose} className='border border-border'>
      <div className='flex w-full flex-col gap-4 p-4'>
        <div>
          <h2 className='text-text-lg font-semibold'>
            {t("wallet.payment.generateLinkTitle", "Payment link")}
          </h2>
          <p className='mt-1 text-text-sm text-grayTextPrimary'>
            {t(
              "wallet.payment.generateLinkDescription",
              "Share this link or QR code to receive a payment.",
            )}
          </p>
        </div>

        <div className='flex justify-center'>
          <QRCodeSVG value={paymentUrl} size={200} />
        </div>

        <div className='flex h-10 items-center gap-2 rounded-m border border-border bg-darker px-3'>
          <span className='min-w-0 flex-1 truncate text-text-sm'>
            {paymentUrl}
          </span>
          <Copy copyText={paymentUrl} size={16} />
        </div>

        <Button
          label={t("wallet.payment.close", "Close")}
          variant='secondary'
          size='md'
          onClick={onClose}
          className='w-full'
        />
      </div>
    </Modal>
  );
};
