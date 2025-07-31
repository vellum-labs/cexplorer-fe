export const generateUrlWithParams = (
  url: string | undefined,
  params: Record<string, string> | undefined,
) => {
  if (!params) return url;

  const urlParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    urlParams.append(key, params[key]);
  });

  return `${url}?${urlParams.toString()}`;
};
