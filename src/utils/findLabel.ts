import type {
  MiscConstResponseData,
  MiscConstResponseDataLabel,
} from "@/types/miscTypes";

export const findLabel = (
  type: "metadatum" | "sc",
  key: number | string | undefined,
  miscConst: MiscConstResponseData | undefined,
): string | undefined => {
  if (!miscConst?.labels || !Array.isArray(miscConst.labels) || !key) {
    return undefined;
  }

  let labelWrapper: MiscConstResponseDataLabel | undefined = undefined;

  if (type === "metadatum") {
    labelWrapper = miscConst.labels.find(
      item => item.type === type && String(item.name) === String(key),
    );
  } else {
    labelWrapper = miscConst.labels.find(
      item => item.type === type && item.data?.scriptHash === key,
    );
  }

  return labelWrapper ? labelWrapper.label : undefined;
};
