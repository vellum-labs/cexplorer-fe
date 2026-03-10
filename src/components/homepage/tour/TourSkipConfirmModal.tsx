import type { FC } from "react";

import { Modal, Button } from "@vellumlabs/cexplorer-sdk";

import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TourSkipConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const TourSkipConfirmModal: FC<TourSkipConfirmModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { t } = useAppTranslation("common");

  return (
    <Modal maxWidth='400px' onClose={onCancel} hideClose>
      <div className='flex flex-col items-center gap-2 p-2 text-center'>
        <h2 className='text-text-lg font-semibold text-textPrimary'>
          {t("homepage.tour.skipConfirm.title")}
        </h2>
        <p className='text-text-sm text-grayTextPrimary'>
          {t("homepage.tour.skipConfirm.description")}
        </p>
        <div className='flex w-full items-center justify-between pt-1'>
          <Button
            size='md'
            variant='tertiary'
            label={t("homepage.tour.skipConfirm.resume")}
            onClick={onCancel}
          />
          <Button
            size='md'
            variant='primary'
            label={t("homepage.tour.skipConfirm.confirm")}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};
