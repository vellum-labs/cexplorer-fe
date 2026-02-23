import type { FC } from "react";
import { useMemo } from "react";
import type { ProjectListItem } from "@/types/projectTypes";
import { isValidLink, capitalize, computeInsightStats } from "@/utils/projectHelpers";

import { useNavigate } from "@tanstack/react-router";
import {
  GithubLogo,
  TwitterLogo,
  DiscordLogo,
  TelegramLogo,
  Badge,
  formatNumber,
} from "@vellumlabs/cexplorer-sdk";
import { LinkIcon } from "lucide-react";

import { useAppTranslation } from "@/hooks/useAppTranslation";

interface ProjectCardProps {
  project: ProjectListItem;
}

const formatTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1mo ago";
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const links = project.official_links;

  const { totalCommits, lastActivity, repoCount } = useMemo(
    () => computeInsightStats(project.insights),
    [project.insights],
  );

  return (
    <div
      onClick={() =>
        navigate({ to: "/projects/$id", params: { id: project.project_id } })
      }
      className='flex cursor-pointer flex-col gap-2 rounded-m border border-border bg-cardBg p-2 transition-all duration-200 hover:border-primary'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          {project.icon && (
            <img
              src={project.icon}
              alt={project.name}
              className='h-8 w-8 rounded-full object-cover'
            />
          )}
          <span className='text-text-md font-semibold'>{project.name}</span>
        </div>
        <div className='flex items-center gap-1'>
          {isValidLink(links?.website) && (
            <a
              href={links.website}
              target='_blank'
              rel='nofollow noopener'
              onClick={e => e.stopPropagation()}
            >
              <LinkIcon size={18} className='text-grayTextPrimary' />
            </a>
          )}
          {isValidLink(links?.x) && (
            <a
              href={links.x}
              target='_blank'
              rel='nofollow noopener'
              onClick={e => e.stopPropagation()}
            >
              <img src={TwitterLogo} alt='X' width={18} />
            </a>
          )}
          {isValidLink(links?.github) && (
            <a
              href={links.github}
              target='_blank'
              rel='nofollow noopener'
              onClick={e => e.stopPropagation()}
            >
              <img src={GithubLogo} alt='GitHub' width={18} />
            </a>
          )}
          {isValidLink(links?.discord) && (
            <a
              href={links.discord}
              target='_blank'
              rel='nofollow noopener'
              onClick={e => e.stopPropagation()}
            >
              <img src={DiscordLogo} alt='Discord' width={18} />
            </a>
          )}
          {isValidLink(links?.telegram) && (
            <a
              href={links.telegram}
              target='_blank'
              rel='nofollow noopener'
              onClick={e => e.stopPropagation()}
            >
              <img src={TelegramLogo} alt='Telegram' width={18} />
            </a>
          )}
        </div>
      </div>

      {project.category.length > 0 && (
        <div className='flex flex-wrap gap-1/2'>
          {project.category.map(cat => (
            <Badge key={cat} color='blue'>
              {capitalize(cat)}
            </Badge>
          ))}
        </div>
      )}

      {project.description_short &&
        project.description_short !== "string (max ~200 chars)" && (
          <p className='line-clamp-2 text-text-sm text-grayTextPrimary'>
            {project.description_short}
          </p>
        )}

      {(lastActivity || totalCommits > 0 || repoCount > 0) && (
        <div className='flex flex-wrap gap-3 text-text-xs text-grayTextPrimary'>
          {lastActivity && (
            <span>
              {t("projects.card.lastActivity")}{" "}
              <strong className='text-text'>{formatTimeAgo(lastActivity)}</strong>
            </span>
          )}
          {totalCommits > 0 && (
            <span>
              {t("projects.card.totalCommits")}{" "}
              <strong className='text-text'>{formatNumber(totalCommits)}</strong>
            </span>
          )}
          {repoCount > 0 && (
            <span>
              {t("projects.card.repositories")}{" "}
              <strong className='text-text'>{repoCount}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
