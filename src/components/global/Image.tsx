import DrepFallback from "@/resources/images/fallbacks/drepFallback.svg";
import PoolFallback from "@/resources/images/fallbacks/poolFallback.svg";

import { alphabetWithNumbers } from "@/constants/alphabet";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "./skeletons/LoadingSkeleton";

const ImageWrapper: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & {
    type?: "asset" | "pool" | "user";
    fullWidth?: boolean;
    fallbackletters?: string;
  }
> = props => {
  const [src, setSrc] = useState(props.src);
  const [loading, setLoading] = useState(true);
  const [fallbackElement, setFallbackElement] =
    useState<React.ReactNode | null>(null);
  const letters = props.fallbackletters ?? "";
  const fallbackLettersIndexSum =
    letters
      ?.split("")
      .reduce(
        (acc, curr) => acc + alphabetWithNumbers.indexOf(curr.toLowerCase()),
        0,
      ) || 0;

  const renderFallbackName = () => {
    if (letters?.length <= 5) {
      return letters[0];
    } else if (letters.includes("_")) {
      return letters[0] + letters[letters.indexOf("_") + 1];
    } else {
      return letters[0] + letters[1];
    }
  };

  const returnFallback = () => {
    switch (props.type) {
      case "asset":
        return null;
      case "pool":
        return PoolFallback;
      case "user":
        return DrepFallback;
      default:
        return null;
    }
  };

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  useEffect(() => {
    const loadImage = (url: string, fallbackUrl: string) =>
      new Promise((resolve, reject) => {
        const image = new Image();

        image.src = url;

        image.addEventListener("load", () => {
          resolve(image);
        });

        image.addEventListener("error", error => {
          if (!fallbackUrl || image.src === fallbackUrl) {
            reject(error);
            if (!fallbackUrl && props.fallbackletters) {
              setFallbackElement(
                <div
                  className={`flex ${props.className?.includes("rounded-full") ? "rounded-full" : "rounded-lg"} shrink-0 items-center justify-center bg-primary ${props.height && Number(props.height) > 100 ? "text-5xl" : "text-[18px]"} font-bold uppercase text-background`}
                  style={{
                    height: props.height + "px",
                    width: props.fullWidth ? "100%" : props.width + "px",
                    filter: `hue-rotate(${fallbackLettersIndexSum * 10}deg)`,
                  }}
                >
                  {renderFallbackName()}
                </div>,
              );
            }
            setLoading(false);
          } else {
            setLoading(false);
            setSrc(fallbackUrl);
          }
        });
      });

    setLoading(true);

    loadImage(props.src || "", returnFallback() || "")
      .catch(() => {
        setSrc(returnFallback() || "");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.src]);

  if (loading) {
    return (
      <LoadingSkeleton
        height={props.height + "px"}
        width={props.fullWidth ? "100%" : props.width + "px"}
        className={props.className}
        rounded={props.className?.includes("rounded-full") ? "full" : "md"}
      />
    );
  }

  if (fallbackElement) {
    return fallbackElement;
  }

  return <img key={props.src} {...props} src={src} />;
};

export { ImageWrapper as Image };
