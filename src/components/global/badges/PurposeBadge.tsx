import { Badge } from "./Badge";

export const PurposeBadge = ({
  purpose,
  className,
}: {
  purpose: string;
  className?: string;
}) => {
  enum Purpose {
    spent,
    mint,
    cert,
    reward,
    vote,
    propose,
  }

  if (!purpose) return null;

  return (
    <Badge
      style={{ filter: `hue-rotate(${Purpose[purpose] * 35}deg)` }}
      color='purple'
      rounded
      className={className}
    >
      {purpose.slice(0, 1).toUpperCase() + purpose.slice(1)}
    </Badge>
  );
};
