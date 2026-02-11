import type { BookmarksTableColumns } from "@/stores/tables/bookmarksTableStore";

interface BookmarksTableOption {
  key: keyof BookmarksTableColumns;
  name: string;
}

export const bookmarksTableOptions: BookmarksTableOption[] = [
  {
    key: "type",
    name: "Type",
  },
  {
    key: "my_name",
    name: "Personal name",
  },
  {
    key: "url",
    name: "Link",
  },
];
