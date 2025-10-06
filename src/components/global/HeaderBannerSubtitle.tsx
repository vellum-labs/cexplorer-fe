import type { FC } from "react";

import Copy from "./Copy";

interface BlockDetailSubTitleProps {
  hash: string | undefined;
  hashString: string | undefined;
  title?: string;
  className?: string;
}

export const HeaderBannerSubtitle: FC<BlockDetailSubTitleProps> = ({
  hashString,
  hash,
  title,
  className,
}) => {
  return (
    <div className={`mb-3 mt-1 flex items-center gap-1.5 ${className}`}>
      <span className='text-grayTextPrimary'>
        {title ?? "Hash"}: {hashString}
      </span>
      <Copy size={13} copyText={hash ?? ""} />
    </div>
  );
};
