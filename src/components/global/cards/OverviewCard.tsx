import type { FC, ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "../../ui/tooltip";

type OverviewListItem =
  | {
      label: ReactNode;
      value: ReactNode;
      visible?: boolean;
    }
  | null
  | undefined;

export type OverviewList = OverviewListItem[];

interface BlockDetailOverviewProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  overviewList?: OverviewList;
  labelClassname?: string;
  tBodyClassname?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
  leading?: boolean;
  hFit?: boolean;
  showTitleDivider?: boolean;
  showContentDivider?: boolean;
  threshold?: number;
  voterType?: "drep" | "spo";
  columnGap?: string;
}

export const OverviewCard: FC<BlockDetailOverviewProps> = ({
  title,
  subTitle,
  overviewList,
  labelClassname = "",
  startContent,
  endContent,
  className,
  tBodyClassname,
  hFit = false,
  leading = false,
  showTitleDivider = false,
  showContentDivider = false,
  threshold,
  voterType = "drep",
  columnGap = "48px",
}) => {
  return (
    <div
      className={`min-h-[227px] w-full flex-1 grow basis-[450px] rounded-xl border border-border bg-cardBg px-4 py-4 shadow lg:basis-[400px] ${className}`}
    >
      <div
        className={`flex w-full justify-between ${
          overviewList?.length ? "" : "items-center"
        }`}
      >
        <h2 className='text-base'>{title}</h2>
        <span>{subTitle}</span>
      </div>
      {showTitleDivider && (
        <div className='mb-2 mt-3 w-full border-t border-border'></div>
      )}
      <div
        className={`flex h-full items-stretch gap-2 pb-4 ${showTitleDivider ? "pt-0" : "pt-2"} ${startContent ? "flex-wrap justify-center sm:flex-nowrap" : ""}`}
      >
        {startContent}
        <div className={`flex w-full flex-col`}>
          <div className={`${tBodyClassname ? tBodyClassname : ""}`}>
            <div
              className={`grid w-full ${hFit ? "h-fit" : "h-full"}`}
              style={{
                gridTemplateColumns: "max-content 1fr",
                columnGap: columnGap,
                rowGap: "8px",
              }}
            >
              {overviewList &&
                overviewList
                  .filter(item => item !== null && item !== undefined)
                  .map(
                    (item, i) =>
                      (typeof item.visible === "undefined" || item.visible) && (
                        <>
                          {item?.label && (
                            <div
                              key={`${item?.label}_${i}_label`}
                              className={`flex items-center text-left text-sm text-grayTextSecondary ${labelClassname ? labelClassname : ""} ${leading ? "leading-[0px]" : "py-1"}`}
                            >
                              {item?.label}
                            </div>
                          )}
                          <div
                            key={`${item?.label}_${i}_value`}
                            className={`overflow-hidden break-words text-sm text-grayTextPrimary ${leading ? "leading-[0px]" : "py-1"}`}
                          >
                            {item?.value}
                          </div>
                        </>
                      ),
                  )}
            </div>
          </div>
          {showContentDivider && endContent && (
            <div className='mt-2 w-full border-t border-border'></div>
          )}
          {threshold && (
            <div className='flex w-full items-center justify-between pt-2'>
              <Tooltip
                content={
                  <div className='flex flex-col'>
                    <span>Approval threshold of this</span>
                    <span>
                      governance action type for{" "}
                      {voterType === "drep" ? "DReps" : "SPOs"}
                    </span>
                  </div>
                }
              >
                <div className='flex items-center gap-[2px]'>
                  <CircleHelp size={11} className='text-grayTextPrimary' />
                  <span className='text-xs font-medium text-grayTextPrimary'>
                    Threshold:
                  </span>
                </div>
              </Tooltip>
              <span className='text-xs font-medium text-grayTextPrimary'>
                {(threshold * 100).toFixed(2)}%
              </span>
            </div>
          )}
          {endContent}
        </div>
      </div>
    </div>
  );
};
