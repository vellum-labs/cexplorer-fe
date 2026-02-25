import type { FC } from "react";
import { useMemo } from "react";

import { Link, useParams } from "@tanstack/react-router";
import {
  Badge,
  GithubLogo,
  TwitterLogo,
  DiscordLogo,
  TelegramLogo,
  LoadingSkeleton,
  Tabs,
  GlobalTable,
  TableSettingsDropdown,
  Copy,
  formatString,
  formatNumber,
  Image,
} from "@vellumlabs/cexplorer-sdk";
import { LinkIcon } from "lucide-react";

import { PageBase } from "@/components/global/pages/PageBase";
import { useProjectScriptsTableStore } from "@/stores/tables/projectScriptsTableStore";
import { useProjectProductsTableStore } from "@/stores/tables/projectProductsTableStore";
import { useProjectOnChainTableStore } from "@/stores/tables/projectOnChainTableStore";
import { DevelopmentActivityGraph } from "@/components/projects/DevelopmentActivityGraph";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchProjectDetail } from "@/services/projects";
import type { ProjectDetail, ProjectProduct, ProjectScript } from "@/types/projectTypes";
import type { ProjectScriptsTableColumns, ProjectProductsTableColumns, ProjectOnChainTableColumns } from "@/types/tableTypes";
import { normalizeInsights } from "@/types/projectTypes";
import { isValidLink, capitalize, createMockQuery, computeInsightStats } from "@/utils/projectHelpers";

export const ProjectDetailPage: FC = () => {
  const { t } = useAppTranslation();
  const { id } = useParams({ from: "/project/$id" });
  const detailQuery = useFetchProjectDetail(id);

  const project = detailQuery.data?.data as ProjectDetail | undefined;

  const normalizedInsights = useMemo(
    () => normalizeInsights(project?.insights),
    [project?.insights],
  );

  const { totalCommits, lastActivity } = useMemo(
    () => computeInsightStats(project?.insights),
    [project?.insights],
  );

  const tabs = useMemo(() => {
    if (!project) return [];
    return [
      {
        key: "development-activity",
        label: t("projects.detail.tabs.developmentActivity"),
        content: (
          <DevelopmentActivityGraph insights={normalizedInsights} />
        ),
        visible: normalizedInsights.length > 0,
      },
      {
        key: "scripts",
        label: t("projects.detail.tabs.scripts"),
        content: <ScriptsTab project={project} />,
        visible:
          (project.scripts ?? []).filter(s => s.script_id).length > 0,
      },
      {
        key: "products",
        label: t("projects.detail.tabs.products"),
        content: <ProductsTab project={project} />,
        visible: (project.products ?? []).length > 0,
      },
      {
        key: "on-chain",
        label: t("projects.detail.tabs.onChainAssociations"),
        content: <OnChainTab project={project} />,
        visible:
          (project.pools?.length ?? 0) > 0 ||
          !!project.drep?.drep_id ||
          (project.policy ?? []).filter(p => p.policy_id).length > 0 ||
          (project.assets ?? []).filter(a => a.asset_id).length > 0,
      },
    ];
  }, [project, normalizedInsights, t]);

  return (
    <PageBase
      metadataTitle='projectDetail'
      metadataReplace={{ before: "%id%", after: id }}
      title={project?.name ?? formatString(id, "long")}
      breadcrumbItems={[
        {
          label: (
            <Link to='/project'>{t("projects.page.breadcrumb")}</Link>
          ),
        },
        { label: project?.name ?? formatString(id, "long") },
      ]}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile md:p-desktop'>
          {detailQuery.isLoading ? (
            <LoadingSkeleton />
          ) : project ? (
            <>
              <div className='flex flex-col gap-2 md:flex-row'>
                <DetailsCard project={project} totalCommits={totalCommits} lastActivity={lastActivity} />
                <DescriptionCard project={project} />
              </div>

              <Tabs
                items={tabs}
                withPadding={false}
                mobileItemsCount={2}
              />
            </>
          ) : (
            <p className='text-grayTextPrimary'>Project not found.</p>
          )}
        </div>
      </section>
    </PageBase>
  );
};

