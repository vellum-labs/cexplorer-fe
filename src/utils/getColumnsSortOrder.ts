export const getColumnsSortOrder = (sort: "asc" | "desc" | undefined) =>
  typeof sort === "undefined" ? "desc" : sort === "desc" ? "asc" : undefined;
