import TxAssetLink from "@/components/asset/AssetLink";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import SortBy from "@/components/ui/sortBy";
import { colors } from "@/constants/colors";
import { useFetchTxDetail } from "@/services/tx";
import { useThemeStore } from "@/stores/themeStore";
import { useTxSortStore } from "@/stores/tx/txSortStore";
import type { TxInfo } from "@/types/txTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { getRouteApi } from "@tanstack/react-router";
import type { Edge, Node, Position } from "@xyflow/react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Lock, LucideLockOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddressWithTxBadges } from "../AddressWithTxBadges";

const selectItems = [
  {
    key: "value",
    value: "Value",
  },
  {
    key: "index",
    value: "Index",
  },
];

const OverviewTabItem = () => {
  const [uniqueInputs, setUniqueInputs] = useState<TxInfo[]>([]);
  const [uniqueOutputs, setUniqueOutputs] = useState<TxInfo[]>([]);
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const { theme } = useThemeStore();
  const [disabledControls, setDisabledControls] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const { sort, setSort } = useTxSortStore();
  const query = useFetchTxDetail(hash);
  const data = query.data?.data;

  const getStakeAddr = (address: string) => {
    if (!isValidAddress(address)) {
      return address;
    }

    return Address.from(address).rewardAddress;
  };

  const getPreviousAssetLength = (index: number, arr: TxInfo[]): number => {
    if (index === 0) return 0;

    const prevItem = arr[index - 1];

    if (prevItem.asset && !prevItem.asset.length) return 0;

    if (!prevItem?.asset) return 0;

    if (!Array.isArray(arr[index - 1 < 0 ? 0 : index - 1]?.asset)) return 1;

    return prevItem?.asset?.length ?? 0;
  };

  useEffect(() => {
    const tempInputs = [...(data?.all_inputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );
    const tempOutputs = [...(data?.all_outputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );

    setUniqueInputs(tempInputs);
    setUniqueOutputs(tempOutputs);
  }, [sort, data]);

  const stakeAddrToInputNodeIds = new Map();
  const stakeAddrToOutputNodeIds = new Map();

  let currentYPosition = 0;
  let cumulativeYOffset = 0;

  const stakeAddrToHueRotation = new Map<string, number>();

  const inputNodes: Node[] =
    uniqueInputs?.map((input, index) => {
      const stakeAddr = getStakeAddr(input.payment_addr_bech32);
      const nodeId = `input-${stakeAddr}-${index}`;
      if (!stakeAddrToInputNodeIds.has(stakeAddr)) {
        stakeAddrToInputNodeIds.set(stakeAddr, []);
      }
      stakeAddrToInputNodeIds.get(stakeAddr).push(nodeId);

      const previousAssetLength = getPreviousAssetLength(index, uniqueInputs);
      cumulativeYOffset +=
        previousAssetLength === 0
          ? 0
          : previousAssetLength < 5
            ? 25
            : Math.floor(previousAssetLength / 5) * 49;

      let hueRotation = stakeAddrToHueRotation.get(stakeAddr) || 0;
      if (!stakeAddrToHueRotation.has(stakeAddr)) {
        hueRotation = stakeAddrToHueRotation.size * 30;
        stakeAddrToHueRotation.set(stakeAddr, hueRotation);
      }

      const node = {
        id: nodeId,
        position: {
          x: -100 - Math.min(5, input.asset?.length || 1) * 80,
          y: currentYPosition + cumulativeYOffset,
        },
        data: { label: <NodeContent data={input} type='input' /> },
        width: 300 + Math.min(5, input.asset?.length || 1) * 80,
        targetPosition: "right" as Position,
        sourcePosition: "right" as Position,
        style: {
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          filter: `hue-rotate(${hueRotation}deg)`,
          opacity: 0.85,
          boxShadow: "none",
        },
      };

      currentYPosition += 100;

      return node;
    }) || [];

  currentYPosition = 0;
  cumulativeYOffset = 0;

  const outputNodes: Node[] =
    uniqueOutputs?.map((output, index) => {
      const stakeAddr = getStakeAddr(output.payment_addr_bech32);
      const nodeId = `output-${stakeAddr}-${index}`;
      if (!stakeAddrToOutputNodeIds.has(stakeAddr)) {
        stakeAddrToOutputNodeIds.set(stakeAddr, []);
      }
      stakeAddrToOutputNodeIds.get(stakeAddr).push(nodeId);

      const previousAssetLength = getPreviousAssetLength(index, uniqueOutputs);
      cumulativeYOffset +=
        previousAssetLength === 0
          ? 0
          : previousAssetLength < 5
            ? 25
            : Math.floor(previousAssetLength / 5) * 49;

      let hueRotation = stakeAddrToHueRotation.get(stakeAddr) || 0;
      if (!stakeAddrToHueRotation.has(stakeAddr)) {
        hueRotation = stakeAddrToHueRotation.size * 30;
        stakeAddrToHueRotation.set(stakeAddr, hueRotation);
      }

      const node = {
        id: nodeId,
        position: {
          x: 350,
          y: currentYPosition + cumulativeYOffset,
        },
        data: { label: <NodeContent data={output} type='output' /> },
        width: 300 + Math.min(5, output.asset?.length || 1) * 80,
        targetPosition: "left" as Position,
        sourcePosition: "left" as Position,
        style: {
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          filter: `hue-rotate(${hueRotation}deg)`,
          opacity: 0.85,
          boxShadow: "none",
        },
      };

      currentYPosition += 100;

      return node;
    }) || [];

  const edges: Edge[] = [];

  stakeAddrToInputNodeIds.forEach((inputIds, stakeAddr) => {
    const outputIds = stakeAddrToOutputNodeIds.get(stakeAddr);
    if (!stakeAddr || !outputIds) return;

    const pairCount = Math.min(inputIds.length, outputIds.length);
    for (let i = 0; i < pairCount; i++) {
      edges.push({
        id: `edge-${inputIds[i]}-${outputIds[i]}`,
        source: inputIds[i],
        target: outputIds[i],
        style: {
          stroke: theme === "dark" ? "#79defd5e" : "#0094d44c",
          strokeWidth: 4,
        },
      });
    }
  });

  const nodes = [...inputNodes, ...outputNodes];

  useEffect(() => {
    if (interacted) {
      setTimeout(() => {
        setInteracted(false);
      }, 1500);
    }
  }, [interacted]);

  return (
    <>
      <SortBy
        selectItems={selectItems}
        setSelectedItem={setSort as any}
        selectedItem={sort}
        className='mb-2 ml-auto w-fit'
      />
      {query.isLoading ? (
        <div className='relative flex h-[300px] w-full items-center justify-center rounded-l border border-border p-3 md:h-[600px]'>
          <GraphWatermark className='opacity-10' />
          <div
            className={`flex h-20 w-20 shrink-0 grow-0 animate-spin rounded-max border-[8px] border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]`}
            role='status'
          ></div>
        </div>
      ) : (
        <div
          className='relative h-[300px] max-w-desktop md:h-[600px] md:w-full'
          onDrag={() => setInteracted(true)}
          onWheel={() => setInteracted(true)}
          onMouseDown={() => setInteracted(true)}
        >
          <ReactFlowProvider>
            <ReactFlow
              style={{ background: colors.background }}
              className='overflow-visible rounded-l border border-border'
              height={400}
              width={800}
              nodes={nodes}
              edges={edges}
              colorMode={theme === "dark" ? "dark" : "light"}
              edgesFocusable={!disabledControls}
              nodesDraggable={!disabledControls}
              nodesConnectable={!disabledControls}
              zoomOnScroll={!disabledControls}
              zoomOnPinch={!disabledControls}
              zoomOnDoubleClick={!disabledControls}
              panOnDrag={!disabledControls}
              draggable={!disabledControls}
              elementsSelectable={false}
            >
              <ViewportSetter nodes={nodes} />
              <button
                onClick={() => setDisabledControls(!disabledControls)}
                className={`absolute bottom-3 left-1/2 z-50 flex origin-center duration-150 ${disabledControls && interacted ? "border-text" : ""} shadow -translate-x-1/2 items-center gap-1/2 rounded-max border border-border bg-background px-1.5 py-1/2 text-text-sm font-medium`}
              >
                {disabledControls ? (
                  <LucideLockOpen size={15} />
                ) : (
                  <Lock size={15} />
                )}{" "}
                {disabledControls
                  ? "Unlock interactivity"
                  : "Lock interactivity"}
              </button>
              <GraphWatermark className='opacity-10' />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      )}
    </>
  );
};

export default OverviewTabItem;

const ViewportSetter = ({ nodes }: { nodes: Node[] }) => {
  const { fitView, getViewport, setViewport } = useReactFlow();
  const hasRun = useRef(false);

  useEffect(() => {
    if (nodes.length === 0 || hasRun.current) return;

    hasRun.current = true;

    fitView({ padding: 0, includeHiddenNodes: true });

    setTimeout(() => {
      const minY = Math.min(...nodes.map(n => n.position.y));
      const { zoom, x } = getViewport();
      setViewport({ x: x + 20, y: minY + 20, zoom: zoom - 0.2 });
    }, 300);
  }, [nodes]);

  return null;
};

const NodeContent = ({
  data,
  type,
}: {
  data: TxInfo;
  type: "input" | "output";
}) => (
  <div className='pointer-events-auto flex h-full w-full flex-col justify-start'>
    <div className='mb-1/2 mr-1/2 max-w-fit rounded-s border border-border bg-background px-1 py-1/2 text-text-xs font-medium'>
      <AdaWithTooltip data={data.value} />
    </div>
    <AddressWithTxBadges utxo={data} isOutput={type === "output"} />
    {data.asset && (
      <div className='mt-1 grid w-full max-w-[690px] grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] gap-1'>
        <>
          {!Array.isArray(data.asset) && (
            <TxAssetLink
              type={type}
              asset={data.asset}
              className='min-w-[130px] max-w-[130px]'
            />
          )}
          {Array.isArray(data.asset) &&
            data.asset?.map((asset, i) => (
              <TxAssetLink
                type={type}
                asset={asset}
                key={asset.name + i}
                className='min-w-[130px] max-w-[130px]'
              />
            ))}
        </>
      </div>
    )}
  </div>
);
