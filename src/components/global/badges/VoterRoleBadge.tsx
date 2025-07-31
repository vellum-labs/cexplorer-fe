import { Landmark, Network, User } from "lucide-react";
import { Badge } from "./Badge";

export const VoterRoleBadge = ({ role }: { role: string }) => {
  //   DRep SPO CC
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
