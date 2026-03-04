import type { FC } from "react";

import { Modal, Button } from "@vellumlabs/cexplorer-sdk";

import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TourWelcomeModalProps {
  stepNumber: number;
  totalSteps: number;
  titleKey: string;
  descriptionKey: string;
  isLast: boolean;
  onNext: () => void;
  onBack?: () => void;
  onClose: () => void;
}

export const TourWelcomeModal: FC<TourWelcomeModalProps> = ({
  stepNumber,
  totalSteps,
  titleKey,
  descriptionKey,
  isLast,
  onNext,
  onBack,
  onClose,
}) => {
  const { t } = useAppTranslation("common");

  return (
    <Modal maxWidth='480px' onClose={onClose} hideClose>
      <div className='flex flex-col items-center gap-2 p-2 text-center'>
        <span className='text-text-xs text-grayTextPrimary'>
          {stepNumber} / {totalSteps}
        </span>
        <h2 className='text-text-xl font-semibold text-textPrimary'>
          {t(titleKey)}
        </h2>
        <p className='text-text-sm text-grayTextPrimary'>
          {t(descriptionKey)}
        </p>
        <div className='flex w-full items-center justify-between pt-1'>
          {onBack ? (
            <Button
              size='md'
              variant='tertiary'
              label={t("homepage.tour.back")}
              onClick={onBack}
            />
          ) : (
            <Button
              size='md'
              variant='tertiary'
              label={t("homepage.tour.skip")}
              onClick={onClose}
            />
          )}
          <Button
            size='md'
            variant='primary'
            label={isLast ? t("homepage.tour.finish") : t("homepage.tour.next")}
            onClick={isLast ? onClose : onNext}
          />
        </div>
      </div>
    </Modal>
  );
};
