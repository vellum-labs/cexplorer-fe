import type { ConstitutionDataItem } from "@/types/governanceTypes";

export type ConstitutionStatus = "current" | "draft" | "past";

export const getConstitutionStatus = (
  item: ConstitutionDataItem,
  allItems: ConstitutionDataItem[],
  currentEpoch: number,
): ConstitutionStatus => {
  const proposal = item.gov_action_proposal;

  // Genesis constitution (no gov_action_proposal)
  if (!proposal) {
    // Current if no other constitution has been enacted that supersedes it
    const hasNewerEnactedConstitution = allItems.some(
      i =>
        i.gov_action_proposal?.enacted_epoch &&
        i.gov_action_proposal.enacted_epoch <= currentEpoch,
    );
    return hasNewerEnactedConstitution ? "past" : "current";
  }

  const enactedEpoch = proposal.enacted_epoch;
  const expiredEpoch = proposal.expired_epoch;

  // Draft: enacted_epoch == null && expired_epoch == null
  if (enactedEpoch === null && expiredEpoch === null) {
    return "draft";
  }

  // Current: enacted_epoch <= current_epoch && (expired_epoch >= current_epoch || expired_epoch is null)
  if (
    enactedEpoch !== null &&
    enactedEpoch <= currentEpoch &&
    (expiredEpoch === null || expiredEpoch >= currentEpoch)
  ) {
    return "current";
  }

  // Past: everything else
  return "past";
};

export const getCurrentConstitution = (
  items: ConstitutionDataItem[],
  currentEpoch: number,
): ConstitutionDataItem | undefined => {
  return items.find(
    item => getConstitutionStatus(item, items, currentEpoch) === "current",
  );
};
