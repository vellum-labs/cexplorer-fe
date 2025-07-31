import type { FC } from "react";

// import Tabs from "@/components/global/Tabs";
import { PolicyDetailTopWallets } from "../PolicyDetailTopWallets";

interface PolicyOwnersTabProps {
  policyId: string;
}

export const PolicyOwnersTab: FC<PolicyOwnersTabProps> = ({ policyId }) => {
  // const tabs = [
  //   {
  //     key: "top_wallets",
  //     label: "Top Wallets",
  //     content: <PolicyDetailTopWallets policyId={policyId} />,
  //     visible: true,
  //   },
  //   {
  //     key: "graphs",
  //     label: "Graphs",
  //     content: <>TBD</>,
  //     visible: false,
  //   },
  // ];

  return <PolicyDetailTopWallets policyId={policyId} />;
};
