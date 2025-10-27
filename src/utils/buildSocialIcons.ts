import type { PoolMetaExtended } from "@/types/poolTypes";
import { TwitterLogo } from "@vellumlabs/cexplorer-sdk";
import { DiscordLogo } from "@vellumlabs/cexplorer-sdk";
import { TelegramLogo } from "@vellumlabs/cexplorer-sdk";
import { GithubLogo } from "@vellumlabs/cexplorer-sdk";
import { FacebookLogo } from "@vellumlabs/cexplorer-sdk";
import { YoutubeLogo } from "@vellumlabs/cexplorer-sdk";
import { TwitchLogo } from "@vellumlabs/cexplorer-sdk";

export interface SocialIcon {
  icon: string;
  url: string;
  alt: string;
}

export const buildSocialIcons = (
  extended: PoolMetaExtended | null | undefined,
): SocialIcon[] => {
  if (!extended) return [];

  const socialIcons: SocialIcon[] = [];

  const socialHandleKeys: Array<keyof PoolMetaExtended> = [
    "twitter_handle",
    "discord_handle",
    "telegram_handle",
    "github_handle",
    "facebook_handle",
    "youtube_handle",
    "twitch_handle",
  ];

  socialHandleKeys.forEach(key => {
    const handle = extended[key];
    if (!handle) return;

    switch (key) {
      case "twitter_handle":
        socialIcons.push({
          icon: TwitterLogo,
          url: `https://x.com/${handle}`,
          alt: "Twitter/X",
        });
        break;
      case "discord_handle":
        socialIcons.push({
          icon: DiscordLogo,
          url: `https://discord.gg/${handle}`,
          alt: "Discord",
        });
        break;
      case "telegram_handle":
        socialIcons.push({
          icon: TelegramLogo,
          url: `https://t.me/${handle}`,
          alt: "Telegram",
        });
        break;
      case "github_handle":
        socialIcons.push({
          icon: GithubLogo,
          url: `https://github.com/${handle}`,
          alt: "GitHub",
        });
        break;
      case "facebook_handle":
        socialIcons.push({
          icon: FacebookLogo,
          url: `https://facebook.com/${handle}`,
          alt: "Facebook",
        });
        break;
      case "youtube_handle":
        socialIcons.push({
          icon: YoutubeLogo,
          url: `https://youtube.com/${handle}`,
          alt: "YouTube",
        });
        break;
      case "twitch_handle":
        socialIcons.push({
          icon: TwitchLogo,
          url: `https://twitch.tv/${handle}`,
          alt: "Twitch",
        });
        break;
      default:
        break;
    }
  });

  return socialIcons;
};
