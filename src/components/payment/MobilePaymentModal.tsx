import type { PaymentData } from "@/utils/payment/paymentLink";
import type { FC } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { buildCardanoUri } from "@/utils/payment/paymentLink";
import { Button, Modal } from "@vellumlabs/cexplorer-sdk";
import { QRCodeSVG } from "qrcode.react";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";

interface MobilePaymentModalProps {
  paymentData: PaymentData;
  onClose: () => void;
}

export const MobilePaymentModal: FC<MobilePaymentModalProps> = ({
  paymentData,
  onClose,
}) => {
  const { t } = useAppTranslation("common");
  const cardanoUri = buildCardanoUri(paymentData);

  useEffect(() => {
    if (isMobile) {
      window.location.href = cardanoUri;
    }
  }, [cardanoUri]);

  return (
    <Modal maxWidth='min(480px, 95vw)' maxHeight='90vh' onClose={onClose} className='border border-border'>
      <div className='flex w-full flex-col gap-4 p-4'>
        <div>
          <h2 className='text-text-lg font-semibold'>
            {t(
              "wallet.payment.mobileWalletTitle",
              "QR code payment via mobile wallets",
            )}
          </h2>
          <p className='mt-1 text-text-sm text-grayTextPrimary'>
            {t(
              "wallet.payment.mobileWalletDescription",
              "Scan this QR code with your mobile wallet to complete the payment.",
            )}
          </p>
        </div>

        <div className='flex justify-center'>
          <QRCodeSVG value={cardanoUri} size={200} />
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
