import type { FC } from "react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { PolicyStatGraph } from "../graphs/PolicyStatGraph";

import { useFetchPolicyStats } from "@/services/policy";

interface PolicyAnalyticsTabProps {
  policyId: string;
}

export const PolicyAnalyticsTab: FC<PolicyAnalyticsTabProps> = ({
  policyId,
}) => {
  const statQuery = useFetchPolicyStats(policyId);

  return (
    <AnalyticsGraph exportButton>
      <PolicyStatGraph query={statQuery} />
    </AnalyticsGraph>
  );
};
