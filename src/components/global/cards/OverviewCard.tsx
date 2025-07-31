import type { FC, ReactNode } from "react";

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
      <div
        className={`flex h-full items-stretch gap-2 pb-4 pt-2 ${startContent ? "flex-wrap justify-center sm:flex-nowrap" : ""}`}
      >
        {startContent}
        <div className={`flex w-full flex-col`}>
          <div className={` ${tBodyClassname ? tBodyClassname : ""}`}>
            <table className={`table w-full ${hFit ? "h-fit" : "h-full"}`}>
              <tbody className={`table h-full w-full`}>
                {overviewList &&
                  overviewList
                    .filter(item => item !== null && item !== undefined)
                    .map(
                      (item, i) =>
                        (typeof item.visible === "undefined" ||
                          item.visible) && (
                          <tr
                            key={`${item?.label}_${item?.value}_${i}`}
                            className='table-row w-full'
                          >
                            {item?.label && (
                              <td
                                className={`table-cell w-1/2 pr-2 text-left text-sm text-grayTextSecondary ${labelClassname ? labelClassname : ""} ${leading ? "leading-[0px]" : "py-2"}`}
                              >
                                {item?.label}
                              </td>
                            )}
                            <td
                              className={`overflow-wrap break-word table-cell text-sm text-grayTextPrimary ${leading ? "leading-[0px]" : "py-2"}`}
                            >
                              {item?.value}
                            </td>
                          </tr>
                        ),
                    )}
              </tbody>
            </table>
          </div>
          {endContent}
        </div>
      </div>
    </div>
  );
};
