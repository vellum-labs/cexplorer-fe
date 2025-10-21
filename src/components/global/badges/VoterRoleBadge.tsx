import { Landmark, Network, User } from "lucide-react";
import { Badge } from "@vellumlabs/cexplorer-sdk";

export const VoterRoleBadge = ({ role }: { role: string }) => {
  const getIcon = () => {
    switch (role) {
      case "DRep":
        return <User size={15} />;
      case "SPO":
        return <Network size={15} />;
      case "CC":
        return <Landmark size={15} />;
    }
  };
  return (
    <Badge color='gray'>
      {getIcon()}
      {role}
    </Badge>
  );
};
