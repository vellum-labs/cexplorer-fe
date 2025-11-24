import type { FC, ReactNode } from "react";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface BannerProps {
  description: ReactNode;
}

export const Banner: FC<BannerProps> = ({ description }) => {
  const { theme } = useThemeStore();

  const lightTheme = theme === "light";

  return (
    <div
      className={`my-2 flex w-full flex-wrap justify-center gap-1 rounded-l border px-4 py-3 text-center text-text-sm ${lightTheme ? "border-brand-200 bg-brand-50 text-gray-700" : "border-brand-700 bg-brand-950 text-white"}`}
    >
      <span>{description}</span>
      <span>
        Follow our{" "}
        <a
          href='https://twitter.com/cexplorer_io'
          target='_blank'
          rel='noreferrer noopener'
          className='font-medium text-brand-500 hover:underline'
        >
          X profile
        </a>{" "}
        for updates.
      </span>
    </div>
  );
};
