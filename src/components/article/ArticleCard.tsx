import { articleCategories } from "@/constants/article";
import { colors } from "@/constants/colors";
import type { ArticleCategories, ArticleListData } from "@/types/articleTypes";
import { formatDate } from "@/utils/format/format";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { Clock } from "lucide-react";
import { Image } from "../global/Image";
import { Badge } from "../global/badges/Badge";

interface Props {
  article: ArticleListData;
  className?: string;
}

export const ArticleCard = ({ article, className }: Props) => {
  return (
    <article
      key={article.url}
      className={`flex w-full max-w-desktop flex-col gap-2 rounded-lg border border-border bg-cardBg p-3 text-primary shadow-sm ${className}`}
    >
      <Link to='/article/$url' params={{ url: article.url }} className='w-full'>
        <Image
          src={article.image}
          className='h-[200px] w-full rounded-lg object-cover'
          alt={article.name}
          height={200}
        />
      </Link>
      <div className='flex w-full flex-wrap items-center justify-between gap-1'>
        <span className='flex basis-[170px] items-center gap-1 text-sm text-text'>
          <Clock size={14} color={colors.text} />
          {formatDate(new Date(article.pub_date), true)}
        </span>
        {renderArticleAuthor(article.user_owner)}
      </div>
      <Link
        className='w-fit text-lg font-medium leading-[24px]'
        to='/article/$url'
        params={{ url: article.url }}
      >
        {parse(article.name)}
      </Link>
      <p className='text-sm text-grayTextPrimary'>
        {parse(article.description)}
      </p>
      <div className='mt-auto flex items-center gap-1'>
        {article.category.map(category => (
          <Badge
            key={category}
            color='blue'
            style={{
              filter: `hue-rotate(${articleCategories.indexOf(category as ArticleCategories) * 17.1}deg)`,
            }}
          >
            {category}
          </Badge>
        ))}
      </div>
    </article>
  );
};