const DetailRow: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className='flex items-start justify-between gap-2 border-b border-border py-1 last:border-b-0'>
    <span className='shrink-0 text-text-sm text-grayTextPrimary'>{label}</span>
    <div className='text-right text-text-sm'>{children}</div>
  </div>
);

const DetailsCard: FC<{
  project: ProjectDetail;
  totalCommits: number;
  lastActivity: string | null;
}> = ({ project, totalCommits, lastActivity }) => {
  const { t } = useAppTranslation();
  const links = project.official_links;

  return (
    <div className='flex w-full flex-col rounded-m border border-border bg-cardBg p-2 md:w-[420px]'>
      <h3 className='mb-1 text-text-md font-semibold'>
        {t("projects.detail.details")}
      </h3>

      <DetailRow label={t("projects.detail.projectName")}>
        <div className='flex items-center gap-1'>
          <Image
            src={project.icon}
            alt={project.name}
            fallbackletters={project.name}
            width={28}
            height={28}
            className='rounded-max'
          />
          <span className='font-semibold'>{project.name}</span>
        </div>
      </DetailRow>

      {project.category.length > 0 && (
        <DetailRow label={t("projects.detail.category")}>
          <div className='flex flex-wrap justify-end gap-1/2'>
            {project.category.map(cat => (
              <Badge key={cat} color='blue'>
                {capitalize(cat)}
              </Badge>
            ))}
          </div>
        </DetailRow>
      )}

      {project.status && (
        <DetailRow label={t("projects.detail.status")}>
          <Badge color='green'>
            {capitalize(project.status)}
          </Badge>
        </DetailRow>
      )}

      {project.launch_year > 0 && (
        <DetailRow label={t("projects.detail.launched")}>
          {project.launch_year}
        </DetailRow>
      )}

      {lastActivity && (
        <DetailRow label={t("projects.detail.lastActivity")}>
          {new Date(lastActivity).toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </DetailRow>
      )}

      <DetailRow label={t("projects.detail.totalCommits")}>
        {formatNumber(totalCommits)}
      </DetailRow>

      {project.tracked_repositories?.length > 0 && (
        <DetailRow label={t("projects.detail.repositories")}>
          {formatNumber(project.tracked_repositories.length)}
        </DetailRow>
      )}

      <DetailRow label={t("projects.detail.links")}>
        <div className='flex items-center justify-end gap-1'>
          {isValidLink(links?.website) && (
            <a
              href={links.website}
              target='_blank'
              rel='nofollow noopener'
            >
              <LinkIcon size={16} className='text-grayTextPrimary hover:text-primary' />
            </a>
          )}
          {isValidLink(links?.x) && (
            <a href={links.x} target='_blank' rel='nofollow noopener'>
              <img src={TwitterLogo} alt='X' width={16} />
            </a>
          )}
          {isValidLink(links?.github) && (
            <a
              href={links.github}
              target='_blank'
              rel='nofollow noopener'
            >
              <img src={GithubLogo} alt='GitHub' width={16} />
            </a>
          )}
          {isValidLink(links?.discord) && (
            <a
              href={links.discord}
              target='_blank'
              rel='nofollow noopener'
            >
              <img src={DiscordLogo} alt='Discord' width={16} />
            </a>
          )}
          {isValidLink(links?.telegram) && (
            <a
              href={links.telegram}
              target='_blank'
              rel='nofollow noopener'
            >
              <img src={TelegramLogo} alt='Telegram' width={16} />
            </a>
          )}
        </div>
      </DetailRow>
    </div>
  );
};

const DescriptionCard: FC<{ project: ProjectDetail }> = ({ project }) => {
  const { t } = useAppTranslation();

  return (
    <div className='flex flex-1 flex-col rounded-m border border-border bg-cardBg p-2'>
      <h3 className='mb-1 text-text-md font-semibold'>
        {t("projects.detail.description")}
      </h3>
      <p className='whitespace-pre-line text-text-sm text-grayTextPrimary'>
        {project.description_long ||
          project.description_short ||
          t("projects.detail.noDescription")}
      </p>
    </div>
  );
};

const scriptsTableOptions = [
  { key: "script_name", name: "script_name" },
  { key: "description", name: "script_description" },
  { key: "script_id", name: "script_id" },
];

const ScriptsTab: FC<{ project: ProjectDetail }> = ({ project }) => {
  const { t } = useAppTranslation();
  const {
    columnsVisibility,
    rows,
    columnsOrder,
    setColumnVisibility,
    setRows,
    setColumsOrder,
  } = useProjectScriptsTableStore()();

  const scripts = useMemo(
    () => (project.scripts ?? []).filter(s => s.script_id),
    [project.scripts],
  );

  const columns = useMemo(
    () =>
      [
        {
          key: "script_name",
          title: <p>{t("projects.detail.scripts.name")}</p>,
          visible: columnsVisibility.script_name,
          widthPx: 150,
          render: (item: ProjectScript) => (
            <span className='font-semibold text-text'>
              {item.script_name || "-"}
            </span>
          ),
        },
        {
          key: "description",
          title: <p>{t("projects.detail.scripts.description")}</p>,
          visible: columnsVisibility.description,
          widthPx: 250,
          render: (item: ProjectScript) => item.description || "-",
        },
        {
          key: "script_id",
          title: <p>{t("projects.detail.scripts.scriptId")}</p>,
          visible: columnsVisibility.script_id,
          widthPx: 200,
          render: (item: ProjectScript) =>
            item.script_id ? (
              <div className='flex items-center gap-1'>
                <span className='text-primary'>
                  {formatString(item.script_id, "short")}
                </span>
                <Copy copyText={item.script_id} size={13} />
              </div>
            ) : (
              "-"
            ),
        },
      ].sort(
        (a, b) =>
          columnsOrder.indexOf(
            a.key as keyof ProjectScriptsTableColumns,
          ) -
          columnsOrder.indexOf(
            b.key as keyof ProjectScriptsTableColumns,
          ),
      ),
    [t, columnsVisibility, columnsOrder],
  );

  const mockQuery = useMemo(() => createMockQuery(scripts), [scripts]);

  return (
    <div className='py-2'>
      <div className='mb-2 flex items-center gap-2'>
        <p className='text-text-md font-semibold'>
          {scripts.length} {t("projects.detail.tabs.scripts").toLowerCase()}
        </p>
        <div className='ml-auto shrink-0'>
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          rowsLabel={t("table.rows")}
          columnsOptions={scriptsTableOptions.map(item => ({
            label: t(`tableSettings.${item.name}`),
            isVisible:
              columnsVisibility[
                item.key as keyof typeof columnsVisibility
              ],
            onClick: () =>
              setColumnVisibility(
                item.key,
                !columnsVisibility[
                  item.key as keyof typeof columnsVisibility
                ],
              ),
          }))}
        />
        </div>
      </div>
      <GlobalTable
        type='default'
        itemsPerPage={rows}
        pagination
        rowHeight={50}
        scrollable
        minContentWidth={600}
        query={mockQuery as any}
        items={scripts}
        columns={columns}
        totalItems={scripts.length}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("projects.detail.scripts.noScripts")}
      />
    </div>
  );
};

