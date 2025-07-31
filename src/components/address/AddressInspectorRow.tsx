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
      className={`flex w-full ${titleStart ? "items-start" : "items-center"} ${darker ? "bg-darker" : ""}`}
    >
      <div
        className={`flex min-w-[200px] max-w-[200px] flex-grow items-center ${darker ? "bg-darker" : ""}`}
        style={{
          minHeight: "64px",
          height: "64px",
        }}
      >
        <div
          className={`flex h-full w-full ${titleStart ? "items-start py-3" : "items-center"} gap-1 px-6`}
        >
          <span className='text-sm font-medium text-grayTextPrimary'>
            {" "}
            {title}
          </span>
        </div>
      </div>
      <div
        className={`flex min-w-[140px] flex-1 items-center text-sm font-medium ${darker ? "bg-darker" : ""}`}
        style={{
          minHeight: "64px",
        }}
      >
        {isLoading ? <LoadingSkeleton height='20px' width='95%' /> : value}
      </div>
    </div>
  );
};
