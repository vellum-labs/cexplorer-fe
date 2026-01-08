import { Tabs } from "@vellumlabs/cexplorer-sdk";
import type { MiscConstResponseData } from "@/types/miscTypes";
import { DRepDelegationsContent } from "../DRepDelegationsContent";
import { StakePoolDelegationsContent } from "../StakePoolDelegationsContent";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

const StakeDelegationsTab = ({ address, miscConst }: Props) => {
  const { t } = useAppTranslation("pages");
  const { activeTab, setActiveTab } = usePoolDelegatorsTableStore();

  const tabItems = [
    {
      key: "stake-pools",
      label: t("stake.detailPage.delegationsTab.stakePools"),
      content: (
        <StakePoolDelegationsContent address={address} miscConst={miscConst} />
      ),
      visible: true,
    },
    {
      key: "dreps",
      label: t("stake.detailPage.delegationsTab.dreps"),
      content: (
        <DRepDelegationsContent address={address} miscConst={miscConst} />
      ),
      visible: true,
    },
  ];

  return (
    <Tabs
      withPadding={false}
      withMargin={false}
      tabParam='delegation'
      items={tabItems}
      activeTabValue={activeTab}
      onClick={setActiveTab}
    />
  );
};

export default StakeDelegationsTab;
