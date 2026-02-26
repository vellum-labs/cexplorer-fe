const SOCIAL_BASES: Record<string, string> = {
  xcom: "https://x.com/",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  web: "https://",
};

export const resolveSocialUrl = (
  value: string,
  platform: keyof typeof SOCIAL_BASES,
): string => {
  if (!value) return value;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const handle = value.startsWith("@") ? value.slice(1) : value;

  if (platform === "web") {
    return `https://${handle}`;
  }

  return `${SOCIAL_BASES[platform]}${handle}`;
};
