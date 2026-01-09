import type { FC } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { SankeyLink, SankeyNode } from "@/types/treasuryTypes";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import {
  BUDGET_NODE_ID,
  HIDE_NODE_LABELS,
  TAU_NODE_ID,
} from "@/constants/treasury";

import {
  formatAda,
  formatPercent,
  getDisplayName,
  getLinkColor,
  getNodeColor,
  isDonationLink,
  isRewardsToStakingLink,
  isRewardsToTreasuryLink,
} from "@/utils/treasury/sankeyDiagram";

import { useMemo } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";

interface SankeyDiagramProps {
  nodes: Readonly<SankeyNode[]>;
  links: Readonly<SankeyLink[]>;
  className?: string;
}

export const SankeyDiagram: FC<SankeyDiagramProps> = ({
  nodes,
  links,
  className,
}) => {
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
            parent && parentTotal && parentTotal > 0
              ? (incoming / parentTotal) * 100
              : null;
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

  return (
    <div className={`relative w-full ${className ?? ""}`}>
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
