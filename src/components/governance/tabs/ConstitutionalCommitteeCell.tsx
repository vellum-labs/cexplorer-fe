import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import Copy from "../../global/Copy";
import { Image } from "../../global/Image";
import { formatString } from "@/utils/format/format";
import { alphabetWithNumbers } from "@/constants/alphabet";

interface ConstitutionalCommitteeNameCellProps {
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

export const ConstitutionalCommitteeNameCell: FC<
  ConstitutionalCommitteeNameCellProps
> = ({ item }) => {
  const containsLatin = (value: string | undefined) =>
    value
      ? value
          ?.split("")
          .some(char => alphabetWithNumbers.includes(char.toLowerCase()))
      : undefined;

  const fallbackSource = containsLatin(item?.data?.given_name)
    ? item?.data?.given_name
    : item?.hash?.view || "";
  const fallbackletters = (fallbackSource || "")
    .split("")
    .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
    .join("")
    .slice(0, 3);

  const renderFallbackLetter = () => {
    if (!fallbackletters) return "?";
    if (fallbackletters.length === 1) return fallbackletters[0];
    if (fallbackletters.includes("_")) {
      const index = fallbackletters.indexOf("_");
      return fallbackletters[0] + (fallbackletters[index + 1] || "");
    }
    return fallbackletters.slice(0, 2);
  };

  const fallbackColor = `hue-rotate(${
    fallbackletters
      .split("")
      .reduce(
        (acc, curr) => acc + alphabetWithNumbers.indexOf(curr.toLowerCase()),
        0,
      ) * 10
  }deg)`;
  return (
    <div className='relative flex max-h-[75px] w-full items-center gap-2'>
      {item?.data?.image_url ? (
        <Image
          src={item?.data?.image_url}
          type='user'
          className='h-8 w-8 rounded-full'
          height={32}
          width={32}
          fallbackletters={fallbackletters}
        />
      ) : (
        <div
          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[18px] font-bold uppercase text-background'
          style={{ filter: fallbackColor }}
        >
          {renderFallbackLetter()}
        </div>
      )}

      <div className={`flex w-[calc(100%-40px)] flex-col`}>
        {item?.data?.given_name && (
          <Link
            to='/gov/cc/$coldKey'
            params={{ coldKey: item?.hash?.view }}
            className='w-fit text-primary'
          >
            {item?.data?.given_name}
          </Link>
        )}
        <div className='flex items-center gap-1'>
          <Link
            to='/gov/cc/$coldKey'
            params={{ coldKey: item?.hash?.view }}
            className={
              item?.data?.given_name
                ? "text-xs hover:text-grayTextPrimary"
                : "text-sm text-primary"
            }
            disabled={!!item?.data?.given_name}
          >
            {formatString(item?.hash?.view ?? "", "long")}
          </Link>
          <Copy copyText={item?.hash?.view ?? ""} size={item?.data ? 10 : 13} />
        </div>
      </div>
    </div>
  );
};
