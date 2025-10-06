import { Tooltip } from "@/components/ui/tooltip";
import type { ScriptDetailData } from "@/types/scriptTypes";
import type { Label } from "@/types/txTypes";
import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { ExtraLabelBadge } from "./ExtraLabelBadge";

interface Props {
  variant: "sm" | "lg" | "textOnly";
  label: Label;
  className?: string;
  extra?: ScriptDetailData["label"]["extra"];
}

export const LabelBadge = ({ variant, label, className, extra }: Props) => {
  let inner: ReactNode = null;
  switch (variant) {
    case "sm":
      inner = (
        <Badge
          color='blue'
          rounded
          className={`block h-6 max-w-[58px] ${className}`}
          style={{
            fontSize: "10px",
            padding: "0px 5px",
          }}
        >
          <span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
            {label.label}
          </span>
        </Badge>
      );
      break;
    case "lg":
      inner = (
        <Badge color='blue' rounded className={className}>
          {label.label}
        </Badge>
      );
      break;

    case "textOnly":
      return <ExtraLabelBadge name={label.label} extra={extra} />;
  }

  return (
    <Tooltip
      content={
        <div className='flex min-w-[160px] flex-col gap-1 text-sm'>
          <p className='mb-1/2'>{label.label}</p>
          <p>
            Category:{" "}
            {label.category
              ? label.category.map(
                  (category, index) =>
                    `${index !== label.category.length - 1 ? category + ", " : category}`,
                )
              : "Not provided"}
          </p>
          <p>Source: {label.source}</p>
        </div>
      }
    >
      {inner}
    </Tooltip>
  );
};
