import type { MiscSearch } from "@/types/miscTypes";
import type { FC } from "react";

import DateCell from "@/components/table/DateCell";

import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";

import { useGlobalSearch } from "@/context/GlobalSearchContext";
import { AdaWithTooltip } from "../global/AdaWithTooltip";

interface GlobalSearchCellProps {
  item: MiscSearch;
  formatTitle: boolean;
}

export const GlobalSearchCell: FC<GlobalSearchCellProps> = ({
  item,
  formatTitle,
}) => {
  const { handleInput, handleSearchChange } = useGlobalSearch();
  const { title, ident, category, ...rest } = item;

  const govActionId = rest.url.replace("/gov/action", "");

  const { to, params } = {
    to: {
      pool: "/pool/$id",
      asset: "/asset/$fingerprint",
      tx: "/tx/$hash",
      block: "/block/$hash",
      stake: "/stake/$stakeAddr",
      address: "/address/$address",
      adahandle: "/address/$address",
      policy: "/policy/$policyId",
      drep: "/drep/$hash",
      gov_action_proposal: "/gov/action/" + govActionId.replace("#", "%23"),
      page: rest.url,
      user: rest.url,
      article: rest.url,
    },
    params: {
      drep: {
        hash: ident,
      },
      pool: {
        id: ident,
      },
      asset: {
        fingerprint: ident,
      },
      tx: {
        hash: ident,
      },
      block: {
        hash: ident,
      },
      stake: {
        stakeAddr: ident,
      },
      address: {
        address: ident,
      },
      adahandle: {
        address: ident,
      },
      policy: {
        policyId: ident,
      },
    },
  };

  return (
    <Link to={to[category]} params={params[category]}>
      <div
        className='flex w-full cursor-pointer items-stretch justify-between border-b border-border pb-1/2 pt-1.5 transition-all duration-100 last:border-b-0 hover:bg-cardBg'
        onClick={() => {
          handleInput("blur");
          handleSearchChange("");
        }}
      >
        <div className='flex w-fit max-w-[390px] flex-col break-words text-text-sm text-primary'>
          <span className='font-semibold'>
            {formatTitle ? formatString(title, "long") : title}
          </span>
          <span className='text-text-xs text-grayTextPrimary'>
            {["page", "article"].includes(category)
              ? rest?.url
              : formatString(ident, "long")}
          </span>
        </div>
        {rest.extra.value && rest.extra.type && (
          <div className='flex min-w-[70px] flex-col items-start justify-center text-nowrap text-text'>
            {typeof rest.extra.value === "string" ? (
              <DateCell
                time={rest.extra.value as string}
                className='text-text-xs'
                tabularNums={false}
              />
            ) : (
              <span className='text-text-sm text-text'>
                <AdaWithTooltip data={rest.extra.value} />
              </span>
            )}
            <span className='text-text-sm text-grayTextPrimary'>
              {rest.extra.type[0].toUpperCase() + rest.extra.type.slice(1)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
