import type { FC } from "react";
import type { TxInfo } from "@/types/txTypes";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useCallback, useMemo, useRef } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useNavigate } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useADADisplay } from "@/hooks/useADADisplay";
import { truncateAddress } from "@/utils/address/truncateAddress";

interface TxSankeyDiagramProps {
  inputs: TxInfo[];
  outputs: TxInfo[];
  className?: string;
}

export const TxSankeyDiagram: FC<TxSankeyDiagramProps> = ({
  inputs,
  outputs,
  className,
}) => {
  const { t } = useAppTranslation("common");
  const { textColor, bgColor, splitLineColor } = useGraphColors();
  const { formatLovelace } = useADADisplay();
  const navigate = useNavigate();
  const chartRef = useRef<ReactEcharts>(null);

  const handleChartClick = useCallback(
    (params: any) => {
      if (params.dataType === "node") {
        const name = params.data?.name || "";
        const address = name.replace(/^(in|out)-/, "");

        if (address.startsWith("addr")) {
          navigate({ to: "/address/$address", params: { address: address } });
        }
      }
    },
    [navigate],
  );

  const { nodes, links } = useMemo(() => {
    const nodeSet = new Set<string>();
    const linkMap = new Map<string, number>();

    const inputsByAddr = new Map<string, number>();
    inputs.forEach(input => {
      const addr = input.payment_addr_bech32;
      const current = inputsByAddr.get(addr) || 0;
      inputsByAddr.set(addr, current + input.value);
    });

    const outputsByAddr = new Map<string, number>();
    outputs.forEach(output => {
      const addr = output.payment_addr_bech32;
      const current = outputsByAddr.get(addr) || 0;
      outputsByAddr.set(addr, current + output.value);
    });

    inputsByAddr.forEach((_value, addr) => {
      const nodeId = `in-${addr}`;
      nodeSet.add(nodeId);
    });

    outputsByAddr.forEach((_value, addr) => {
      const nodeId = `out-${addr}`;
      nodeSet.add(nodeId);
    });

    inputsByAddr.forEach((inputValue, inputAddr) => {
      if (outputsByAddr.has(inputAddr)) {
        const outputValue = outputsByAddr.get(inputAddr) || 0;
        const flowValue = Math.min(inputValue, outputValue);
        const linkKey = `in-${inputAddr}->out-${inputAddr}`;
        linkMap.set(linkKey, flowValue);
      }
    });

    inputsByAddr.forEach((inputValue, inputAddr) => {
      let remainingInput = inputValue;

      if (outputsByAddr.has(inputAddr)) {
        const directFlow = Math.min(
          inputValue,
          outputsByAddr.get(inputAddr) || 0,
        );
        remainingInput -= directFlow;
      }

      if (remainingInput > 0) {
        const totalOtherOutputs = Array.from(outputsByAddr.entries())
          .filter(([addr]) => addr !== inputAddr)
          .reduce((sum, [, val]) => sum + val, 0);

        if (totalOtherOutputs > 0) {
          outputsByAddr.forEach((outputValue, outputAddr) => {
            if (outputAddr !== inputAddr) {
              const proportion = outputValue / totalOtherOutputs;
              const flowValue = Math.round(remainingInput * proportion);
              if (flowValue > 0) {
                const linkKey = `in-${inputAddr}->out-${outputAddr}`;
                const existing = linkMap.get(linkKey) || 0;
                linkMap.set(linkKey, existing + flowValue);
              }
            }
          });
        }
      }
    });

    const sankeyNodes = Array.from(nodeSet).map(id => ({
      name: id,
    }));

    const linkValues = Array.from(linkMap.values());
    const maxLinkValue = linkValues.length > 0 ? Math.max(...linkValues) : 0;
    const minLinkValue = maxLinkValue * 0.02;

    const sankeyLinks = Array.from(linkMap.entries()).map(
      ([key, actualValue]) => {
        const [source, target] = key.split("->") as [string, string];
        return {
          source,
          target,
          value: Math.max(actualValue, minLinkValue),
          actualValue,
        };
      },
    );

    return { nodes: sankeyNodes, links: sankeyLinks };
  }, [inputs, outputs]);

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0,
        textStyle: {
          color: textColor,
        },
        confine: true,
        formatter: (params: any) => {
          const inputColor = "#EF4444";
          const outputColor = "#10B981";

          if (params.dataType === "edge") {
            const { source, target, actualValue } = params.data;
            const sourceAddr = source.replace(/^(in|out)-/, "");
            const targetAddr = target.replace(/^(in|out)-/, "");
            return [
              `<div style="background: linear-gradient(to right, ${inputColor}, ${outputColor}); padding: 2px; border-radius: 6px;">`,
              `<div style="background: ${bgColor}; border-radius: 4px; padding: 8px;">`,
              `<div style="font-weight: 600; margin-bottom: 6px;">${t("tx.overview.flow")}</div>`,
              `<div style="margin-bottom: 4px;">${t("tx.overview.from")}: ${truncateAddress(sourceAddr)}</div>`,
              `<div style="margin-bottom: 4px;">${t("tx.overview.to")}: ${truncateAddress(targetAddr)}</div>`,
              `<div style="display:flex; justify-content:space-between; gap:12px;">` +
                `<span>${t("tx.overview.value")}:</span><span style="font-weight:600;">${formatLovelace(actualValue)}</span>` +
                `</div>`,
              `</div>`,
              `</div>`,
            ].join("");
          }

          const name = params.data?.name || "";
          const isInput = name.startsWith("in-");
          const address = name.replace(/^(in|out)-/, "");
          const type = isInput ? t("tx.inputs") : t("tx.outputs");
          const borderColor = isInput ? inputColor : outputColor;

          return [
            `<div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 4px; padding: 8px;">`,
            `<div style="font-weight: 600; margin-bottom: 6px;">${type}</div>`,
            `<div style="margin-bottom: 4px;">${truncateAddress(address)}</div>`,
            `<div style="display:flex; justify-content:space-between; gap:12px;">` +
              `<span>${t("tx.total")}:</span><span style="font-weight:600;">${formatLovelace(params.value)}</span>` +
              `</div>`,
            `</div>`,
          ].join("");
        },
      },
      series: [
        {
          type: "sankey",
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          data: nodes.map(node => {
            const isOutput = node.name.startsWith("out-");
            return {
              ...node,
              itemStyle: {
                color: node.name.startsWith("in-") ? "#EF4444" : "#10B981",
                borderColor: splitLineColor,
                borderWidth: 0.5,
              },
              label: isOutput ? { position: "left" } : undefined,
            };
          }),
          links: links,
          nodeAlign: "justify",
          nodeWidth: 15,
          nodeGap: 12,
          nodeMinHeight: 5,
          draggable: false,
          emphasis: {
            focus: "adjacency",
          },
          lineStyle: {
            color: "gradient",
            curveness: 0.5,
            opacity: 0.4,
          },
          label: {
            color: textColor,
            fontSize: 12,
            formatter: (params: any) => {
              const name = params.name || "";
              const address = name.replace(/^(in|out)-/, "");
              return truncateAddress(address);
            },
          },
          labelLayout: {
            hideOverlap: true,
          },
        },
      ],
    }),
    [bgColor, formatLovelace, links, nodes, splitLineColor, t, textColor],
  );

  if (nodes.length === 0) {
    return (
      <div
        className={`relative flex h-[400px] items-center justify-center ${className ?? ""}`}
      >
        <span className='text-grayTextSecondary'>
          {t("tx.overview.noData")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative mt-2 h-[400px] w-full overflow-hidden rounded-l border border-border md:h-[600px] ${className ?? ""}`}
    >
      <GraphWatermark className='opacity-10' />
      <ReactEcharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%", cursor: "pointer" }}
        notMerge={true}
        lazyUpdate={true}
        onEvents={{ click: handleChartClick }}
      />
    </div>
  );
};
