import { AdminContentDetail } from "@/components/admin/AdminContentDetail";
import type { ArticleUrl } from "@/types/articleTypes";
import { getRouteApi } from "@tanstack/react-router";

export const AdminWikiDetail = () => {
  const route = getRouteApi("/admin/wiki/$url");
  const { url }: { url: ArticleUrl } = route.useParams();

  return <AdminContentDetail type='wiki' url={url} lang='en' />;
};
