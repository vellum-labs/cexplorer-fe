import type { GovernanceVote } from "@/types/governanceTypes";

export function isVoteLate(vote: GovernanceVote): boolean {
  const voteEpoch = vote?.tx?.epoch_no;

  if (voteEpoch === undefined || voteEpoch === null) {
    return false;
  }

  const { expired_epoch, enacted_epoch, ratified_epoch } = vote?.proposal ?? {};

  const closingEpochs: number[] = [];

  if (expired_epoch !== null && expired_epoch !== undefined) {
    closingEpochs.push(expired_epoch);
  }

  if (enacted_epoch !== null && enacted_epoch !== undefined) {
    closingEpochs.push(enacted_epoch);
  }

  if (ratified_epoch !== null && ratified_epoch !== undefined) {
    closingEpochs.push(ratified_epoch);
  }

  if (closingEpochs.length === 0) {
    return false;
  }

  const minClosingEpoch = Math.min(...closingEpochs);

  return voteEpoch > minClosingEpoch;
}
