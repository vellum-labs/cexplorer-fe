import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Image } from "../global/Image";
import { formatString } from "@/utils/format/format";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { generateImageUrl } from "@/utils/generateImageUrl";

interface DrepNameCellProps {
  item?: {
    data?: {
      given_name?: string;
      image_url?: string;
    };
    hash?: {
      view?: string;
    };
  };
}

export const DrepNameCell: FC<DrepNameCellProps> = ({ item }) => {
  const containsLatin = (value: string | undefined) =>
    value
      ? String(value)
          ?.split("")
          .some(char => alphabetWithNumbers.includes(char.toLowerCase()))
      : undefined;

  const fallbackSource = containsLatin(item?.data?.given_name)
    ? item?.data?.given_name
    : item?.hash?.view || "";
  const fallbackletters = String(fallbackSource)
    .split("")
    .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
    .join("")
    .slice(0, 3);

  return (
    <div className='relative flex max-h-[75px] w-full items-center gap-1'>
      <Image
        src={generateImageUrl(item?.hash?.view ?? "", "ico", "drep")}
        type='user'
        className='h-8 w-8 rounded-max'
        height={32}
        width={32}
        fallbackletters={fallbackletters}
      />

      <div className={`flex w-[calc(100%-40px)] flex-col text-text-sm`}>
        {item?.data?.given_name && (
          <Link
            to='/drep/$hash'
            params={{ hash: item?.hash?.view ?? "" }}
            className='w-fit text-primary'
          >
            {item?.data?.given_name.length > 50
              ? `${item?.data?.given_name.slice(0, 50)}...`
              : item?.data?.given_name}
          </Link>
        )}
        <div className='flex items-center gap-1/2'>
          <Link
            to='/drep/$hash'
            params={{ hash: item?.hash?.view ?? "" }}
            className={
              item?.data?.given_name
                ? "text-text-xs hover:text-grayTextPrimary"
                : "text-text-sm text-primary"
            }
            disabled={!!item?.data?.given_name}
          >
            {formatString(item?.hash?.view ?? "", "long")}
          </Link>
          <Copy copyText={item?.hash?.view} size={item?.data ? 10 : 13} />
        </div>
      </div>
    </div>
  );
};
