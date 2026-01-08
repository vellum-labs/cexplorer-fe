export type ContentType = "article" | "wiki";

export interface ContentTypeConfig {
  category: "wiki" | undefined;
  draftPrefix: string;
  successMessage: string;
  errorMessage: string;
  pageTitle: string;
  breadcrumbLink: "/admin/articles" | "/admin/wiki";
  breadcrumbLabel: string;
}

export const ADMIN_CONTENT_CONFIG: Record<ContentType, ContentTypeConfig> = {
  article: {
    category: undefined,
    draftPrefix: "article",
    successMessage: "Article updated",
    errorMessage: "Failed to update article",
    pageTitle: "Admin article detail | Cexplorer.io",
    breadcrumbLink: "/admin/articles",
    breadcrumbLabel: "Admin articles",
  },
  wiki: {
    category: "wiki",
    draftPrefix: "wiki",
    successMessage: "Wiki article updated",
    errorMessage: "Failed to update wiki article",
    pageTitle: "Admin wiki detail | Cexplorer.io",
    breadcrumbLink: "/admin/wiki",
    breadcrumbLabel: "Admin wiki",
  },
};

export const PRIMARY_FIELDS = [
  { label: "Name", field: "name", placeholder: "Name" },
  { label: "Description", field: "description", placeholder: "Description" },
] as const;

export const SECONDARY_FIELDS = [
  { label: "Keywords", field: "keywords", placeholder: "Keywords" },
  { label: "Image", field: "image", placeholder: "Image" },
] as const;
