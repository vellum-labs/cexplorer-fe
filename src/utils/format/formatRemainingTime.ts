export const formatRemainingTime = (seconds: number) => {
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor((seconds % 31536000) / 2592000);
  const days = Math.floor((seconds % 2592000) / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (years > 0) {
    return years >= 1
      ? `${years}y${months > 0 ? ` ${months}mo` : ""}`
      : `${months}mo${days > 0 ? ` ${days}d` : ""}`;
  } else if (months > 0) {
    return `${months}mo${days > 0 ? ` ${days}d` : ""}`;
  } else if (days > 0) {
    return `${days}d${hours > 0 ? ` ${hours}h` : ""}`;
  } else if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  } else if (minutes > 0) {
    return `${minutes}m${secs > 0 ? ` ${secs}s` : ""}`;
  } else {
    return `${secs}s`;
  }
};
