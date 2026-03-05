import { type FC, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { getTourSteps } from "@/constants/tourStepDefinitions";
import { TourSpotlight } from "./TourSpotlight";
import { TourTooltip } from "./TourTooltip";
import { TourWelcomeModal } from "./TourWelcomeModal";
import { TourSkipConfirmModal } from "./TourSkipConfirmModal";

const STORAGE_KEY = "onboarding_tour_completed";

export const OnboardingTour: FC = () => {
  const [steps, setSteps] = useState(() => getTourSteps());
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (completed !== "true") {
      setIsActive(true);
    }

    const handleRestart = () => {
      setSteps(getTourSteps());
      setCurrentStep(1);
      setTargetRect(null);
      setShowSkipConfirm(false);
      setIsActive(true);
    };

    window.addEventListener("restart-onboarding-tour", handleRestart);
    return () => {
      window.removeEventListener("restart-onboarding-tour", handleRestart);
    };
  }, []);

  const closeTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const findTargetElement = useCallback((target: string | null): Element | null => {
    if (!target) return null;
    const el = document.querySelector(`[data-tour-step="${target}"]`);
    if (el) return el;
    if (target === "search-bar") {
      return document.querySelector("search");
    }
    return null;
  }, []);

  const updateRect = useCallback((target: string | null) => {
    if (!target) {
      setTargetRect(null);
      return;
    }

    const el = findTargetElement(target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [findTargetElement]);

  const navigateToStep = useCallback(
    (stepNumber: number) => {
      if (stepNumber < 1 || stepNumber > totalSteps) {
        closeTour();
        return;
      }

      const step = steps[stepNumber - 1];

      if (!step.target) {
        setTargetRect(null);
        setCurrentStep(stepNumber);
        return;
      }

      requestAnimationFrame(() => {
        const el = findTargetElement(step.target);
        if (!el) {
          const direction = stepNumber > currentStep ? 1 : -1;
          const nextStep = stepNumber + direction;
          if (nextStep >= 1 && nextStep <= totalSteps) {
            navigateToStep(nextStep);
          } else {
            closeTour();
          }
          return;
        }

        el.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          updateRect(step.target);
          setCurrentStep(stepNumber);
        }, 350);
      });
    },
    [closeTour, currentStep, findTargetElement, steps, totalSteps, updateRect],
  );

  useEffect(() => {
    if (!isActive) return;

    const step = steps[currentStep - 1];
    if (!step?.target) return;

    const handleUpdate = () => updateRect(step.target);

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isActive, currentStep, steps, updateRect]);

  if (!isActive) return null;

  const step = steps[currentStep - 1];
  const isCenterModal = step.target === null;
  const isLastStep = currentStep === totalSteps;

  const requestSkip = () => setShowSkipConfirm(true);

  const handleNext = () => {
    if (isLastStep) {
      closeTour();
    } else {
      navigateToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  if (showSkipConfirm) {
    return createPortal(
      <TourSkipConfirmModal
        onConfirm={closeTour}
        onCancel={() => setShowSkipConfirm(false)}
      />,
      document.body,
    );
  }

  return createPortal(
    <>
      {isCenterModal ? (
        <TourWelcomeModal
          stepNumber={currentStep}
          totalSteps={totalSteps}
          titleKey={step.titleKey}
          descriptionKey={step.descriptionKey}
          isLast={isLastStep}
          onNext={handleNext}
          onBack={currentStep > 1 ? handleBack : undefined}
          onClose={requestSkip}
        />
      ) : (
        targetRect && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99997,
              }}
              onClick={e => e.stopPropagation()}
            />
            <TourSpotlight rect={targetRect} />
            <TourTooltip
              rect={targetRect}
              stepNumber={currentStep}
              totalSteps={totalSteps}
              titleKey={step.titleKey}
              descriptionKey={step.descriptionKey}
              tooltipPosition={step.tooltipPosition}
              onNext={handleNext}
              onBack={handleBack}
              onClose={requestSkip}
            />
          </>
        )
      )}
    </>,
    document.body,
  );
};
