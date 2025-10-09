import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { getNodeText } from "@/utils/getNodeText";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";

const truncateTitle = (title: string, maxLength: number = 20): string => {
  if (title.length <= maxLength) return title;
  const prefixLength = 20;
  const suffixLength = 20;
  return `${title.slice(0, prefixLength)}…${title.slice(-suffixLength)}`;
};

const getTruncatedTitle = (
  title: ReactNode,
): { isTruncated: boolean; displayTitle: ReactNode; fullText: string } => {
  const textContent = String(getNodeText(title) || "");
  if (textContent.length <= 40) {
    return { isTruncated: false, displayTitle: title, fullText: textContent };
  }
  return {
    isTruncated: true,
    displayTitle: truncateTitle(textContent),
    fullText: textContent,
  };
};

interface TruncatedTextProps {
  children: ReactNode;
  className?: string;
}

export const TruncatedText = ({
  children,
  className = "",
}: TruncatedTextProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { isTruncated, displayTitle, fullText } = getTruncatedTitle(children);

  useEffect(() => {
    if (textRef.current && isTruncated && !containerWidth && !isMobile) {
      setContainerWidth(textRef.current.offsetWidth);
    }
  }, [isTruncated, containerWidth, isMobile]);

  return (
    <>
      <span
        ref={textRef}
        className={className}
        style={{
          ...(isTruncated && !isMobile && containerWidth
            ? { width: `${containerWidth}px`, display: "inline-block" }
            : isTruncated && !isMobile
              ? { display: "inline-block" }
              : {}),
          ...(isTruncated && !isMobile && containerWidth
            ? { overflow: "hidden" }
            : {}),
        }}
        onMouseEnter={() => isTruncated && !isMobile && setIsHovered(true)}
        onMouseLeave={() => isTruncated && !isMobile && setIsHovered(false)}
      >
        {isTruncated && !isMobile && isHovered ? (
          <span
            className='inline-block whitespace-nowrap'
            style={{
              animation: "marquee 10s linear infinite",
            }}
          >
            {fullText}
          </span>
        ) : isTruncated && !isMobile ? (
          <span className='inline-block whitespace-nowrap'>{displayTitle}</span>
        ) : (
          children
        )}
      </span>
    </>
  );
};
