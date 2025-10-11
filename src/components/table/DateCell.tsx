import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import { formatDate, formatTimeAgo, formatTimeIn } from "@/utils/format/format";
import { useEffect, useState } from "react";

const DateCell = ({
  time,
  className = "",
  tabularNums = true,
  withoutConvert = false,
}: {
  time: string | undefined;
  className?: string;
  tabularNums?: boolean;
  withoutConvert?: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const localTime = time
    ? withoutConvert
      ? (formatDate(time, false, true) as string)
      : convertUtcToLocal(time)
    : "";

  const date = new Date(localTime);

  return (
    <p className={` ${tabularNums ? "tabular-nums" : ""} ${className}`}>
      {time
        ? date > currentTime
          ? formatTimeIn(localTime)
          : formatTimeAgo(localTime)
        : "-"}
    </p>
  );
};

export default DateCell;
