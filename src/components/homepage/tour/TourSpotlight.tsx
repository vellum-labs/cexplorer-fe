import type { FC } from "react";

interface TourSpotlightProps {
  rect: DOMRect;
}

export const TourSpotlight: FC<TourSpotlightProps> = ({ rect }) => {
  const padding = 6;

  return (
    <div
      style={{
        position: "fixed",
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: 8,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
        zIndex: 99998,
        pointerEvents: "none",
        transition: "top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease",
      }}
    />
  );
};
