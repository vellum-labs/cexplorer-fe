import { Code, User } from "lucide-react";
import { Badge } from "@vellumlabs/cexplorer-sdk";

interface Props {
  isScript: boolean;
}

export const ScriptBadge = ({ isScript }: Props) => {
  if (!isScript) {
    return (
      <Badge color='blue'>
        <User size={15} />
        Non-script
      </Badge>
    );
  }
  return (
    <Badge color='yellow'>
      <Code size={15} />
      Script
    </Badge>
  );
};
