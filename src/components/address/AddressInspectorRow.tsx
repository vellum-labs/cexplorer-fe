import type { FC, ReactNode } from "react";

import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";

interface AddressInspectorRowProps {
  title: string;
  value: ReactNode;
  darker?: boolean;
  titleStart?: boolean;
  isLoading: boolean;
}

export const AddressInspectorRow: FC<AddressInspectorRowProps> = ({
  title,
  darker = false,
  value,
  isLoading,
  titleStart,
}) => {
  return (
    <div
      className={`flex w-full ${titleStart ? "items-start" : "items-center"} ${darker ? "bg-darker" : ""} flex-col sm:flex-row`}
    >
      <div
        className={`flex w-full items-center sm:w-[200px] sm:max-w-[200px] sm:flex-grow ${darker ? "bg-darker" : ""}`}
        style={{
          minHeight: "64px",
        }}
      >
        <div
          className={`flex h-full w-full ${titleStart ? "items-start py-1.5" : "items-center"} gap-1/2 px-1.5 sm:px-6`}
        >
          <span className='text-text-sm font-medium text-grayTextPrimary'>
            {" "}
            {title}
          </span>
        </div>
      </div>
      <div
        className={`flex w-full items-center text-text-sm font-medium sm:min-w-[140px] sm:flex-1 ${darker ? "bg-darker" : ""} overflow-hidden`}
        style={{
          minHeight: "64px",
        }}
      >
        <div className='w-full overflow-hidden'>
          {isLoading ? <LoadingSkeleton height='20px' width='95%' /> : value}
        </div>
      </div>
    </div>
  );
};
