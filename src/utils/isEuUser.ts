export const isEuUser = (): boolean => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone.startsWith("Europe/");
};
