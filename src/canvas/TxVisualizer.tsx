import type { FC } from "react";

import { Stage, Container, Graphics, Text } from "@pixi/react";
import { Loading, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { TextStyle, Rectangle } from "pixi.js";

import { useRef, useMemo, memo, useCallback, useState, useEffect } from "react";
import { useTick } from "@pixi/react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTxVisualizerStore } from "@/canvas/store/txVisualizerStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TxItem {
  hash: string;
  fee: number;
  size: number;
  out_sum: number;
  script_size: number;
  block?: { no: number; hash: string; time: string; epoch_no: number };
  [key: string]: any;
}

interface TxVisualizerProps {
  isLoading: boolean;
  items: TxItem[] | undefined;
}

interface TxEntry {
  item: TxItem;
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

interface FallingTxProps {
  hash: string;
  outSum: number;
  size: number;
  scriptSize: number;
  blockSize: number;
  isDark: boolean;
  onNavigate: (hash: string) => void;
  onRef: (hash: string, node: any) => void;
}

interface TickerProps {
  animStates: React.MutableRefObject<Map<string, AnimState>>;
  containerRefs: React.MutableRefObject<Map<string, any>>;
}

const PADDING = 8;
const GAP = 5;
const MAX_TX_SIZE = 16384;

function formatAda(lovelace: number): string {
  const ada = lovelace / 1_000_000;
  if (ada >= 1_000_000) return (ada / 1_000_000).toFixed(1) + "M \u20B3";
  if (ada >= 1_000) return Math.round(ada).toLocaleString() + " \u20B3";
  return ada.toFixed(ada < 1 ? 2 : 0) + " \u20B3";
}

function calcBlockSize(count: number, canvasW: number, canvasH: number) {
  let best = 10;
  for (let rows = 1; rows <= Math.min(count, 10); rows++) {
    const maxSByHeight = Math.floor(canvasH / rows) - GAP;
    const minCols = Math.ceil(count / rows);
    const maxSByCols = Math.floor(canvasW / minCols) - GAP;
    const s = Math.min(maxSByHeight, maxSByCols, 100);
    if (s >= 10) best = Math.max(best, s);
  }
  return best;
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
  canvasH: number,
) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: cellW * col + GAP / 2,
    y: canvasH - (row + 1) * cellH + GAP / 2,
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

const FallingTx: FC<FallingTxProps> = memo(
  ({
    hash,
    outSum,
    size,
    scriptSize,
    blockSize,
    isDark,
    onNavigate,
    onRef,
  }) => {
    const containerRef = useRef<any>(null);
    const maskRef = useRef<any>(null);
    const cacheTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
      if (containerRef.current && maskRef.current) {
        containerRef.current.mask = maskRef.current;
      }
    }, [blockSize]);

    useEffect(() => {
      if (containerRef.current) containerRef.current.cacheAsBitmap = false;
      clearTimeout(cacheTimerRef.current);
      cacheTimerRef.current = setTimeout(() => {
        if (containerRef.current && !containerRef.current.destroyed) {
          containerRef.current.cacheAsBitmap = true;
        }
      }, 100);
      return () => clearTimeout(cacheTimerRef.current);
    }, [blockSize, isDark]);

    const handleContainerRef = useCallback(
      (node: any) => {
        containerRef.current = node;
        onRef(hash, node);
      },
      [onRef, hash],
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

    const badgeLabelStyle = useMemo(
      () =>
        new TextStyle({
          fontSize: Math.max(6, Math.round(blockSize * 0.055)),
          fill: isDark ? 0x232930 : 0x374151,
          fontFamily: "sans-serif",
          fontWeight: "bold",
        }),
      [blockSize, isDark],
    );

    const padding = 10;
    const lineH = fontSize + 4;
    const subLineH = subFontSize + 4;

    const hashShort = hash.slice(0, 8) + "\u2026";
    const adaStr = formatAda(outSum);
    const sizeKb = (size / 1024).toFixed(1) + " KB";
    const fillPct = Math.min(1, size / MAX_TX_SIZE);

    const badgeRadius = Math.max(4, Math.round(blockSize * 0.055));
    const badgeSpacing = badgeRadius * 2.5;
    const badgeAreaTop = padding + lineH + subLineH;
    const barAreaTop = blockSize - 8 - 4;
    const badgeRows = Math.max(
      0,
      Math.floor((barAreaTop - badgeAreaTop) / badgeSpacing),
    );

    const indicators: { label: string; color: number }[] = [];
    if (scriptSize > 0) indicators.push({ label: "S", color: 0xf79009 });

    const badgeCols = Math.max(1, Math.floor((blockSize - 16) / badgeSpacing));
    const badgeCapacity = badgeCols * badgeRows;
    const visibleBadges = indicators.slice(0, badgeCapacity);

    const onClick = useCallback(() => onNavigate(hash), [onNavigate, hash]);

    return (
      <Container
        ref={handleContainerRef}
        interactive
        cursor='pointer'
        hitArea={new Rectangle(0, 0, blockSize, blockSize)}
        pointertap={onClick}
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
        <Text text={hashShort} style={labelStyle} x={padding} y={padding} />
        <Text text={adaStr} style={subStyle} x={padding} y={padding + lineH} />
        <Text
          text={sizeKb}
          style={subStyle}
          x={padding}
          y={padding + lineH + subLineH}
        />
        {visibleBadges.map((badge, i) => {
          const col = i % badgeCols;
          const row = Math.floor(i / badgeCols);
          const cx = padding + badgeRadius + col * badgeSpacing;
          const cy = badgeAreaTop + subLineH + badgeRadius + row * badgeSpacing;
          return (
            <Container key={badge.label} x={cx} y={cy}>
              <Graphics
                draw={g => {
                  g.clear();
                  g.beginFill(badge.color, 0.9);
                  g.drawCircle(0, 0, badgeRadius);
                  g.endFill();
                }}
              />
              <Text
                text={badge.label}
                style={badgeLabelStyle}
                anchor={0.5}
                x={0}
                y={1}
              />
            </Container>
          );
        })}
      </Container>
    );
  },
);

export const TxVisualizer: FC<TxVisualizerProps> = memo(
  ({ isLoading, items }) => {
    const navigate = useNavigate();
    const handleNavigate = useCallback(
      (hash: string) => navigate({ to: "/tx/$hash", params: { hash } }),
      [navigate],
    );
    const { t } = useAppTranslation("canvas");
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const { isVisible, setIsVisible } = useTxVisualizerStore();

    const [txEntries, setTxEntries] = useState<TxEntry[]>([]);
    const [blockSize, setBlockSize] = useState(() =>
      calcBlockSize(20, 1400, 250),
    );
    const [canvasWidth, setCanvasWidth] = useState(1400);
    const [canvasHeight, setCanvasHeight] = useState(210);
    const containerRef = useRef<HTMLDivElement>(null);

    const animStates = useRef<Map<string, AnimState>>(new Map());
    const pixiContainerRefs = useRef<Map<string, any>>(new Map());

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
      const sorted = [...(items ?? [])].sort((a, b) => {
        const tA = a.block?.time ? new Date(a.block.time).getTime() : 0;
        const tB = b.block?.time ? new Date(b.block.time).getTime() : 0;
        return tA - tB;
      });
      const count = sorted.length;
      if (count === 0) return;

      const maxH = canvasWidth < 768 ? 260 : 210;
      const newSize = calcBlockSize(count, canvasWidth, maxH);
      setBlockSize(newSize);

      const { cols, cellW, cellH } = calcGridLayout(
        count,
        newSize,
        canvasWidth,
      );
      const actualRows = Math.ceil(count / cols);
      const newCanvasHeight = actualRows * cellH;
      setCanvasHeight(newCanvasHeight);

      const entries: TxEntry[] = sorted.map((item, i) => {
        const { x, y } = getTargetPos(i, cols, cellW, cellH, newCanvasHeight);
        const key = item.hash;
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

      const newKeys = new Set(sorted.map(i => i.hash));
      for (const key of animStates.current.keys()) {
        if (!newKeys.has(key)) animStates.current.delete(key);
      }

      setTxEntries(entries);
    }, [items, canvasWidth]);

    const onTxRef = useCallback((hash: string, node: any) => {
      if (node) {
        pixiContainerRefs.current.set(hash, node);
        const state = animStates.current.get(hash);
        if (state) {
          node.x = state.posX;
          node.y = state.posY;
        }
      } else {
        pixiContainerRefs.current.delete(hash);
      }
    }, []);

    return (
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 pt-2 md:px-desktop'>
        <div className='flex items-center justify-between pb-1'>
          <h2>{t("txVisualizer.title")}</h2>
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
            style={{ height: canvasHeight }}
          >
            {isLoading ? (
              <Loading />
            ) : (
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
                {txEntries.map(({ item }) => (
                  <FallingTx
                    key={item.hash}
                    hash={item.hash}
                    outSum={item.out_sum}
                    size={item.size}
                    scriptSize={item.script_size}
                    blockSize={blockSize}
                    isDark={isDark}
                    onNavigate={handleNavigate}
                    onRef={onTxRef}
                  />
                ))}
              </Stage>
            )}
          </div>
        )}
      </section>
    );
  },
);
