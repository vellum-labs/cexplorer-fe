import type { FC } from "react";

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div 
        className="h-2 w-2 rounded-full bg-[#47CD89]" 
        style={{
          animation: "loading-dots 1.2s ease-in-out infinite",
          animationDelay: "0ms"
        }}
      ></div>
      <div 
        className="h-2 w-2 rounded-full bg-[#47CD89]" 
        style={{
          animation: "loading-dots 1.2s ease-in-out infinite",
          animationDelay: "400ms"
        }}
      ></div>
      <div 
        className="h-2 w-2 rounded-full bg-[#47CD89]" 
        style={{
          animation: "loading-dots 1.2s ease-in-out infinite",
          animationDelay: "800ms"
        }}
      ></div>
    </div>
  );
};