import type { FC, ReactNode } from "react";

interface WalletRowProps {
  title: ReactNode;
  className?: string;
  darker?: boolean;
  cells: ReactNode[];
  dynamicHeight?: boolean;
  wrapperClassname?: string;
}

export const WalletRow: FC<WalletRowProps> = ({
  title,
  className,
  cells,
  darker,
  dynamicHeight = false,
  wrapperClassname,
}) => {
  return (
    <div
      className={`flex w-full ${darker ? "bg-darker" : ""} ${wrapperClassname ? wrapperClassname : "items-center"}`}
    >
      <div
        className={`min-w-[270px] max-w-[255px] flex-grow ${darker ? "bg-darker" : ""} ${className ? className : ""}`}
        style={{
          minHeight: dynamicHeight ? "auto" : "64px",
          height: dynamicHeight ? "auto" : "64px",
        }}
      >
        {title}
      </div>
      {cells.map((item, i) => (
        <div
          key={i}
          className={`flex min-w-[140px] flex-1 justify-center ${darker ? "bg-darker" : ""} ${className ? className : ""}`}
          style={{
            minHeight: dynamicHeight ? "auto" : "64px",
            height: dynamicHeight ? "auto" : "64px",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
