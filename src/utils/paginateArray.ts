export const paginateArray = (
  array: any[],
  currentPage: number,
  itemsPerPage: number,
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array?.slice(startIndex, endIndex);
};
