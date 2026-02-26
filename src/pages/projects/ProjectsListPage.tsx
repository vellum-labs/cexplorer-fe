import type { FC } from "react";
import { useMemo, useState } from "react";

import { PageBase } from "@/components/global/pages/PageBase";
import { DevelopmentActivityGraph } from "@/components/projects/DevelopmentActivityGraph";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCategoryFilter } from "@/components/projects/ProjectCategoryFilter";
import { configJSON } from "@/constants/conf";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchProjectList } from "@/services/projects";
import { normalizeInsights } from "@/types/projectTypes";
import {
  Button,
  LoadingSkeleton,
  TableSearchInput,
  useDebounce,
} from "@vellumlabs/cexplorer-sdk";
import { Plus } from "lucide-react";

const ADD_PROJECT_URL = `https://github.com/vellum-labs/cexplorer-community/tree/main/${configJSON.network}/projects`;

export const ProjectsListPage: FC = () => {
  const { t } = useAppTranslation();
  const projectsQuery = useFetchProjectList();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const projects = useMemo(() => {
    const data = projectsQuery.data?.data?.data ?? [];
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [projectsQuery.data?.data?.data]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => p.category.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  }, [projects]);

  const allInsights = useMemo(
    () => projects.flatMap(p => normalizeInsights(p.insights)),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(searchLower);
        const matchesDesc = project.description_short
          ?.toLowerCase()
          .includes(searchLower);
        const matchesId = project.project_id
          .toLowerCase()
          .includes(searchLower);
        if (!matchesName && !matchesDesc && !matchesId) return false;
      }

      if (selectedCategories.length > 0) {
        const hasCategory = selectedCategories.some(cat =>
          project.category.includes(cat),
        );
        if (!hasCategory) return false;
      }

      return true;
    });
  }, [projects, debouncedSearch, selectedCategories]);

  return (
    <PageBase
      metadataTitle='projectsList'
      title={t("projects.page.title")}
      breadcrumbItems={[{ label: t("projects.page.breadcrumb") }]}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile md:p-desktop'>
          <DevelopmentActivityGraph
            insights={allInsights}
            allReposLabel={t("projects.activity.organizations")}
          />

          <div className='flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
            <div className='flex items-center gap-1'>
              <a href={ADD_PROJECT_URL} target='_blank' rel='nofollow noopener'>
                <Button
                  variant='primary'
                  size='md'
                  leftIcon={<Plus size={15} />}
                  label={t("projects.page.addProject")}
                />
              </a>
              <ProjectCategoryFilter
                categories={allCategories}
                selected={selectedCategories}
                setSelected={setSelectedCategories}
              />
            </div>
            <TableSearchInput
              value={search}
              onchange={setSearch}
              placeholder={t("projects.page.searchPlaceholder")}
              showSearchIcon
              wrapperClassName='w-full md:max-w-[350px]'
              showPrefixPopup={false}
            />
          </div>

          {projectsQuery.isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredProjects.map(project => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageBase>
  );
};
