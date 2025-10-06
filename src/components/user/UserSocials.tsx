import { Twitter } from "@/resources/images/icons/Twitter";
import type { User } from "@/types/userTypes";
import { isEmptySocial } from "@/utils/user/isEmptySocial";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon, Instagram, LinkIcon } from "lucide-react";

interface Props {
  author: User | undefined;
  className?: string;
}

export const UserSocials = ({ author, className }: Props) => {
  if (!author || !author?.profile?.social) return null;

  return (
    <div className={`flex w-full items-center gap-1 ${className}`}>
      {!isEmptySocial(author?.profile?.social?.discord) && (
        <a
          href={author?.profile?.social.discord}
          target='_blank'
          rel='nofollow noopener'
        >
          <DiscordLogoIcon width={20} height={20} color='#98A2B3' />
        </a>
      )}
      {!isEmptySocial(author?.profile?.social?.xcom) && (
        <a
          href={author?.profile?.social.xcom}
          target='_blank'
          rel='nofollow noopener'
        >
          <Twitter size={20} color='#98A2B3' className='-mr-1' />
        </a>
      )}
      {!isEmptySocial(author?.profile?.social?.facebook) && (
        <a
          href={author?.profile?.social.facebook}
          target='_blank'
          rel='nofollow noopener'
        >
          <FacebookIcon className='' size={20} color={"#98A2B3"} />
        </a>
      )}
      {!isEmptySocial(author?.profile?.social?.instagram) && (
        <a
          href={author?.profile?.social.instagram}
          target='_blank'
          rel='nofollow noopener'
        >
          <Instagram className='' size={20} color={"#98A2B3"} />
        </a>
      )}
      {!isEmptySocial(author?.profile?.social?.web) && (
        <a
          href={author?.profile.social.web}
          target='_blank'
          rel='nofollow noopener'
        >
          <LinkIcon className='' size={20} color={"#98A2B3"} />
        </a>
      )}
    </div>
  );
};
