import type { FC } from "react";
import { useMemo, useState } from "react";

import ReactECharts from "echarts-for-react";
import { ChevronsUpDown } from "lucide-react";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import type { ProjectInsight } from "@/types/projectTypes";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DevelopmentActivityGraphProps {
  insights: ProjectInsight[];
  allReposLabel?: string;
}

const PERIOD_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "1 year" },
];

export const DevelopmentActivityGraph: FC<DevelopmentActivityGraphProps> = ({
  insights,
  allReposLabel,
}) => {
  const { t } = useAppTranslation();
  const { bgColor, textColor, splitLineColor, lineColor } = useGraphColors();

  const [period, setPeriod] = useState(30);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [repoOpen, setRepoOpen] = useState(false);

  const repoNames = useMemo(
    () =>
      insights
        .filter(i => i.repo_name && Array.isArray(i.stats))
        .map(i => i.repo_name),
    [insights],
  );

  const { dates, commitsByDate, repoCommitTotals, totalCommits, activeRepos } =
    useMemo(() => {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - period);
      const cutoffStr = cutoff.toISOString().split("T")[0];

      const validInsights = insights.filter(
        i => i.repo_name && Array.isArray(i.stats),
      );
      const relevantInsights = selectedRepo
        ? validInsights.filter(i => i.repo_name === selectedRepo)
        : validInsights;

      const dateMap = new Map<string, number>();
      const repoTotals = new Map<string, number>();

      for (const insight of relevantInsights) {
        let repoTotal = 0;
        for (const stat of insight.stats) {
          if (stat.date >= cutoffStr) {
            dateMap.set(
              stat.date,
              (dateMap.get(stat.date) ?? 0) + stat.commits,
            );
            repoTotal += stat.commits;
          }
        }
        repoTotals.set(insight.repo_name, repoTotal);
      }

      const sortedDates = Array.from(dateMap.keys()).sort();
      const commitValues = sortedDates.map(d => dateMap.get(d) ?? 0);

      const sortedRepos = Array.from(repoTotals.entries())
        .sort((a, b) => b[1] - a[1]);

      const total = commitValues.reduce((sum, c) => sum + c, 0);
      const active = relevantInsights.filter(i =>
        i.stats.some(s => s.date >= cutoffStr && s.commits > 0),
      ).length;

      return {
        dates: sortedDates,
        commitsByDate: commitValues,
        repoCommitTotals: sortedRepos,
        totalCommits: total,
        activeRepos: active,
      };
    }, [insights, period, selectedRepo]);

  const chartOption = useMemo(
    () => ({
      grid: {
        left: 50,
        right: 20,
        top: 10,
        bottom: 30,
      },
      tooltip: {
        trigger: "axis" as const,
        backgroundColor: bgColor,
        textStyle: { color: textColor, fontSize: 12 },
        borderColor: lineColor,
        borderWidth: 1,
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>${t("projects.activity.commits")}: <b>${point.value}</b>`;
        },
      },
      xAxis: {
        type: "category" as const,
        boundaryGap: false,
        data: dates,
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (value: string) => {
            const d = new Date(value);
            return d.toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            });
          },
        },
        axisLine: { lineStyle: { color: splitLineColor } },
      },
      yAxis: {
        type: "value" as const,
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLabel: { color: textColor, fontSize: 11 },
      },
      series: [
        {
          data: commitsByDate,
          type: "line",
          smooth: 0.3,
          symbol: "none",
          lineStyle: { color: lineColor, width: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: lineColor + "66" },
                { offset: 1, color: lineColor + "0A" },
              ],
            },
          },
        },
      ],
    }),
    [dates, commitsByDate, bgColor, textColor, splitLineColor, lineColor, t],
  );

  const hasData = repoNames.length > 0 && dates.length > 0;
  if (insights.length === 0 || !hasData) return null;

  return (
    <div className='rounded-m border border-border bg-cardBg p-2'>
      <div className='mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
        <div>
          <h3 className='text-text-md font-semibold'>
            {t("projects.activity.title")}
          </h3>
          <div className='flex gap-3 text-text-sm text-grayTextPrimary'>
            <span>
              {t("projects.activity.totalCommits")}{" "}
              <strong className='text-text'>
                {formatNumber(totalCommits)}
              </strong>
            </span>
            <span>
              {t("projects.activity.activeRepositories")}{" "}
              <strong className='text-text'>
                {formatNumber(activeRepos)}
              </strong>
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <DropdownSelect
            open={periodOpen}
            setOpen={setPeriodOpen}
            label={
              PERIOD_OPTIONS.find(o => o.value === period)?.label ?? ""
            }
            options={PERIOD_OPTIONS.map(o => ({
              label: o.label,
              value: o.value,
              selected: o.value === period,
            }))}
            onSelect={val => setPeriod(val as number)}
          />
          <DropdownSelect
            open={repoOpen}
            setOpen={setRepoOpen}
            label={selectedRepo ?? (allReposLabel ?? t("projects.activity.organization"))}
            options={[
              {
                label: (allReposLabel ?? t("projects.activity.organization")),
                value: null,
                selected: selectedRepo === null,
              },
              ...repoNames.map(name => ({
                label: name,
                value: name,
                selected: name === selectedRepo,
              })),
            ]}
            onSelect={val => setSelectedRepo(val as string | null)}
          />
        </div>
      </div>

      <div className='flex flex-col gap-2 md:flex-row'>
        {repoCommitTotals.length > 0 && (
          <div className='thin-scrollbar flex max-h-[250px] w-full flex-col overflow-y-auto md:w-[220px]'>
            {repoCommitTotals.map(([name, commits], idx) => (
              <div
                key={name}
                className='flex items-center justify-between border-b border-border px-1 py-1 text-text-sm last:border-b-0'
              >
                <span className='truncate'>
                  <span className='text-grayTextPrimary'>{idx + 1}.</span>{" "}
                  {name}
                </span>
                <span className='shrink-0 font-semibold'>
                  {formatNumber(commits)}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className='min-h-[250px] flex-1'>
          <ReactECharts
            option={chartOption}
            style={{ width: "100%", height: "250px" }}
            opts={{ renderer: "canvas" }}
          />
        </div>
      </div>
    </div>
  );
};

interface DropdownOption {
  label: string;
  value: string | number | null;
  selected: boolean;
}

interface DropdownSelectProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  options: DropdownOption[];
  onSelect: (value: string | number | null) => void;
}

const DropdownSelect: FC<DropdownSelectProps> = ({
  open,
  setOpen,
  label,
  options,
  onSelect,
}) => {
  return (
    <div className='relative'>
      <div
        onClick={() => setOpen(!open)}
        className='flex min-h-[34px] cursor-pointer items-center gap-1 rounded-m border border-border bg-background px-2 text-text-sm text-text hover:bg-cardBg'
      >
        <span className='truncate'>{label}</span>
        <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
      </div>
      {open && (
        <div className='absolute right-0 z-50 mt-1 min-w-[160px] overflow-hidden rounded-m border border-border bg-background shadow-md'>
          {options.map(opt => (
            <div
              key={String(opt.value)}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-2 py-1 text-text-sm hover:bg-cardBg ${
                opt.selected ? "font-semibold text-primary" : "text-text"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
