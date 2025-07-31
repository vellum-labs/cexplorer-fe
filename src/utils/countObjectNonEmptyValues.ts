export const countObjectNonEmptyValues = (obj: { [key: string]: number }) => {
  let count = 0;

  for (const key in obj) {
    if (obj[key] > 0) {
      count++;
    }
  }

  return count;
};
