import type { FC } from "react";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface LoadingProps {
  className?: string;
}

export const Loading: FC<LoadingProps> = ({ className }) => {
  const { theme } = useThemeStore();

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div
        className={`flex h-[150px] w-full items-center justify-center ${className ? className : ""}`}
      >
        <div
          className={`loader h-[60px] w-[60px] border-[4px] ${
            theme === "light"
              ? "border-[#F2F4F7] border-t-darkBlue"
              : "border-[#475467] border-t-[#5EDFFA]"
          } border-t-[4px]`}
        ></div>
      </div>
    </div>
  );
};
