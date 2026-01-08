import { useMemo } from "react";
import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

export type SankeyNode = {
  id: string;
};

export type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

type SankeyDiagramProps = {
  nodes: ReadonlyArray<SankeyNode>;
  links: ReadonlyArray<SankeyLink>;
  className?: string;
};

const TAU_NODE_ID = "Treasury via τ (2025)";
const BUDGET_NODE_ID = "Budget Expenditures (2025)";
const REWARDS_POT_NODE_ID = "Rewards pot (2025)";
const STAKING_REWARDS_NODE_ID = "Staking rewards (2025)";
const TREASURY_NODE_ID = "Treasury (2025)";
const SPENT_NODE_ID = "Spent (Withdrawn) (2025)";
const ALLOCATED_NODE_ID = "Allocated (Active/Matured/Paused) (2025)";

const INCOME_NODES = new Set([
  "Reserve emissions (2025)",
  "Fee revenue (2025)",
  "Treasury donations (2025)",
]);

const COLORS = {
  income: "#16a34a",
  neutral: "#9ca3af",
  expenditure: "#ef4444",
  loan: "#3b82f6",
};

const isIncomeNode = (name: string) => INCOME_NODES.has(name);

const isExpenditureNode = (name: string) =>
  name.includes("Budget Expenditures") ||
  name.includes("Staking rewards") ||
  name.includes("Spent (Withdrawn)") ||
  name.includes("Allocated (Active/Matured/Paused)") ||
  name.includes("(Withdrawn 2025)") ||
  name.includes("(Allocated 2025)");

const isLoanNode = (name: string) =>
  name.includes("Loans (2025)") || name.includes("(Loan 2025)");

const isDonationLink = (link: SankeyLink) =>
  link.source === "Treasury donations (2025)" &&
  link.target === "Treasury (2025)";

const isRewardsToStakingLink = (link: SankeyLink) =>
  link.source === REWARDS_POT_NODE_ID &&
  link.target === STAKING_REWARDS_NODE_ID;

const isRewardsToTreasuryLink = (link: SankeyLink) =>
  link.source === REWARDS_POT_NODE_ID && link.target === TREASURY_NODE_ID;

const isTreasuryToSpentLink = (link: SankeyLink) =>
  link.source === TREASURY_NODE_ID && link.target === SPENT_NODE_ID;

const isTreasuryToAllocatedLink = (link: SankeyLink) =>
  link.source === TREASURY_NODE_ID && link.target === ALLOCATED_NODE_ID;

const HIDE_NODE_LABELS = new Set([
  REWARDS_POT_NODE_ID,
  STAKING_REWARDS_NODE_ID,
  TREASURY_NODE_ID,
]);

const LABEL_OVERRIDES: Record<string, string> = {
  [TREASURY_NODE_ID]: "Treasury Flows",
  [SPENT_NODE_ID]: "Budget Spent",
  [ALLOCATED_NODE_ID]: "Budget Allocations",
  ["Loans (2025)"]: "Budget Loans",
};

const stripYear = (label: string) =>
  label
    .replace(/\s*2025(?=\))/g, "")
    .replace(/\s*\(2025\)/g, "")
    .replace(/\s*\((Withdrawn|Allocated|Loan)\)/g, "")
    .replace(/\s*\(\s*\)/g, "")
    .replace(/\s+\)/g, ")")
    .replace(/\s{2,}/g, " ")
    .trim();

const getDisplayName = (label: string) =>
  LABEL_OVERRIDES[label] ?? stripYear(label);

const getNodeColor = (name: string) => {
  if (isLoanNode(name)) {
    return COLORS.loan;
  }
  if (isExpenditureNode(name)) {
    return COLORS.expenditure;
  }
  if (isIncomeNode(name)) {
    return COLORS.income;
  }
  return COLORS.neutral;
};

const getLinkColor = (source: string, target: string) => {
  if (isLoanNode(target) || isLoanNode(source)) {
    return COLORS.loan;
  }
  if (isExpenditureNode(target) || isExpenditureNode(source)) {
    return COLORS.expenditure;
  }
  if (isIncomeNode(source)) {
    return COLORS.income;
  }
  return COLORS.neutral;
};

