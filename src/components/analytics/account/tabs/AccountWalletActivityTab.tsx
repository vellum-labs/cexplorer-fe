import type { useFetchEpochAnalytics } from "@/services/analytics";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";

import { AnalyticsGraph } from "../../AnalyticsGraph";
import { AccountWalletActivityGraph } from "../graphs/AccountWalletActivityGraph";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { GraphTimePeriod } from "@/types/graphTypes";
import { useState } from "react";

interface AccountWalletActivityTabProps {
  epochQuery: ReturnType<typeof useFetchEpochAnalytics>;
}

export const AccountWalletActivityTab: FC<AccountWalletActivityTabProps> = ({
  epochQuery,
}) => {
  const { t } = useAppTranslation("common");
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const [data, setData] = useState<EpochAnalyticsResponseData[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  return (
    <AnalyticsGraph
      title={t("analytics.wallets")}
      description={t("analytics.walletsDescription")}
      exportButton
      graphSortData={{
        query: epochQuery,
        setData,
        setSelectedItem,
        selectedItem,
        ignoreFiveDays: true,
      }}
    >
      <AccountWalletActivityGraph data={data ?? []} miscConst={miscConst} />
    </AnalyticsGraph>
  );
};
