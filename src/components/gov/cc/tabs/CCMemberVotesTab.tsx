import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useFetchCCMemberVote } from "@/services/governance";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useGovernanceActionsTableStore } from "@/stores/tables/governanceActionsTableStore";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { GovActionCell } from "@/components/gov/GovActionCell";
import { HashCell } from "@/components/tx/HashCell";
import type { Vote } from "@/constants/votes";
import { VoteCell } from "@/components/governance/vote/VoteCell";

interface CCMemberVoteItem {
  tx?: {
    time?: string;
    hash?: string;
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
  };
  vote?: string;
}

export const CCMemberVotesTab: FC<{ hotKey?: string }> = ({ hotKey }) => {
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

  const totalVotes = votesQuery.data?.pages[0].data.count;
  const items = votesQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<CCMemberVoteItem> = [
    {
      key: "date",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        return <DateCell time={item.tx.time} />;
      },
      title: <p>Date</p>,
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
      title: <p>Type</p>,
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
      title: <p>Governance action</p>,
      visible: columnsVisibility.governance_action_name,
      widthPx: 200,
    },
    {
      key: "vote",
      title: <p>Vote</p>,
      render: item => {
        if (!item?.vote) {
          return "-";
        }
        return (
          <VoteCell
            vote={item.vote as Vote}
            txHash={item?.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
          />
        );
      },
      visible: columnsVisibility.vote,
      widthPx: 60,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return <HashCell hash={item?.tx?.hash} />;
      },
      title: <p>Tx</p>,
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
