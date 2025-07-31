import type { ReactNode } from "react";

import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

type Props = {
  size: "xs" | "sm" | "md" | "lg" | "xl";
  variant: "primary" | "secondary" | "tertiary" | "purple" | "red" | "discord";
  label?: ReactNode;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  targetBlank?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({
  size,
  variant,
  label,
  href,
  rightIcon,
  leftIcon,
  targetBlank,
  className,
  disabled,
  onClick,
}: Props) => {
  const sizeClasses = {
    xs: "py-1 px-1 text-[12px]",
    sm: "py-2 px-3 text-[13px]",
    md: "py-2 px-4 text-sm",
    lg: "py-2 px-4 text-md",
    xl: "py-3 px-5 text-lg",
  };

  const variantClasses = {
    primary: "bg-darkBlue text-white border-2 border-darkBlue hover:text-white",
    secondary:
      "bg-secondaryBg text-secondaryText border-2 border-secondaryText hover:text-secondaryText",
    tertiary: "bg-cardBg border border-border",
    purple:
      "bg-gradient-to-b hover:text-white from-purple-500 to-purple-700 text-white",
    red: "bg-redText text-white",
    discord: "bg-[#677DC9] text-white",
  };

  const commonClasses =
    "flex box-border max-w-fit justify-center min-w-fit items-center rounded-[8px] font-medium duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50";

  if (href)
    return (
      <Link
        to={href}
        target={targetBlank ? "_blank" : "_self"}
        className={`${commonClasses} ${disabled && "cursor-not-allowed opacity-50"} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled}
      >
        <span className={`${leftIcon && label && "-ml-1 mr-2"}`}>
          {leftIcon}
        </span>
        {label && <span>{label}</span>}
        <span className={`${rightIcon && "ml-2"}`}>{rightIcon}</span>
      </Link>
    );

  return (
    <button
      onClick={onClick}
      className={`${commonClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
    >
      <span className={`${leftIcon && label && "-ml-1 mr-2"}`}>{leftIcon}</span>
      {label && <span>{label}</span>}
      {rightIcon && (
        <span className={`${rightIcon && "ml-2"}`}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
