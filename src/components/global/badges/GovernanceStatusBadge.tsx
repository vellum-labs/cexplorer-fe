import type { FC } from "react";
import PulseDot from "../PulseDot";
import { 
  getGovActionStatus, 
  type GovActionStatus,
  type GovernanceEpochs 
} from "@/utils/gov/getGovActionStatus";

interface GovernanceStatusBadgeProps {
  item: GovernanceEpochs;
  currentEpoch: number;
}

const getStatusColor = (status: GovActionStatus): string => {
  switch (status) {
    case "Active":
      return "#17B26A"; // Green - In progress/voting
    case "Ratified":
      return "#00A9E3"; // Blue - Approved, waiting for enactment
    case "Enacted":
      return "#079455"; // Dark Green - Successfully completed
    case "Expired":
      return "#F79009"; // Orange - Failed/expired
    default:
      return "#17B26A"; // Default to Active color
  }
};

export const GovernanceStatusBadge: FC<GovernanceStatusBadgeProps> = ({
  item,
  currentEpoch,
}) => {
  const status = getGovActionStatus(item, currentEpoch);
  const statusColor = getStatusColor(status);

  return (
    <div className='relative flex h-[24px] w-fit items-center justify-end gap-2 rounded-lg border border-border px-[10px]'>
      <PulseDot color={statusColor} animate={status === "Active"} />
      <span className='text-xs font-medium'>{status}</span>
    </div>
  );
};