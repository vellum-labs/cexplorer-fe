export const getConfirmations = (
  miscBlockNo?: number,
  checkBlockNo?: number,
): [string, number] => {
  const confirmations = Math.max(0, (miscBlockNo || 0) - (checkBlockNo || 0));
  let status = "Low";

  switch (true) {
    case confirmations < 3:
      break;
    case confirmations < 9:
      status = "Medium";
      break;
    default:
      status = "High";
  }

  return [`${status} (${confirmations})`, confirmations];
};