const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const LinkCell: FC<{ url: string | undefined }> = ({ url }) =>
  isValidLink(url) ? (
    <a
      href={url}
      target='_blank'
      rel='nofollow noopener'
      className='text-primary'
    >
      {getDomain(url!)}
    </a>
  ) : (
    <span>-</span>
  );

const productsTableOptions = [
  { key: "product_name", name: "product_name" },
  { key: "website", name: "product_website" },
  { key: "app", name: "product_app" },
  { key: "docs", name: "product_docs" },
  { key: "github", name: "product_github" },
];

const ProductsTab: FC<{ project: ProjectDetail }> = ({ project }) => {
  const { t } = useAppTranslation();
  const {
    columnsVisibility,
    rows,
    columnsOrder,
    setColumnVisibility,
    setRows,
    setColumsOrder,
  } = useProjectProductsTableStore()();

  const products = useMemo(
    () => project.products ?? [],
    [project.products],
  );

  const columns = useMemo(
    () =>
      [
        {
          key: "product_name",
          title: <p>{t("projects.detail.scripts.name")}</p>,
          visible: columnsVisibility.product_name,
          widthPx: 180,
          render: (item: ProjectProduct) => (
            <span className='font-semibold text-text'>
              {item.name || "-"}
            </span>
          ),
        },
        {
          key: "website",
          title: <p>{t("projects.detail.products.website")}</p>,
          visible: columnsVisibility.website,
          widthPx: 180,
          render: (item: ProjectProduct) => (
            <LinkCell url={item.links?.website} />
          ),
        },
        {
          key: "app",
          title: <p>{t("projects.detail.products.app")}</p>,
          visible: columnsVisibility.app,
          widthPx: 180,
          render: (item: ProjectProduct) => (
            <LinkCell url={item.links?.app} />
          ),
        },
        {
          key: "docs",
          title: <p>{t("projects.detail.products.docs")}</p>,
          visible: columnsVisibility.docs,
          widthPx: 180,
          render: (item: ProjectProduct) => (
            <LinkCell url={item.links?.docs} />
          ),
        },
        {
          key: "github",
          title: <p>{t("projects.detail.products.github")}</p>,
          visible: columnsVisibility.github,
          widthPx: 180,
          render: (item: ProjectProduct) => (
            <LinkCell url={item.links?.github} />
          ),
        },
      ].sort(
        (a, b) =>
          columnsOrder.indexOf(
            a.key as keyof ProjectProductsTableColumns,
          ) -
          columnsOrder.indexOf(
            b.key as keyof ProjectProductsTableColumns,
          ),
      ),
    [t, columnsVisibility, columnsOrder],
  );

  const mockQuery = useMemo(() => createMockQuery(products), [products]);

  return (
    <div className='py-2'>
      <div className='mb-2 flex items-center gap-2'>
        <p className='text-text-md font-semibold'>
          {products.length} {t("projects.detail.tabs.products").toLowerCase()}
        </p>
        <div className='ml-auto shrink-0'>
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          rowsLabel={t("table.rows")}
          columnsOptions={productsTableOptions.map(item => ({
            label: t(`tableSettings.${item.name}`),
            isVisible:
              columnsVisibility[
                item.key as keyof typeof columnsVisibility
              ],
            onClick: () =>
              setColumnVisibility(
                item.key,
                !columnsVisibility[
                  item.key as keyof typeof columnsVisibility
                ],
              ),
          }))}
        />
        </div>
      </div>
      <GlobalTable
        type='default'
        itemsPerPage={rows}
        pagination
        rowHeight={50}
        scrollable
        minContentWidth={700}
        query={mockQuery as any}
        items={products}
        columns={columns}
        totalItems={products.length}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("projects.detail.products.noProducts")}
      />
    </div>
  );
};

