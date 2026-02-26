import { BookmarksPage } from "@/pages/bookmarks/BookmarksPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookmarks/")({
  component: () => <BookmarksPage />,
});
