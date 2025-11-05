import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { VoterRoleBadge } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { GovActionCell } from "@/components/gov/GovActionCell";
import { VoteCell } from "@/components/governance/vote/VoteCell";
import { GovVoterCell } from "@/components/gov/GovVoterCell";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetail } from "@/services/tx";
import type { TableColumns } from "@/types/tableTypes";
import type { TxDetailData } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";
import type { AnchorInfo } from "@/types/governanceTypes";
import { isVoteLate } from "@/utils/governance/isVoteLate";

export const GovernanceTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const governance = query.data?.data.governance?.voting_procedure;
  const txEpochNo = query.data?.data.block?.epoch_no;

  console.log("governance", governance);

  const columns: TableColumns<
    NonNullable<TxDetailData["governance"]>["voting_procedure"][number]
  > = [
    {
      key: "role",
      render: item => <VoterRoleBadge role={item.voter_role} />,
      title: "Voter role",
      visible: true,
      widthPx: 120,
    },
    {
      key: "voter",
      render: item => <GovVoterCell role={item.voter_role} info={item.info} />,
      title: "Voter",
      visible: true,
      widthPx: 200,
    },
    {
      key: "type",
      render: item => {
        if (!item?.proposal?.type) {
          return "-";
        }

        return <ActionTypes title={item?.proposal?.type as ActionTypes} />;
      },
      title: <p>Type</p>,
      visible: true,
      widthPx: 150,
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
      visible: true,
      widthPx: 300,
    },
    {
      key: "vote",
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        // Transform proposal anchor to AnchorInfo format
        const anchorInfo: AnchorInfo | undefined = item?.proposal?.anchor
          ? {
              url: item.proposal.anchor.url || null,
              data_hash: item.proposal.anchor.data_hash || null,
              offchain: {
                comment: null,
                url: item.proposal.anchor.url || null,
              },
            }
          : undefined;

        // Check if vote is late using the existing isVoteLate utility
        const isLate =
          txEpochNo && item?.proposal
            ? isVoteLate({
                tx: { epoch_no: txEpochNo },
                proposal: {
                  expired_epoch: item.proposal.expired_epoch,
                  enacted_epoch: item.proposal.enacted_epoch,
                  ratified_epoch: item.proposal.ratified_epoch,
                },
              })
            : false;

        return (
          <VoteCell
            vote={item.vote as Vote}
            txHash={hash}
            proposalId={item?.proposal?.ident?.id}
            anchorInfo={anchorInfo}
            isLate={isLate}
          />
        );
      },
      title: <p>Vote</p>,
      visible: true,
      widthPx: 100,
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
      visible: true,
      widthPx: 130,
    },
  ];

  return (
    <div>
      <GlobalTable
        type='default'
        items={governance}
        columns={columns}
        query={query}
        scrollable
        totalItems={governance?.length}
        itemsPerPage={20}
        minContentWidth={1150}
        disableDrag
      />
    </div>
  );
};
