import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export const formatString = (
  text: string | null | undefined,
  type: "short" | "long" | "shorter" | "longer",
  startIndex?: number,
) => {
  if (!text) return;

  const startFromIndex = startIndex || 0;
  if (type === "short") {
    return `${text.slice(0 + startFromIndex, 5 + startFromIndex)}...${text.slice(-5)}`;
  }

  if (type === "shorter") {
    return `${text.slice(0 + startFromIndex, 4 + startFromIndex)}...${text.slice(-4)}`;
  }

  if (type === "longer") {
    return `${text.slice(0 + startFromIndex, 11 + startFromIndex)}...${text.slice(-11)}`;
  }

  return `${text.slice(0 + startFromIndex, 8 + startFromIndex)}...${text.slice(-8)}`;
};

export const formatTimeIn = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  const years = Math.floor(diffInSeconds / 31536000);
  const months = Math.floor((diffInSeconds % 31536000) / 2592000);
  const days = Math.floor((diffInSeconds % 2592000) / 86400);
  const hours = Math.floor((diffInSeconds % 86400) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if (years > 0) {
    return years >= 1
      ? `in ${years}y${months > 0 ? ` ${months}m` : ""}`
      : `in ${months}mo${days > 0 ? ` ${days}d` : ""}`;
  } else if (months > 0) {
    return `in ${months}mo${days > 0 ? ` ${days}d` : ""}`;
  } else if (days > 0) {
    return `in ${days}d${hours > 0 ? ` ${hours}h` : ""}`;
  } else if (hours > 0) {
    return `in ${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  } else if (minutes > 0) {
    return `in ${minutes}m${seconds > 0 ? ` ${seconds}s` : ""}`;
  } else {
    return `in ${seconds}s`;
  }
};

export const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const years = Math.floor(diffInSeconds / 31536000);
  const months = Math.floor((diffInSeconds % 31536000) / 2592000);
  const days = Math.floor((diffInSeconds % 2592000) / 86400);
  const hours = Math.floor((diffInSeconds % 86400) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if (years > 0) {
    return years >= 1
      ? `${years}y${months > 0 ? ` ${months}mo` : ""} ago`
      : `${months}mo${days > 0 ? ` ${days}d` : ""} ago`;
  } else if (months > 0) {
    return `${months}mo${days > 0 ? ` ${days}d` : ""} ago`;
  } else if (days > 0) {
    return `${days}d${hours > 0 ? ` ${hours}h` : ""} ago`;
  } else if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes}m${seconds > 0 ? ` ${seconds}s` : ""} ago`;
  } else {
    return `${seconds}s ago`;
  }
};

export const formatNumber = (number: number | string | undefined): string => {
  if (number === undefined) return "-";

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatNumberWithSuffix = (
  num: number,
  removeUnusedZeroes?: boolean,
  numberOfDecimals?: number,
): string => {
  switch (true) {
    case num >= 1e9:
      return (num / 1e9).toFixed(numberOfDecimals ?? 2) + "B";
    case num >= 1e6:
      return (num / 1e6).toFixed(numberOfDecimals ?? 2) + "M";
    case num >= 1e3:
      return (num / 1e3).toFixed(numberOfDecimals ?? 2) + "k";
    default:
      return num.toFixed(removeUnusedZeroes ? 0 : 2) + "";
  }
};

export const formatSecondsToTime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let timeString = "";

  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0) {
    timeString += `${minutes}m `;
  }
  if (secs > 0 || timeString === "") {
    timeString += `${secs}s`;
  }

  return timeString.trim();
};

export const toUtcDate = (input: string | Date | number): Date => {
  if (input instanceof Date) return input;
  if (typeof input === "string") {
    const hasTZ = /[zZ]|[+-]\d{2}:\d{2}$/.test(input);
    return new Date(hasTZ ? input : input + "Z");
  }
  return new Date(input);
};

export const formatDate = (
  input?: string | Date | number,
  hideTime?: boolean,
  returnString: boolean = false,
) => {
  if (!input) return "";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = toUtcDate(input);
  const zoned = new TZDate(utcDate, timeZone);

  if (returnString) {
    return zoned.toISOString();
  }

  const offset = format(zoned, "XXX");

  return (
    <Tooltip content={<span>Local timezone UTC {offset}</span>}>
      {format(zoned, hideTime ? "MMM dd yyyy" : "MMM dd yyyy, HH:mm zzz")}
    </Tooltip>
  );
};
