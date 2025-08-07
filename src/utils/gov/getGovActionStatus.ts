import type { GovernanceActionDetail } from "@/types/governanceTypes";

export type GovActionStatus = "Active" | "Ratified" | "Enacted" | "Expired";

export type GovernanceEpochs = Pick<
  GovernanceActionDetail,
  'dropped_epoch' | 'enacted_epoch' | 'expired_epoch' | 'ratified_epoch'
>;

export const getGovActionStatus = (
  item: GovernanceEpochs,
  currentEpoch: number,
): GovActionStatus => {
  const { dropped_epoch, enacted_epoch, expired_epoch, ratified_epoch } = item;

  // Enacted: action has been enacted and current epoch >= enacted epoch
  if (enacted_epoch != null && enacted_epoch <= currentEpoch) {
    return "Enacted";
  }

  // Expired: action expired naturally OR was dropped
  if (
    (expired_epoch != null && expired_epoch <= currentEpoch) ||
    (dropped_epoch != null && dropped_epoch <= currentEpoch)
  ) {
    return "Expired";
  }

  // Ratified: action is ratified but not yet enacted (enacted_epoch is null or future)
  if (
    ratified_epoch != null &&
    (enacted_epoch == null || enacted_epoch > currentEpoch)
  ) {
    return "Ratified";
  }

  // Active: default state - not ratified, not enacted, not expired/dropped
  return "Active";
};
