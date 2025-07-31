import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Offset {
  x?: number;
  y?: number;
}

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  forceDirection?: "top" | "bottom" | "left" | "right";
  hide?: boolean;
  widthRef?: React.RefObject<HTMLElement>;
  offset?: number | Offset;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  delay = 150,
  forceDirection,
  hide = false,
  widthRef,
  offset = 8,
}) => {
  const timeoutRef = useRef<number>();
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right"
  >(forceDirection || "top");
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 0, left: 0, width: 0, height: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getOffset = (): { x: number; y: number } => {
    if (typeof offset === "number") return { x: offset, y: offset };
    return { x: offset.x ?? 0, y: offset.y ?? 0 };
  };

  const { x: offsetX, y: offsetY } = getOffset();

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const showTooltip = () => {
    if (hide) return;
    clearExistingTimeout();
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    setVisible(true);
  };

  const hideTooltip = () => {
    clearExistingTimeout();
    timeoutRef.current = window.setTimeout(() => setVisible(false), delay);
  };

  useEffect(() => () => clearExistingTimeout(), []);

  useLayoutEffect(() => {
    if (!visible || !wrapperRef.current) return;

    if (forceDirection) {
      setDirection(forceDirection);
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const { top, left, width, height } = coords;
    const space = {
      top,
      bottom: vh - (top + height),
      left,
      right: vw - (left + width),
    };

    const fitsTop = space.top >= 60;
    const fitsBottom = space.bottom >= 60;
    const fitsLeft = space.left >= 120;
    const fitsRight = space.right >= 120;

    if (fitsTop) setDirection("top");
    else if (fitsBottom) setDirection("bottom");
    else if (fitsRight) setDirection("right");
    else if (fitsLeft) setDirection("left");
  }, [visible, coords, forceDirection]);

  const getFixedPosition = () => {
    const { top, left, width, height } = coords;

    switch (direction) {
      case "top":
        return {
          top: top - offsetY,
          left: left + width / 2,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: top + height + offsetY,
          left: left + width / 2,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: top + height / 2,
          left: left - offsetX,
          transform: "translate(-100%, -50%)",
        };
      case "right":
      default:
        return {
          top: top + height / 2,
          left: left + width + offsetX,
          transform: "translate(0, -50%)",
        };
    }
  };

  const fixedPos = getFixedPosition();

  const tooltipNode = visible
    ? createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            width: widthRef?.current?.offsetWidth || "auto",
            ...fixedPos,
            zIndex: 9999,
          }}
          className={cn(
            "rounded-xl border border-border bg-background px-4 py-2 text-sm shadow transition-opacity duration-150 empty:hidden",
            visible ? "opacity-100" : "opacity-0",
          )}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {content}
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className='relative inline-block'
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
    >
      {children}
      {tooltipNode}
    </div>
  );
};
