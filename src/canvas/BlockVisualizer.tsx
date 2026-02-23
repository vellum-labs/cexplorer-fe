import type { FC } from "react";

import { Stage, Container, Graphics, Text } from "@pixi/react";
import { Loading, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { TextStyle, Rectangle } from "pixi.js";

import { useRef, useMemo, memo, useCallback, useState, useEffect } from "react";
import { useTick } from "@pixi/react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBlockVisualizerStore } from "@/canvas/store/blockVisualizerStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface BlockItem {
  block_no: number;
  tx_count: number;
  hash: string;
  size: number;
  epoch_param?: { max_block_size: number };
  [key: string]: any;
}

interface BlockVisualizerProps {
  isLoading: boolean;
  items: BlockItem[] | undefined;
}

interface BlockEntry {
  item: BlockItem;
  targetX: number;
  targetY: number;
}

interface AnimState {
  posX: number;
  posY: number;
  velY: number;
  settled: boolean;
  targetX: number;
  targetY: number;
}

interface FallingBlockProps {
  blockNo: number;
  txCount: number;
  size: number;
  maxBlockSize: number;
  blockSize: number;
  maxTxRows: number;
  isDark: boolean;
  onRef: (blockNo: number, node: any) => void;
}

interface TickerProps {
  animStates: React.MutableRefObject<Map<number, AnimState>>;
  containerRefs: React.MutableRefObject<Map<number, any>>;
}

const PADDING = 8;
const GAP = 5;

function calcBlockSize(count: number, canvasW: number, canvasH: number) {
  const cols = Math.ceil(Math.sqrt(count * (canvasW / canvasH)));
  const rows = Math.ceil(count / cols);
  const maxByWidth = (canvasW - PADDING) / cols - PADDING;
  const maxByHeight = (canvasH - PADDING) / rows - PADDING;
  return Math.floor(Math.min(maxByWidth, maxByHeight, 100));
}

function calcGridLayout(_count: number, blockSize: number, canvasW: number) {
  const cols = Math.floor(canvasW / (blockSize + GAP));
  const cellW = canvasW / cols;
  const cellH = blockSize + GAP;
  return { cols, cellW, cellH };
}

function getTargetPos(
  index: number,
  cols: number,
  cellW: number,
  cellH: number,
) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: cellW * col + GAP / 2,
    y: row * cellH + GAP / 2,
  };
}

const Ticker: FC<TickerProps> = memo(({ animStates, containerRefs }) => {
  useTick(delta => {
    const dt = Math.min(delta, 2);
    for (const [key, state] of animStates.current) {
      if (state.settled) continue;
      const container = containerRefs.current.get(key);
      if (!container) continue;

      state.posX += (state.targetX - state.posX) * 0.12;

      if (state.posY < state.targetY - 0.5) {
        state.velY += 0.7 * dt;
        state.posY += state.velY;
        if (state.posY >= state.targetY) {
          state.velY = -Math.abs(state.velY) * 0.25;
          state.posY = state.targetY;
        }
      } else if (state.posY > state.targetY + 0.5) {
        state.posY += (state.targetY - state.posY) * 0.12;
        state.velY = 0;
      } else {
        if (Math.abs(state.velY) > 0.3) {
          state.posY += state.velY;
          state.velY *= 0.6;
          if (state.posY > state.targetY) {
            state.posY = state.targetY;
            state.velY = -Math.abs(state.velY) * 0.25;
          }
        } else {
          state.posY = state.targetY;
          state.velY = 0;
        }
      }

      container.x = state.posX;
      container.y = state.posY;

      if (state.velY === 0 && Math.abs(state.posX - state.targetX) < 0.5) {
        state.settled = true;
      }
    }
  });
  return null;
});

