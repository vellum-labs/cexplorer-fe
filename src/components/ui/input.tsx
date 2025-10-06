import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onchange: (value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onchange, ...props }, ref) => {
    return (
      <input
        onChange={e => {
          onchange(e.target.value);
          e.stopPropagation();
        }}
        value={value}
        type={type}
        className={cn(
          `flex h-[40px] w-full rounded-s border border-border bg-transparent px-1.5 py-1/2 text-[16px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-text disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400 md:text-sm`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
