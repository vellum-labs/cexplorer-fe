type GovActionStatus = "Active" | "Ratified" | "Enacted" | "Expired";

export const getGovActionStatus = (
  item: {
    dropped_epoch: number | null;
    enacted_epoch: number | null;
    expired_epoch: number | null;
    ratified_epoch: number | null;
  },
  epochNo: number = 1,
): GovActionStatus | undefined => {
  const { dropped_epoch, enacted_epoch, expired_epoch, ratified_epoch } = item;

  if (enacted_epoch != null && enacted_epoch <= epochNo) {
    return "Enacted";
  }

  if (
    (expired_epoch != null && expired_epoch <= epochNo) ||
    (dropped_epoch != null && dropped_epoch <= epochNo)
  ) {
    return "Expired";
  }

  if (
    ratified_epoch != null &&
    enacted_epoch != null &&
    enacted_epoch > epochNo
  ) {
    return "Ratified";
  }

  if (
    ratified_epoch == null &&
    enacted_epoch == null &&
    (expired_epoch == null || expired_epoch >= epochNo) &&
    (dropped_epoch == null || dropped_epoch >= epochNo)
  ) {
    return "Active";
  }

  return undefined;
};