const FallingBlock: FC<FallingBlockProps> = memo(({
  blockNo,
  txCount,
  size,
  maxBlockSize,
  blockSize,
  maxTxRows,
  isDark,
  onRef,
}) => {
  const containerRef = useRef<any>(null);
  const maskRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current;
    }
  }, [blockSize]);

  const handleContainerRef = useCallback(
    (node: any) => {
      containerRef.current = node;
      onRef(blockNo, node);
    },
    [onRef, blockNo],
  );

  const fontSize = Math.max(10, Math.round(blockSize * 0.095));
  const subFontSize = Math.max(8, Math.round(blockSize * 0.075));

  const labelStyle = useMemo(
    () =>
      new TextStyle({
        fontSize,
        fill: isDark ? 0x75deff : 0x0094d4,
        fontFamily: "sans-serif",
        fontWeight: "700",
      }),
    [fontSize, isDark],
  );

  const subStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: subFontSize,
        fill: isDark ? 0x8d97a5 : 0x667085,
        fontFamily: "sans-serif",
        fontWeight: "400",
      }),
    [subFontSize, isDark],
  );

  const txLabelStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: Math.max(6, Math.round(blockSize * 0.055)),
        fill: isDark ? 0x232930 : 0x374151,
        fontFamily: "sans-serif",
        fontWeight: "bold",
      }),
    [blockSize, isDark],
  );

  const txRadius = Math.max(4, Math.round(blockSize * 0.055));
  const txSpacing = txRadius * 2.5;
  const txCols = Math.max(1, Math.floor((blockSize - 16) / txSpacing));
  const sizeKb = (size / 1024).toFixed(1);
  const fillPct = maxBlockSize > 0 ? Math.min(1, size / maxBlockSize) : 0;

  const padding = 10;
  const lineH = fontSize + 4;
  const subLineH = subFontSize + 4;
  const txAreaTop = padding + lineH + subLineH;
  const barAreaTop = blockSize - 8 - 4;
  const txRows = Math.min(
    maxTxRows,
    Math.max(0, Math.floor((barAreaTop - txAreaTop) / txSpacing)),
  );
  const capacity = txCols * txRows;
  const hasOverflow = txRows > 0 && txCount > capacity;
  const displayCount = hasOverflow
    ? Math.max(0, capacity - 1)
    : Math.min(txCount, capacity);
  const overflowCount = txCount - displayCount;

  return (
    <Container
      ref={handleContainerRef}
      interactive
      cursor='pointer'
      hitArea={new Rectangle(0, 0, blockSize, blockSize)}
    >
      <Graphics
        ref={maskRef}
        draw={g => {
          g.clear();
          g.beginFill(0xffffff);
          g.drawRoundedRect(0, 0, blockSize, blockSize, 12);
          g.endFill();
        }}
      />
      <Graphics
        draw={g => {
          g.clear();
          g.beginFill(isDark ? 0x232930 : 0xffffff);
          g.drawRoundedRect(0, 0, blockSize, blockSize, 12);
          g.endFill();
          g.lineStyle(1.5, isDark ? 0x424951 : 0xd0d5dd);
          g.drawRoundedRect(0, 0, blockSize, blockSize, 12);
          g.lineStyle(0);
          const barH = 4;
          const barY = blockSize - barH - 4;
          const barX = padding;
          const barW = blockSize - padding * 2;
          g.beginFill(0xfec84b, 1);
          g.drawRoundedRect(barX, barY, barW, barH, 2);
          g.endFill();
          if (fillPct > 0) {
            g.beginFill(0x47cd89, 1);
            g.drawRoundedRect(barX, barY, barW * fillPct, barH, 2);
            g.endFill();
          }
        }}
      />
      <Text text={`#${blockNo}`} style={labelStyle} x={padding} y={padding} />
      <Text
        text={`${sizeKb} KB`}
        style={subStyle}
        x={padding}
        y={padding + lineH}
      />
      {Array.from({ length: displayCount }).map((_, i) => {
        const col = i % txCols;
        const row = Math.floor(i / txCols);
        const cx = padding + txRadius + col * txSpacing;
        const cy = padding + lineH + subLineH + txRadius + row * txSpacing;
        return (
          <Container key={i} x={cx} y={cy}>
            <Graphics
              draw={g => {
                g.clear();
                g.beginFill(isDark ? 0xffffff : 0xe4e7ec, 0.9);
                g.drawCircle(0, 0, txRadius);
                g.endFill();
              }}
            />
            <Text text='Tx' style={txLabelStyle} anchor={0.5} x={0} y={1} />
          </Container>
        );
      })}
      {hasOverflow &&
        (() => {
          const i = displayCount;
          const col = i % txCols;
          const row = Math.floor(i / txCols);
          const cx = padding + txRadius + col * txSpacing;
          const cy = padding + lineH + subLineH + txRadius + row * txSpacing;
          return (
            <Container key='overflow' x={cx} y={cy}>
              <Graphics
                draw={g => {
                  g.clear();
                  g.beginFill(isDark ? 0x424951 : 0xd0d5dd, 1);
                  g.drawCircle(0, 0, txRadius);
                  g.endFill();
                }}
              />
              <Text
                text={`+${overflowCount}`}
                style={txLabelStyle}
                anchor={0.5}
                x={0}
                y={1}
              />
            </Container>
          );
        })()}
    </Container>
  );
});

