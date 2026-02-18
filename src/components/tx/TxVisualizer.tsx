import type { FC } from "react";

import { Stage, Container, Graphics, Text } from "@pixi/react";
import { Loading, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { TextStyle, Rectangle } from "pixi.js";

import { useRef, useMemo, memo, useCallback, useState, useEffect } from "react";
import { useTick } from "@pixi/react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTxVisualizerStore } from "@/stores/txVisualizerStore";

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

interface FallingTxProps {
  hash: string;
  outSum: number;
  size: number;
  scriptSize: number;
  blockSize: number;
  targetX: number;
  targetY: number;
  isDark: boolean;
  onNavigate: (hash: string) => void;
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
  canvasH: number,
) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: cellW * col + GAP / 2,
    y: canvasH - (row + 1) * cellH + GAP / 2,
  };
}

const FallingTx: FC<FallingTxProps> = ({
  hash,
  outSum,
  size,
  scriptSize,
  blockSize,
  targetX,
  targetY,
  isDark,
  onNavigate,
}) => {
  const containerRef = useRef<any>(null);
  const maskRef = useRef<any>(null);
  const posRef = useRef({ x: targetX, y: -blockSize - Math.random() * 300 });
  const velYRef = useRef(0);
  const settledRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current;
    }
  }, [blockSize]);

  useEffect(() => {
    settledRef.current = false;
  }, [targetX, targetY]);

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
  const badgeRows = Math.max(0, Math.floor((barAreaTop - badgeAreaTop) / badgeSpacing));

  const indicators: { label: string; color: number }[] = [];
  if (scriptSize > 0) indicators.push({ label: "S", color: 0xf79009 });

  const badgeCols = Math.max(1, Math.floor((blockSize - 16) / badgeSpacing));
  const badgeCapacity = badgeCols * badgeRows;
  const visibleBadges = indicators.slice(0, badgeCapacity);

  useTick(delta => {
    if (!containerRef.current || settledRef.current) return;
    const pos = posRef.current;

    const dt = Math.min(delta, 2);
    pos.x += (targetX - pos.x) * 0.12;

    if (pos.y < targetY - 0.5) {
      velYRef.current += 0.7 * dt;
      pos.y += velYRef.current;
      if (pos.y >= targetY) {
        velYRef.current = -Math.abs(velYRef.current) * 0.25;
        pos.y = targetY;
      }
    } else if (pos.y > targetY + 0.5) {
      pos.y += (targetY - pos.y) * 0.12;
      velYRef.current = 0;
    } else {
      if (Math.abs(velYRef.current) > 0.3) {
        pos.y += velYRef.current;
        velYRef.current *= 0.6;
        if (pos.y > targetY) {
          pos.y = targetY;
          velYRef.current = -Math.abs(velYRef.current) * 0.25;
        }
      } else {
        pos.y = targetY;
        velYRef.current = 0;
      }
    }

    containerRef.current.x = pos.x;
    containerRef.current.y = pos.y;

    if (velYRef.current === 0 && Math.abs(pos.x - targetX) < 0.5) {
      settledRef.current = true;
    }
  });

  const onClick = useCallback(() => {
    onNavigate(hash);
  }, [onNavigate, hash]);

  return (
    <Container
      ref={containerRef}
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
          // Progress bar
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
      <Text text={sizeKb} style={subStyle} x={padding} y={padding + lineH + subLineH} />
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
            <Text text={badge.label} style={badgeLabelStyle} anchor={0.5} x={0} y={1} />
          </Container>
        );
      })}
    </Container>
  );
};

export const TxVisualizer: FC<TxVisualizerProps> = memo(
  ({ isLoading, items }) => {
    const navigate = useNavigate();
    const handleNavigate = useCallback(
      (hash: string) => navigate({ to: "/tx/$hash", params: { hash } }),
      [navigate],
    );
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const { isVisible, setIsVisible } = useTxVisualizerStore();

    const [txEntries, setTxEntries] = useState<TxEntry[]>([]);
    const [blockSize, setBlockSize] = useState(() => calcBlockSize(20, 1400, 250));
    const [canvasWidth, setCanvasWidth] = useState(1400);
    const containerRef = useRef<HTMLDivElement>(null);

    const canvasHeight = canvasWidth < 768 ? 300 : 250;

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
        return tA - tB; // oldest first = bottom
      });
      const count = sorted.length;
      if (count === 0) return;

      const newSize = calcBlockSize(count, canvasWidth, canvasHeight);
      setBlockSize(newSize);

      const { cols, cellW, cellH } = calcGridLayout(count, newSize, canvasWidth);

      const entries: TxEntry[] = sorted.map((item, i) => {
        const { x, y } = getTargetPos(i, cols, cellW, cellH, canvasHeight);
        return { item, targetX: x, targetY: y };
      });

      setTxEntries(entries);
    }, [items, canvasWidth, canvasHeight]);

    return (
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 pt-2 md:px-desktop'>
        <div className='flex items-center justify-end pb-1'>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className='flex items-center gap-1/2 text-text-xs text-grayTextPrimary transition-colors hover:text-textPrimary'
          >
            {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        {isVisible && (
          <div ref={containerRef} className='w-full rounded-m' style={{ height: canvasHeight }}>
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
                {txEntries.map(({ item, targetX, targetY }) => (
                  <FallingTx
                    key={item.hash}
                    hash={item.hash}
                    outSum={item.out_sum}
                    size={item.size}
                    scriptSize={item.script_size}
                    blockSize={blockSize}
                    targetX={targetX}
                    targetY={targetY}
                    isDark={isDark}
                    onNavigate={handleNavigate}
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
