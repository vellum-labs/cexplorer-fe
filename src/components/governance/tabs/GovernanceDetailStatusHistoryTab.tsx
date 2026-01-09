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
import { useAppTranslation } from "@/hooks/useAppTranslation";

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

export const GovernanceDetailStatusHistoryTab: FC<
  GovernanceDetailStatusHistoryTabProps
> = ({ query }) => {
  const { t } = useAppTranslation();
  const data = query?.data?.data;

  const getDescription = (status: string) => {
    switch (status) {
      case "submitted":
        return t("governance.statusHistory.submitted");
      case "active":
        return t("governance.statusHistory.active");
      case "ratified":
        return t("governance.statusHistory.ratified");
      case "enacted":
        return t("governance.statusHistory.enacted");
      case "expired":
        return t("governance.statusHistory.expired");
      case "dropped":
        return t("governance.statusHistory.dropped");
      default:
        return "";
    }
  };

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
      title: t("governance.statusHistory.timestamp"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "epoch",
      render: (item: StatusHistoryRow) => (
        <EpochCell no={item.epoch ?? undefined} justify='start' />
      ),
      title: t("governance.statusHistory.epoch"),
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
      title: t("governance.statusHistory.statusChange"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "description",
      render: (item: StatusHistoryRow) => {
        return <span className='text-grayTextPrimary'>{item.description}</span>;
      },
      title: t("governance.statusHistory.description"),
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
      title: <p className='w-full text-right'>{t("governance.statusHistory.tx")}</p>,
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