export const BlockVisualizer: FC<BlockVisualizerProps> = memo(
  ({ isLoading, items }) => {
    const navigate = useNavigate();
    const handleNavigate = useCallback(
      (hash: string) => navigate({ to: "/block/$hash", params: { hash } }),
      [navigate],
    );
    const { t } = useAppTranslation("canvas");
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const { isVisible, setIsVisible } = useBlockVisualizerStore();

    const [blockEntries, setBlockEntries] = useState<BlockEntry[]>([]);
    const [blockSize, setBlockSize] = useState(() =>
      calcBlockSize(20, 1400, 250),
    );
    const [maxTxRows, setMaxTxRows] = useState(4);
    const [canvasWidth, setCanvasWidth] = useState(1400);
    const canvasHeight = canvasWidth < 768 ? 260 : 210;
    const containerRef = useRef<HTMLDivElement>(null);

    const animStates = useRef<Map<number, AnimState>>(new Map());
    const pixiContainerRefs = useRef<Map<number, any>>(new Map());

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new ResizeObserver(entries => {
        const width = entries[0]?.contentRect.width;
        if (width && width > 0) setCanvasWidth(Math.floor(width));
      });
      observer.observe(el);
      setCanvasWidth(Math.floor(el.getBoundingClientRect().width));
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const sorted = [...(items ?? [])].sort((a, b) => b.block_no - a.block_no);
      const count = sorted.length;
      if (count === 0) return;

      const newSize = calcBlockSize(count, canvasWidth, canvasHeight);
      setBlockSize(newSize);
      setMaxTxRows(count >= 50 ? 2 : count < 30 ? 4 : 3);

      const { cols, cellW, cellH } = calcGridLayout(count, newSize, canvasWidth);

      const entries: BlockEntry[] = sorted.map((item, i) => {
        const { x, y } = getTargetPos(i, cols, cellW, cellH);
        const key = item.block_no;
        if (!animStates.current.has(key)) {
          animStates.current.set(key, {
            posX: x,
            posY: -newSize - Math.random() * 300,
            velY: 0,
            settled: false,
            targetX: x,
            targetY: y,
          });
        } else {
          const state = animStates.current.get(key)!;
          if (state.targetX !== x || state.targetY !== y) {
            state.targetX = x;
            state.targetY = y;
            state.settled = false;
          }
        }
        return { item, targetX: x, targetY: y };
      });

      const newKeys = new Set(sorted.map(i => i.block_no));
      for (const key of animStates.current.keys()) {
        if (!newKeys.has(key)) animStates.current.delete(key);
      }

      setBlockEntries(entries);
    }, [items, canvasWidth, canvasHeight]);

    const onBlockRef = useCallback((blockNo: number, node: any) => {
      if (node) {
        pixiContainerRefs.current.set(blockNo, node);
        const state = animStates.current.get(blockNo);
        if (state) {
          node.x = state.posX;
          node.y = state.posY;
        }
      } else {
        pixiContainerRefs.current.delete(blockNo);
      }
    }, []);

    return (
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 pt-2 md:px-desktop'>
        <div className='flex items-center justify-between pb-1'>
          <h2>{t("blockVisualizer.title")}</h2>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className='hover:text-textPrimary flex items-center gap-1/2 text-text-xs text-grayTextPrimary transition-colors'
          >
            {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        {isVisible && (
          <div
            ref={containerRef}
            className='w-full rounded-m'
            style={{ height: canvasHeight, position: 'relative' }}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <Stage
                  width={canvasWidth}
                  height={canvasHeight}
                  options={{
                    backgroundAlpha: 0,
                    antialias: true,
                    resolution: window.devicePixelRatio,
                    autoDensity: true,
                  }}
                >
                  <Ticker
                    animStates={animStates}
                    containerRefs={pixiContainerRefs}
                  />
                  {blockEntries.map(({ item }) => (
                    <FallingBlock
                      key={item.block_no}
                      blockNo={item.block_no}
                      txCount={item.tx_count}
                      size={item.size}
                      maxBlockSize={item.epoch_param?.max_block_size ?? 0}
                      blockSize={blockSize}
                      maxTxRows={maxTxRows}
                      isDark={isDark}
                      onRef={onBlockRef}
                    />
                  ))}
                </Stage>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: canvasWidth,
                    height: canvasHeight,
                    pointerEvents: 'none',
                  }}
                >
                  {blockEntries.map(({ item, targetX, targetY }) => (
                    <a
                      key={item.block_no}
                      href={`/block/${item.hash}`}
                      style={{
                        position: 'absolute',
                        left: targetX,
                        top: targetY,
                        width: blockSize,
                        height: blockSize,
                        borderRadius: 12,
                        pointerEvents: 'auto',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                      onClick={e => {
                        if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                          e.preventDefault();
                          handleNavigate(item.hash);
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    );
  },
);
