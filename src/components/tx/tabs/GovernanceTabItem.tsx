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
import { isVoteLate } from "@/utils/governance/isVoteLate";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const GovernanceTabItem = () => {
  const { t } = useAppTranslation("common");
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const governance = query.data?.data.governance?.voting_procedure;
  const txEpochNo = query.data?.data.block?.epoch_no;

  const columns: TableColumns<
    NonNullable<TxDetailData["governance"]>["voting_procedure"][number]
  > = [
    {
      key: "role",
      render: item => <VoterRoleBadge role={item.voter_role} />,
      title: t("tx.columns.voterRole"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "voter",
      render: item => <GovVoterCell role={item.voter_role} info={item.info} />,
      title: t("tx.columns.voter"),
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
      title: <p>{t("tx.columns.type")}</p>,
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
      title: <p>{t("tx.columns.governanceAction")}</p>,
      visible: true,
      widthPx: 300,
    },
    {
      key: "vote",
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        return (
          <VoteCell
            vote={item.vote as Vote}
            txHash={hash}
            proposalId={item?.proposal?.ident?.id}
            anchorInfo={item?.anchor}
            isLate={isVoteLate({
              tx: { epoch_no: txEpochNo ?? 0 },
              proposal: item.proposal,
            })}
          />
        );
      },
      title: <p>{t("tx.columns.vote")}</p>,
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
      title: <p className='w-full text-right'>{t("tx.columns.votingPower")}</p>,
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
