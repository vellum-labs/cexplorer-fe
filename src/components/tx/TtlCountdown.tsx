import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import { formatSecondsToTime } from "@vellumlabs/cexplorer-sdk";
import { useEffect, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export interface Props {
  seconds: number | undefined;
  slot_no: number | undefined;
  blockTime?: string;
}

const TtlCountdown = ({
  seconds: initialSeconds = 0,
  slot_no,
  blockTime,
}: Props) => {
  const { t } = useAppTranslation("common");
  const [seconds, setSeconds] = useState(initialSeconds);
  const now = new Date();

  const blockTimeDate = blockTime
    ? new Date(convertUtcToLocal(blockTime))
    : null;

  const secondsDiff = blockTimeDate
    ? Math.floor((now.getTime() - blockTimeDate.getTime()) / 1000)
    : 0;

  useEffect(() => {
    setSeconds(initialSeconds - secondsDiff);
  }, [initialSeconds, secondsDiff]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  if (!seconds || !slot_no) return null;
  return (
    <>
      {slot_no > seconds
        ? t("tx.lockedAgo", { time: formatSecondsToTime(slot_no - seconds) })
        : t("tx.lockingIn", { time: formatSecondsToTime(seconds - slot_no) })}
    </>
  );
};

export default TtlCountdown;
