import { Tooltip } from "@/components/ui/tooltip";
import { UserSocials } from "@/components/user/UserSocials";
import type { User } from "@/types/userTypes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { formatString } from "./format/format";
import { isEmptySocial } from "./user/isEmptySocial";

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
  else if (!author?.profile.name) {
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
  return (
    <span className='flex items-center gap-1/2 text-text-sm text-text'>
      By: {authorName}
    </span>
  );
};