interface OnChainRow {
  type: string;
  kind: "pool" | "drep" | "policy" | "asset";
  name: string;
  id: string;
  description: string;
}

const onChainTableOptions = [
  { key: "type", name: "onchain_type" },
  { key: "name", name: "onchain_name" },
  { key: "description", name: "onchain_description" },
];

const OnChainTab: FC<{ project: ProjectDetail }> = ({ project }) => {
  const { t } = useAppTranslation();
  const {
    columnsVisibility,
    rows,
    columnsOrder,
    setColumnVisibility,
    setRows,
    setColumsOrder,
  } = useProjectOnChainTableStore()();

  const items = useMemo(() => {
    const result: OnChainRow[] = [];

    if (project.pools?.length) {
      for (const poolId of project.pools) {
        result.push({
          type: t("projects.detail.onChain.pools"),
          kind: "pool",
          name: "",
          id: poolId,
          description: "",
        });
      }
    }

    if (project.drep?.drep_id) {
      result.push({
        type: t("projects.detail.onChain.drep"),
        kind: "drep",
        name: project.drep.name,
        id: project.drep.drep_id,
        description: "",
      });
    }

    if (project.policy?.length) {
      for (const pol of project.policy) {
        if (!pol.policy_id) continue;
        result.push({
          type: t("projects.detail.onChain.policies"),
          kind: "policy",
          name: pol.policy_name,
          id: pol.policy_id,
          description: pol.description,
        });
      }
    }

    if (project.assets?.length) {
      for (const asset of project.assets) {
        if (!asset.asset_id) continue;
        result.push({
          type: t("projects.detail.onChain.assets"),
          kind: "asset",
          name: asset.asset_name,
          id: asset.asset_id,
          description: asset.description,
        });
      }
    }

    return result;
  }, [project, t]);

  const columns = useMemo(
    () =>
      [
        {
          key: "type",
          title: <p>{t("tableSettings.onchain_type")}</p>,
          visible: columnsVisibility.type,
          widthPx: 100,
          render: (item: OnChainRow) => (
            <Badge color='blue'>{item.type}</Badge>
          ),
        },
        {
          key: "name",
          title: <p>{t("tableSettings.onchain_name")}</p>,
          visible: columnsVisibility.name,
          widthPx: 300,
          render: (item: OnChainRow) => {
            const linkTo =
              item.kind === "pool"
                ? `/pool/${item.id}`
                : item.kind === "drep"
                  ? `/drep/${item.id}`
                  : item.kind === "policy"
                    ? `/policy/${item.id}`
                    : `/asset/${item.id}`;

            return (
              <div className='flex flex-col'>
                {item.name && (
                  <Link to={linkTo} className='font-semibold text-primary'>
                    {item.name}
                  </Link>
                )}
                {item.id && (
                  <div className='flex items-center gap-1'>
                    <Link to={linkTo} className='text-primary'>
                      {formatString(item.id, "short")}
                    </Link>
                    <Copy copyText={item.id} size={13} />
                  </div>
                )}
              </div>
            );
          },
        },
        {
          key: "description",
          title: <p>{t("tableSettings.onchain_description")}</p>,
          visible: columnsVisibility.description,
          widthPx: 350,
          render: (item: OnChainRow) => item.description || "-",
        },
      ].sort(
        (a, b) =>
          columnsOrder.indexOf(
            a.key as keyof ProjectOnChainTableColumns,
          ) -
          columnsOrder.indexOf(
            b.key as keyof ProjectOnChainTableColumns,
          ),
      ),
    [t, columnsVisibility, columnsOrder],
  );

  const mockQuery = useMemo(() => createMockQuery(items), [items]);

  return (
    <div className='py-2'>
      <div className='mb-2 flex items-center gap-2'>
        <p className='text-text-md font-semibold'>
          {items.length}{" "}
          {t("projects.detail.tabs.onChainAssociations").toLowerCase()}
        </p>
        <div className='ml-auto shrink-0'>
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            rowsLabel={t("table.rows")}
            columnsOptions={onChainTableOptions.map(item => ({
              label: t(`tableSettings.${item.name}`),
              isVisible:
                columnsVisibility[
                  item.key as keyof typeof columnsVisibility
                ],
              onClick: () =>
                setColumnVisibility(
                  item.key,
                  !columnsVisibility[
                    item.key as keyof typeof columnsVisibility
                  ],
                ),
            }))}
          />
        </div>
      </div>
      <GlobalTable
        type='default'
        itemsPerPage={rows}
        pagination
        rowHeight={70}
        scrollable
        minContentWidth={700}
        query={mockQuery as any}
        items={items}
        columns={columns}
        totalItems={items.length}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("projects.detail.onChain.noAssets")}
      />
    </div>
  );
};
