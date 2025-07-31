import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import PulseDot from "./PulseDot";

interface Props {
  protNo: number;
}

export const ProtocolDot = ({ protNo }: Props) => {
  const { data: basicData } = useFetchMiscBasic();
  const miscData = useMiscConst(basicData?.data.version.const);
  const isDaily = Array.isArray(miscData?.epoch_stat?.daily);

  const versionCount = isDaily
    ? miscData?.epoch_stat?.daily[0]?.stat.block_version.length
    : 0;
  const countSum = isDaily
    ? miscData?.epoch_stat?.daily[0]?.stat.block_version.reduce(
        (acc, curr) => acc + curr.count,
        0,
      ) || 0
    : 0;
  const highestVersion = isDaily
    ? miscData?.epoch_stat?.daily[0]?.stat.block_version.reduce(
        (acc, curr) => Math.max(acc, curr.version),
        0,
      ) || 0
    : 0;
  const isAnyCountMajor = isDaily
    ? miscData?.epoch_stat?.daily[0]?.stat.block_version.some(
        item => item.count / countSum >= 0.95,
      )
    : false;

  const returnColor = () => {
    if (protNo >= highestVersion) {
      return "bg-greenText";
    } else if (Math.floor(protNo) === Math.floor(highestVersion)) {
      return "bg-yellowText";
    } else {
      return "bg-redText";
    }
  };

  if (versionCount === 1 || isAnyCountMajor) {
    return null;
  }

  return <PulseDot color={returnColor()} />;
};
