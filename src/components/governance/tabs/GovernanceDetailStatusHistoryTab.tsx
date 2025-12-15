import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  GlobalTable,
  GovernanceStatusBadge,
  EpochCell,
  DateCell,
} from "@vellumlabs/cexplorer-sdk";
import { ExternalLink } from "lucide-react";

interface GovernanceDetailStatusHistoryTabProps {
  query: any;
}

interface StatusHistoryRow {
  timestamp: string;
  epoch: number | null;
  status:
    | "submitted"
    | "active"
    | "ratified"
    | "enacted"
    | "expired"
    | "dropped";
  description: string;
  txHash?: string;
}

const getDescription = (status: string) => {
  switch (status) {
    case "submitted":
      return "Governance action submitted to the blockchain.";
    case "active":
      return "Voting period has started. Governance bodies can now vote.";
    case "ratified":
      return "Proposal passed the vote check at the epoch boundary. It will be enacted in the next epoch.";
    case "enacted":
      return "Proposal's changes applied on-chain at the epoch boundary.";
    case "expired":
      return "Voting period has ended without reaching the required threshold.";
    case "dropped":
      return "Proposal withdrawn before the vote check.";
    default:
      return "";
  }
};

export const GovernanceDetailStatusHistoryTab: FC<
  GovernanceDetailStatusHistoryTabProps
> = ({ query }) => {
  const data = query?.data?.data;

  const statusHistory = useMemo(() => {
    if (!data) return [];

    const history: StatusHistoryRow[] = [];

    history.push({
      timestamp: data.tx.time,
      epoch: null,
      status: "active",
      description: getDescription("submitted"),
      txHash: data.tx.hash,
    });

    const epochStatuses: Array<{
      epoch: number | null;
      status: StatusHistoryRow["status"];
    }> = [
      { epoch: data.ratified_epoch, status: "ratified" },
      { epoch: data.enacted_epoch, status: "enacted" },
      { epoch: data.expired_epoch, status: "expired" },
      { epoch: data.dropped_epoch, status: "dropped" },
    ];

    epochStatuses.forEach(({ epoch, status }) => {
      if (epoch !== null) {
        history.push({
          timestamp: data.tx.time,
          epoch,
          status,
          description: getDescription(status),
        });
      }
    });

    return history.reverse();
  }, [data]);

  const columns = [
    {
      key: "timestamp",
      render: (item: StatusHistoryRow) => {
        return <DateCell time={item.timestamp} />;
      },
      title: "Timestamp",
      visible: true,
      widthPx: 120,
    },
    {
      key: "epoch",
      render: (item: StatusHistoryRow) => (
        <EpochCell no={item.epoch ?? undefined} justify='start' />
      ),
      title: "Epoch",
      visible: true,
      widthPx: 90,
    },
    {
      key: "status",
      render: (item: StatusHistoryRow) => {
        let governanceItem: any;
        let currentEpoch: number;

        switch (item.status) {
          case "enacted":
            governanceItem = {
              dropped_epoch: null,
              enacted_epoch: data.enacted_epoch,
              expired_epoch: null,
              ratified_epoch: data.ratified_epoch,
            };
            currentEpoch = item.epoch ?? 0;
            break;

          case "ratified":
            governanceItem = {
              dropped_epoch: null,
              enacted_epoch: null,
              expired_epoch: null,
              ratified_epoch: data.ratified_epoch,
            };
            currentEpoch = item.epoch ?? 0;
            break;

          case "expired":
            governanceItem = {
              dropped_epoch: null,
              enacted_epoch: null,
              expired_epoch: data.expired_epoch,
              ratified_epoch: null,
            };
            currentEpoch = item.epoch ?? 0;
            break;

          case "dropped":
            governanceItem = {
              dropped_epoch: data.dropped_epoch,
              enacted_epoch: null,
              expired_epoch: null,
              ratified_epoch: null,
            };
            currentEpoch = item.epoch ?? 0;
            break;

          default:
            governanceItem = {
              dropped_epoch: null,
              enacted_epoch: null,
              expired_epoch: null,
              ratified_epoch: null,
            };
            currentEpoch = 0;
        }

        return (
          <GovernanceStatusBadge
            item={governanceItem}
            currentEpoch={currentEpoch}
          />
        );
      },
      title: "Status change",
      visible: true,
      widthPx: 120,
    },
    {
      key: "description",
      render: (item: StatusHistoryRow) => {
        return <span className='text-grayTextPrimary'>{item.description}</span>;
      },
      title: "Description",
      visible: true,
      widthPx: 300,
    },
    {
      key: "tx",
      render: (item: StatusHistoryRow) => {
        if (item.txHash) {
          return (
            <Link
              to='/tx/$hash'
              params={{ hash: item.txHash }}
              className='flex items-center justify-end text-primary'
            >
              <ExternalLink size={18} />
            </Link>
          );
        }
        return <p className='text-right'>-</p>;
      },
      title: <p className='w-full text-right'>Tx</p>,
      visible: true,
      widthPx: 90,
    },
  ];

  const mockQuery = useMemo(
    () =>
      ({
        data: {
          pages: [
            {
              data: {
                data: statusHistory,
                count: statusHistory.length,
              },
            },
          ],
        },
        isLoading: query?.isLoading ?? false,
        isFetching: query?.isFetching ?? false,
        isError: query?.isError ?? false,
      }) as any,
    [statusHistory, query],
  );

  if (!data) {
    return null;
  }

  return (
    <GlobalTable
      type='default'
      query={mockQuery}
      items={statusHistory}
      columns={columns}
      rowHeight={67}
      minContentWidth={800}
      scrollable
    />
  );
};
