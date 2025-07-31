import type { MiscConstResponseData } from "@/types/miscTypes";

export const poolRewardsRoaDiff = (
  roa: number,
  miscConst: MiscConstResponseData | undefined,
): "green" | "orange" | "red" => {
  if (!miscConst) {
    return "red";
  }

  const pctMember = miscConst.epoch_stat[0]?.pool_stat?.pct_member ?? 0;

  switch (true) {
    case roa - pctMember >= 0.7:
      return "green";
    case roa - pctMember >= 0.4:
      return "orange";
    default:
      return "red";
  }
};
