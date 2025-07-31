import type { MiscSearch } from "@/types/miscTypes";

export const getCategories = (data: MiscSearch[] | MiscSearch | undefined) => {
  if (!data) {
    return undefined;
  }

  if (Array.isArray(data)) {
    return {
      all: data.length,
      ...data.reduce((a, b) => {
        a[b.category] = a[b.category] + 1 || 1;

        return a;
      }, {}),
    };
  }

  return {
    all: 1,
    [data.category]: 1,
  };
};
