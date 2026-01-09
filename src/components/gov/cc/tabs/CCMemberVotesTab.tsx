import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useFetchCCMemberVote } from "@/services/governance";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useGovernanceActionsTableStore } from "@/stores/tables/governanceActionsTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { GovActionCell } from "@/components/gov/GovActionCell";
import type { Vote } from "@/constants/votes";
import { VoteCell } from "@/components/governance/vote/VoteCell";
import { ExternalLink } from "lucide-react";
import { isVoteLate } from "@/utils/governance/isVoteLate";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface CCMemberVoteItem {
  tx?: {
    time?: string;
    hash?: string;
    epoch_no?: number;
  };
  proposal?: {
    type?: string;
    ident?: {
      id?: string;
    };
    anchor?: {
      offchain?: {
        name?: string;
      };
    };
    expired_epoch?: number | null;
    enacted_epoch?: number | null;
    ratified_epoch?: number | null;
  };
  vote?: string;
  anchor?: {
    url: string | null;
    data_hash: string | null;
    offchain: {
      comment: string | null;
      url: string | null;
    };
  };
}

export const CCMemberVotesTab: FC<{ hotKey?: string }> = ({ hotKey }) => {
  const { t } = useAppTranslation();
  const { infiniteScrolling } = useInfiniteScrollingStore();

  const { page } = useSearch({ from: "/gov/cc/$coldKey" });

  const [totalItems, setTotalItems] = useState<number>(0);

  const { columnsVisibility, setColumsOrder, columnsOrder, rows } =
    useGovernanceActionsTableStore();

  const votesQuery = useFetchCCMemberVote(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    undefined,
    hotKey,
    undefined,
  );

  const totalVotes = hotKey ? votesQuery.data?.pages[0].data.count : 0;
  const items = hotKey
    ? votesQuery.data?.pages.flatMap(page => page.data.data)
    : [];

  const columns: TableColumns<CCMemberVoteItem> = [
    {
      key: "date",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        return <DateCell time={item.tx.time} />;
      },
      title: <p>{t("gov.cc.date")}</p>,
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "type",
      render: item => {
        if (!item?.proposal?.type) {
          return "-";
        }

        return (
          <>{<ActionTypes title={item?.proposal?.type as ActionTypes} />}</>
        );
      },
      title: <p>{t("gov.cc.type")}</p>,
      visible: columnsVisibility.type,
      widthPx: 60,
    },
    {
      key: "governance_action_name",
      render: item => {
        const id = item?.proposal?.ident?.id;
        const name =
          item?.proposal?.anchor?.offchain?.name ?? "⚠️ Invalid metadata";

        if (!id) return "-";

        return <GovActionCell id={id} name={name} />;
      },
      title: <p>{t("gov.cc.governanceAction")}</p>,
      visible: columnsVisibility.governance_action_name,
      widthPx: 200,
    },
    {
      key: "vote",
      title: <p>{t("gov.cc.vote")}</p>,
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        return (
          <VoteCell
            vote={item.vote as Vote}
            txHash={item?.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
            isLate={isVoteLate(item as Parameters<typeof isVoteLate>[0])}
            anchorInfo={item?.anchor}
          />
        );
      },
      visible: columnsVisibility.vote,
      widthPx: 60,
    },
    {
      key: "tx",
      render: item => {
        if (item?.tx?.hash) {
          return (
            <Link
              to='/tx/$hash'
              params={{ hash: item.tx.hash }}
              className='flex items-center justify-end text-primary'
            >
              <ExternalLink size={18} />
            </Link>
          );
        }
        return <p className='text-right'>-</p>;
      },
      title: <p className='w-full text-right'>{t("gov.cc.tx")}</p>,
      visible: columnsVisibility.tx,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalVotes && totalVotes !== totalItems) {
      setTotalItems(totalVotes);
    }
  }, [totalVotes, totalItems]);

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={rows}
      scrollable
      query={votesQuery}
      minContentWidth={1200}
      items={items}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as any) -
          columnsOrder.indexOf(b.key as any)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
