import type { ReactNode } from "react";
import { useState, useRef, useEffect, Children } from "react";
import { getNodeText } from "@/utils/getNodeText";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import { isValidElement } from "react";

const truncateTitle = (title: string, maxLength: number = 20): string => {
  if (title.length <= maxLength) return title;
  const prefixLength = 20;
  const suffixLength = 20;
  return `${title.slice(0, prefixLength)}…${title.slice(-suffixLength)}`;
};

const hasImageInChildren = (children: ReactNode): boolean => {
  let hasImage = false;

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.type === "img" || child.type?.toString().includes("Image")) {
        hasImage = true;
      } else if (child.props?.children) {
        hasImage = hasImage || hasImageInChildren(child.props.children);
      }
    }
  });

  return hasImage;
};

const extractImages = (children: ReactNode): ReactNode[] => {
  const images: ReactNode[] = [];

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.type === "img" || child.type?.toString().includes("Image")) {
        images.push(child);
      } else if (child.props?.children) {
        images.push(...extractImages(child.props.children));
      }
    }
  });

  return images;
};

const getTruncatedTitle = (
  title: ReactNode,
): {
  isTruncated: boolean;
  displayTitle: ReactNode;
  fullText: string;
  images: ReactNode[];
} => {
  const textContent = String(getNodeText(title) || "");
  const images = extractImages(title);

  if (textContent.length <= 40) {
    return {
      isTruncated: false,
      displayTitle: title,
      fullText: textContent,
      images,
    };
  }

  return {
    isTruncated: true,
    displayTitle: truncateTitle(textContent),
    fullText: textContent,
    images,
  };
};

interface TruncatedTextProps {
  children: ReactNode;
  className?: string;
  onHasImageChange?: (hasImage: boolean) => void;
}

export const TruncatedText = ({
  children,
  className = "",
  onHasImageChange,
}: TruncatedTextProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { isTruncated, displayTitle, fullText, images } =
    getTruncatedTitle(children);

  useEffect(() => {
    if (onHasImageChange) {
      const hasImage = hasImageInChildren(children);
      onHasImageChange(hasImage);
    }
  }, [children, onHasImageChange]);

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
          <span className='flex items-center gap-1'>
            {images}
            <span className='overflow-hidden'>
              <span
                className='inline-block whitespace-nowrap'
                style={{
                  animation: "marquee 10s linear infinite",
                }}
              >
                {fullText}
              </span>
            </span>
          </span>
        ) : isTruncated && !isMobile ? (
          <span className='flex items-center gap-1'>
            {images}
            <span>{displayTitle}</span>
          </span>
        ) : (
          children
        )}
      </span>
    </>
  );
};
