import { AdminContentDetail } from "@/components/admin/AdminContentDetail";
import type { ArticleUrl } from "@/types/articleTypes";
import { getRouteApi } from "@tanstack/react-router";

export const AdminArticleDetail = () => {
  const route = getRouteApi("/admin/articles/$url");
  const { url }: { url: ArticleUrl } = route.useParams();

  return <AdminContentDetail type='article' url={url} lang='en' />;
};
