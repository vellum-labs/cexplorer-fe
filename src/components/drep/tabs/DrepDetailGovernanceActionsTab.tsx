import type { DrepVoteItem } from "@/types/drepTypes";
import type {
  GovernanceActionsTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";

import { useFetchDrepVote } from "@/services/drep";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useGovernanceActionsTableStore } from "@/stores/tables/governanceActionsTableStore";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { GovActionCell } from "@/components/gov/GovActionCell";
import { HashCell } from "@/components/tx/HashCell";
import type { Vote } from "@/constants/votes";
import { VoteCell } from "@/components/governance/vote/VoteCell";

export const DrepDetailGovernanceActionsTab: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const route = getRouteApi("/drep/$hash");
  const { hash } = route.useParams();

  const { page } = useSearch({ from: "/drep/$hash" });

  const [totalItems, setTotalItems] = useState<number>(0);

  const { columnsVisibility, setColumsOrder, columnsOrder, rows } =
    useGovernanceActionsTableStore();

  const governanceActionsQuery = useFetchDrepVote(
    "DRep",
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    hash,
  );

  const totalActions = governanceActionsQuery.data?.pages[0].data.count;
  const items = governanceActionsQuery.data?.pages.flatMap(
    page => page.data.data,
  );

  const columns: TableColumns<DrepVoteItem> = [
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
      key: "voting_power",
      render: item => (
        <p className='text-right'>
          {item.info.power === null ? (
            "N/A"
          ) : (
            <AdaWithTooltip data={item.info.power?.stake || 0} />
          )}
        </p>
      ),
      title: <p className='w-full text-right'>Voting Power</p>,
      visible: columnsVisibility.voting_power,
      widthPx: 40,
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
    if (totalActions && totalActions !== totalItems) {
      setTotalItems(totalActions);
    }
  }, [totalActions, totalItems]);

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={rows}
      scrollable
      query={governanceActionsQuery}
      minContentWidth={1200}
      items={items}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof GovernanceActionsTableColumns) -
          columnsOrder.indexOf(b.key as keyof GovernanceActionsTableColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
