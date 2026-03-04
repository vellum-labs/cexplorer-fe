import { type FC, useLayoutEffect, useRef, useState } from "react";

import { X } from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";

import type { TooltipPosition } from "./TourStepDefinitions";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TourTooltipProps {
  rect: DOMRect;
  stepNumber: number;
  totalSteps: number;
  titleKey: string;
  descriptionKey: string;
  tooltipPosition: TooltipPosition;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const TourTooltip: FC<TourTooltipProps> = ({
  rect,
  stepNumber,
  totalSteps,
  titleKey,
  descriptionKey,
  tooltipPosition,
  onNext,
  onBack,
  onClose,
}) => {
  const { t } = useAppTranslation("common");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const isFirst = stepNumber === 1;
  const isLast = stepNumber === totalSteps;

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 12;
    const spotlightPadding = 6;
    let top = 0;
    let left = 0;

    switch (tooltipPosition) {
      case "below":
        top = rect.bottom + spotlightPadding + padding;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "above":
        top = rect.top - spotlightPadding - padding - tooltipRect.height;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - spotlightPadding - padding - tooltipRect.width;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + spotlightPadding + padding;
        break;
    }

    const viewportPadding = 16;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding));
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipRect.height - viewportPadding));

    setPosition({ top, left });
  }, [rect, tooltipPosition]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 99999,
        transition: "top 0.3s ease, left 0.3s ease",
      }}
      className='w-[320px] rounded-m border border-border bg-background p-2 shadow-lg'
    >
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-text-xs text-grayTextPrimary'>
          {stepNumber} / {totalSteps}
        </span>
        <X
          size={16}
          className='cursor-pointer text-grayTextPrimary hover:text-textPrimary'
          onClick={onClose}
        />
      </div>
      <h3 className='mb-0.5 text-text-md font-semibold text-textPrimary'>
        {t(titleKey)}
      </h3>
      <p className='mb-2 text-text-sm text-grayTextPrimary'>
        {t(descriptionKey)}
      </p>
      <div className='flex items-center justify-between'>
        <div>
          {!isFirst && (
            <Button
              size='md'
              variant='tertiary'
              label={t("homepage.tour.back")}
              onClick={onBack}
            />
          )}
        </div>
        <Button
          size='md'
          variant='primary'
          label={isLast ? t("homepage.tour.finish") : t("homepage.tour.next")}
          onClick={isLast ? onClose : onNext}
        />
      </div>
    </div>
  );
};
