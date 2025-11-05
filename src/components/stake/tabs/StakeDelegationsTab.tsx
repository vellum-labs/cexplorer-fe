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
      visible: true,
    },
    {
      key: "dreps",
      label: "DReps",
      visible: true,
    },
  ];

  return (
    <>
      <Tabs
        withPadding={false}
        withMargin={false}
        tabParam='delegation'
        items={tabItems}
        activeTabValue={activeTab}
        onClick={setActiveTab}
      />
      {activeTab === "stake-pools" && (
        <StakePoolDelegationsContent address={address} miscConst={miscConst} />
      )}
      {activeTab === "dreps" && (
        <DRepDelegationsContent address={address} miscConst={miscConst} />
      )}
    </>
  );
};

export default StakeDelegationsTab;
