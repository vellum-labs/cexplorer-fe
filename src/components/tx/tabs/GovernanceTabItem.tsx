import { ActionTypes } from "@/components/global/ActionTypes";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { VoterRoleBadge } from "@/components/global/badges/VoterRoleBadge";
import { VoteBadge } from "@/components/global/badges/VoteBadge";
import { Vote } from "@/constants/votes";
import { GovActionCell } from "@/components/gov/GovActionCell";
import { GovVoterCell } from "@/components/gov/GovVoterCell";
import GlobalTable from "@/components/table/GlobalTable";
import { useFetchTxDetail } from "@/services/tx";
import type { TableColumns } from "@/types/tableTypes";
import type { TxDetailData } from "@/types/txTypes";
import { getRouteApi, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const GovernanceTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const governance = query.data?.data.governance?.voting_procedure;

  const columns: TableColumns<
    NonNullable<TxDetailData["governance"]>["voting_procedure"][number]
  > = [
    {
      key: "role",
      render: item => <VoterRoleBadge role={item.voter_role} />,
      title: "Voter role",
      visible: true,
      widthPx: 50,
    },
    {
      key: "voter",
      render: item => <GovVoterCell role={item.voter_role} info={item.info} />,
      title: "Voter",
      visible: true,
      widthPx: 160,
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
      visible: true,
      widthPx: 200,
    },
    {
      key: "vote",
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        return (
          <div className='flex items-center gap-2'>
            {hash && (
              <Link
                to='/gov/vote/$hash'
                params={{ hash }}
                className='text-muted-foreground text-primary'
                title='Open vote detail'
              >
                <FileText size={16} />
              </Link>
            )}

            <VoteBadge vote={item.vote as Vote} />
          </div>
        );
      },
      title: <p>Vote</p>,
      visible: true,
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
      visible: true,
      widthPx: 40,
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
        minContentWidth={1000}
        disableDrag
      />
    </div>
  );
};
