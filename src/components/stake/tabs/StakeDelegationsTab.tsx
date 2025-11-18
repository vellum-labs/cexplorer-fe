import { Tabs } from "@vellumlabs/cexplorer-sdk";
import type { MiscConstResponseData } from "@/types/miscTypes";
import { DRepDelegationsContent } from "../DRepDelegationsContent";
import { StakePoolDelegationsContent } from "../StakePoolDelegationsContent";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";

interface Props {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

const StakeDelegationsTab = ({ address, miscConst }: Props) => {
  const { activeTab, setActiveTab } = usePoolDelegatorsTableStore();

  const tabItems = [
    {
      key: "stake-pools",
      label: "Stake Pools",
      content: (
        <StakePoolDelegationsContent address={address} miscConst={miscConst} />
      ),
      visible: true,
    },
    {
      key: "dreps",
      label: "DReps",
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
