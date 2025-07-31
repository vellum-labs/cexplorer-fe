export const formatWebsiteUrl = (url: string | undefined | null) => {
  if (!url) return "";

  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/i);
  return match ? match[1] : "";
};
