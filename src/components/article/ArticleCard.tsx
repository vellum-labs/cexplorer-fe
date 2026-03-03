import type { ArticleListData } from "@/types/articleTypes";
import { formatDate } from "@vellumlabs/cexplorer-sdk";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { Link } from "@tanstack/react-router";
import { Image } from "@vellumlabs/cexplorer-sdk";

interface Props {
  article: ArticleListData;
  className?: string;
}

export const ArticleCard = ({ article, className }: Props) => {
  const author = renderArticleAuthor(article.user_owner);

  return (
    <Link
      to='/article/$url'
      params={{ url: article.url }}
      className='w-full rounded-m shadow-sm transition-all duration-300 hover:bg-cardBg hover:text-text min-[1000px]:max-w-[430px]'
    >
      <article
        key={article.url}
        className={`flex h-[450px] flex-col gap-1 overflow-hidden ${className}`}
      >
        <Image
          src={article.image}
          className='h-[240px] w-full rounded-l object-cover'
          alt={article.name}
          height={240}
        />
        <div className='flex items-center gap-1 px-1 text-text-sm font-semibold text-primary'>
          {author && (
            <>
              <span>{author}</span>
              <span>•</span>
            </>
          )}
          <span>{formatDate(article.pub_date, true)}</span>
        </div>
        <h3 className='w-fit px-1 text-text-lg font-medium leading-[24px]'>
          {article.name.length > 80
            ? article.name.slice(0, 80) + "..."
            : article.name}
        </h3>
        {article.description && (
          <p className='px-1 text-grayTextSecondary'>
            {article.description.length > 300
              ? article.description.slice(0, 300) + "..."
              : article.description}
          </p>
        )}
      </article>
    </Link>
  );
};
