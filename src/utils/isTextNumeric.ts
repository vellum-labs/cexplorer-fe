export const isTextNumeric = (text: string) => {
  if (text === "") return true;
  return /^\d+$/.test(text);
};
