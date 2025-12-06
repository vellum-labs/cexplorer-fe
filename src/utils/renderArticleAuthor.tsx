import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { UserSocials } from "@/components/user/UserSocials";
import type { User } from "@/types/userTypes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { isEmptySocial } from "./user/isEmptySocial";
import { getNodeText } from "@vellumlabs/cexplorer-sdk";

export const renderArticleAuthor = (author: User | undefined) => {
  let authorName;
  if (!author)
    authorName = (
      <span className='flex items-center gap-1/2'>
        Hidden
        <Tooltip
          content={
            <div className='w-[120px]'>This user's profile is not public.</div>
          }
        >
          <QuestionMarkCircledIcon />
        </Tooltip>
      </span>
    );
  else if (!author?.profile?.name) {
    authorName = (
      <Link
        to='/address/$address'
        params={{ address: author?.address }}
        className='text-primary'
      >
        {formatString(author?.address, "long")}
      </Link>
    );
  } else {
    authorName = (
      <Tooltip
        hide={Object.values(author?.profile.social).every(social =>
          isEmptySocial(social),
        )}
        content={<UserSocials author={author} className='w-[120px]' />}
      >
        <Link
          to='/address/$address'
          params={{ address: author?.address }}
          className='text-primary'
        >
          {author?.profile.name}
        </Link>
      </Tooltip>
    );
  }
  return getNodeText(authorName) ? (
    <span className='flex items-center gap-1/2 text-text-sm text-text'>
      {getNodeText(authorName).length > 30
        ? formatString(getNodeText(authorName), "long")
        : authorName}
    </span>
  ) : undefined;
};
