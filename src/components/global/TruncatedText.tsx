import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";

const extractTextFromReactNode = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractTextFromReactNode(node.props.children);
  }
  return "";
};

const truncateTitle = (title: string, maxLength: number = 20): string => {
  if (title.length <= maxLength) return title;
  const prefixLength = 20;
  const suffixLength = 20;
  return `${title.slice(0, prefixLength)}…${title.slice(-suffixLength)}`;
};

const getTruncatedTitle = (
  title: ReactNode,
): { isTruncated: boolean; displayTitle: ReactNode; fullText: string } => {
  const textContent = extractTextFromReactNode(title);
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
  style?: React.CSSProperties;
}

export const TruncatedText = ({
  children,
  className = "",
  style = {},
}: TruncatedTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { isTruncated, displayTitle, fullText } = getTruncatedTitle(children);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
          ...style,
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
            className="inline-block whitespace-nowrap"
            style={{
              animation: "marquee 10s linear infinite",
            }}
          >
            {fullText}
          </span>
        ) : isTruncated && !isMobile ? (
          <span className="inline-block whitespace-nowrap">
            {displayTitle}
          </span>
        ) : (
          children
        )}
      </span>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};