const formatAda = (value: number) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ADA`;

const formatPercent = (value: number) => {
  if (value > 0 && value < 0.1) {
    return "<0.1%";
  }
  return `${value.toFixed(1)}%`;
};

export const SankeyDiagram = ({
  nodes,
  links,
  className,
}: SankeyDiagramProps) => {
  const { textColor, bgColor, splitLineColor } = useGraphColors();

  const { displayNodes, displayLinks } = useMemo(() => {
    const collapseNode = (
      currentNodes: ReadonlyArray<SankeyNode>,
      currentLinks: ReadonlyArray<SankeyLink>,
      nodeId: string,
    ) => {
      const incoming = currentLinks.filter(link => link.target === nodeId);
      const outgoing = currentLinks.filter(link => link.source === nodeId);
      const nextNodes = currentNodes.filter(node => node.id !== nodeId);
      const nextLinks = currentLinks.filter(
        link => link.source !== nodeId && link.target !== nodeId,
      );

      if (incoming.length === 1 && outgoing.length >= 1) {
        outgoing.forEach(link => {
          nextLinks.push({
            source: incoming[0].source,
            target: link.target,
            value: link.value,
          });
        });
      } else if (incoming.length >= 1 && outgoing.length === 1) {
        incoming.forEach(link => {
          nextLinks.push({
            source: link.source,
            target: outgoing[0].target,
            value: link.value,
          });
        });
      }

      return { nodes: nextNodes, links: nextLinks };
    };

    const afterTau = collapseNode(nodes, links, TAU_NODE_ID);
    const afterBudget = collapseNode(
      afterTau.nodes,
      afterTau.links,
      BUDGET_NODE_ID,
    );

    return {
      displayNodes: afterBudget.nodes,
      displayLinks: afterBudget.links,
    };
  }, [links, nodes]);

  const { incomingTotals, outgoingTotals, singleParent } = useMemo(() => {
    const incoming = new Map<string, number>();
    const outgoing = new Map<string, number>();
    const parentMap = new Map<string, string | null>();

    displayLinks.forEach(link => {
      outgoing.set(link.source, (outgoing.get(link.source) ?? 0) + link.value);
      incoming.set(link.target, (incoming.get(link.target) ?? 0) + link.value);

      if (!parentMap.has(link.target)) {
        parentMap.set(link.target, link.source);
      } else {
        parentMap.set(link.target, null);
      }
    });

    return {
      incomingTotals: incoming,
      outgoingTotals: outgoing,
      singleParent: parentMap,
    };
  }, [displayLinks]);

  const { chartNodes, chartLinks } = useMemo(() => {
    const mappedNodes = displayNodes.map(node => ({
      name: node.id,
      itemStyle: {
        color: getNodeColor(node.id),
        borderColor: splitLineColor,
        borderWidth: 0.5,
      },
      label: HIDE_NODE_LABELS.has(node.id) ? { show: false } : undefined,
    }));

    const mappedLinks = displayLinks.map(link => {
      const baseLink = {
        source: link.source,
        target: link.target,
        value: link.value,
        lineStyle: {
          color: getLinkColor(link.source, link.target),
        },
      };

      if (isRewardsToStakingLink(link)) {
        return {
          ...baseLink,
          edgeLabel: {
            show: true,
            color: textColor,
            fontSize: 11,
            formatter: () => "Staking Rewards",
          },
        };
      }

      if (isRewardsToTreasuryLink(link)) {
        return {
          ...baseLink,
          edgeLabel: {
            show: true,
            color: textColor,
            fontSize: 11,
            formatter: () => "Treasury Cut",
          },
        };
      }

      if (isDonationLink(link)) {
        return {
          ...baseLink,
          edgeLabel: {
            show: true,
            color: textColor,
            fontSize: 11,
            formatter: () => "Treasury donations",
          },
        };
      }

      return baseLink;
    });

    return {
      chartNodes: mappedNodes,
      chartLinks: mappedLinks,
    };
  }, [displayLinks, displayNodes, splitLineColor, textColor]);

  const option: ReactEChartsProps["option"] = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: bgColor,
        borderColor: splitLineColor,
        textStyle: {
          color: textColor,
        },
        confine: true,
        formatter: (params: any) => {
          if (params.dataType === "edge") {
            const { source, target, value } = params.data;
            const sourceTotal = outgoingTotals.get(source) ?? 0;
            const percent =
              sourceTotal > 0 ? (value / sourceTotal) * 100 : null;
            const displaySource = getDisplayName(source);
            const displayTarget = getDisplayName(target);

            return [
              `<div style="font-weight: 600; margin-bottom: 6px;">${displaySource} -> ${displayTarget}</div>`,
              `<div style="display:flex; justify-content:space-between; gap:12px;">` +
                `<span>Value:</span><span style="font-weight:600;">${formatAda(value)}</span>` +
                `</div>`,
              percent !== null
                ? `<div style="display:flex; justify-content:space-between; gap:12px;">` +
                    `<span>Share of ${displaySource}:</span><span style="font-weight:600;">${formatPercent(percent)}</span>` +
                    `</div>`
                : "",
            ].join("");
          }

          const name = params.data?.name;
          const incoming = incomingTotals.get(name) ?? 0;
          const outgoing = outgoingTotals.get(name) ?? 0;
          const total = Math.max(incoming, outgoing);
          const parent = singleParent.get(name);
          const parentTotal =
            parent && outgoingTotals.get(parent)
              ? outgoingTotals.get(parent)
              : 0;
          const parentPercent =
            parent && parentTotal > 0 ? (incoming / parentTotal) * 100 : null;
          const displayName = getDisplayName(name ?? "");
          const displayParent = parent ? getDisplayName(parent) : "";

          return [
            `<div style="font-weight: 600; margin-bottom: 6px;">${displayName}</div>`,
            `<div style="display:flex; justify-content:space-between; gap:12px;">` +
              `<span>Total:</span><span style="font-weight:600;">${formatAda(total)}</span>` +
              `</div>`,
            parentPercent !== null
              ? `<div style="display:flex; justify-content:space-between; gap:12px;">` +
                  `<span>Share of ${displayParent}:</span><span style="font-weight:600;">${formatPercent(parentPercent)}</span>` +
                  `</div>`
              : "",
          ].join("");
        },
      },
      series: [
        {
          type: "sankey",
          left: 20,
          right: 520,
          data: chartNodes,
          links: chartLinks,
          nodeAlign: "left",
          nodeWidth: 12,
          nodeGap: 8,
          draggable: false,
          emphasis: {
            focus: "adjacency",
          },
          lineStyle: {
            curveness: 0.5,
            opacity: 0.4,
          },
          label: {
            color: textColor,
            fontSize: 11,
            formatter: (params: any) => getDisplayName(params.name ?? ""),
          },
          labelLayout: {
            hideOverlap: true,
          },
        },
      ],
    }),
    [
      bgColor,
      chartLinks,
      chartNodes,
      incomingTotals,
      outgoingTotals,
      singleParent,
      splitLineColor,
      textColor,
    ],
  );

  const containerClassName = `relative w-full ${className ?? ""}`.trim();

  return (
    <div className={containerClassName}>
      <GraphWatermark />
      <ReactEcharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};
