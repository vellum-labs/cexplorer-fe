import type { PoolMetaExtended } from "@/types/poolTypes";
import TwitterLogo from "@/resources/images/icons/twitter.svg";
import DiscordLogo from "@/resources/images/icons/discord.svg";
import TelegramLogo from "@/resources/images/icons/telegram.svg";
import GithubLogo from "@/resources/images/icons/github.svg";
import FacebookLogo from "@/resources/images/icons/facebook.svg";
import YoutubeLogo from "@/resources/images/icons/youtube.svg";
import TwitchLogo from "@/resources/images/icons/twitch.svg";

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

  if (extended.twitter_handle) {
    socialIcons.push({
      icon: TwitterLogo,
      url: `https://x.com/${extended.twitter_handle}`,
      alt: "Twitter/X",
    });
  }
  if (extended.discord_handle) {
    socialIcons.push({
      icon: DiscordLogo,
      url: `https://discord.gg/${extended.discord_handle}`,
      alt: "Discord",
    });
  }
  if (extended.telegram_handle) {
    socialIcons.push({
      icon: TelegramLogo,
      url: `https://t.me/${extended.telegram_handle}`,
      alt: "Telegram",
    });
  }
  if (extended.github_handle) {
    socialIcons.push({
      icon: GithubLogo,
      url: `https://github.com/${extended.github_handle}`,
      alt: "GitHub",
    });
  }
  if (extended.facebook_handle) {
    socialIcons.push({
      icon: FacebookLogo,
      url: `https://facebook.com/${extended.facebook_handle}`,
      alt: "Facebook",
    });
  }
  if (extended.youtube_handle) {
    socialIcons.push({
      icon: YoutubeLogo,
      url: `https://youtube.com/${extended.youtube_handle}`,
      alt: "YouTube",
    });
  }
  if (extended.twitch_handle) {
    socialIcons.push({
      icon: TwitchLogo,
      url: `https://twitch.tv/${extended.twitch_handle}`,
      alt: "Twitch",
    });
  }

  return socialIcons;
};
