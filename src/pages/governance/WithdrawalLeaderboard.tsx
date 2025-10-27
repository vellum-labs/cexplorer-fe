import type { FC } from "react";

import { PageBase } from "@/components/global/pages/PageBase";

import { useState } from "react";
import SortBy from "@/components/ui/sortBy";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { FileText, Users } from "lucide-react";
import { VotingTable } from "@/components/gov/drepVote/VotingTable";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { useVotingTableStore } from "@/stores/tables/votingTableTableStore";

type SelectItemsType = "Voting power (ASC)" | "Voting power (DESC)";

export const WithdrawalLeaderboard: FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    "Voting power (ASC)",
  );

  const selectItems: { key: SelectItemsType; value: SelectItemsType }[] = [
    {
      key: "Voting power (ASC)",
      value: "Voting power (ASC)",
    },
    {
      key: "Voting power (DESC)",
      value: "Voting power (DESC)",
    },
  ];

  const { rows, setRows } = useVotingTableStore();

  return (
    <PageBase
      metadataTitle='treasuryWithdrawalLeaderboard'
      title='Withdrawal Leaderboard'
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        { label: "Withdrawal leaderboard" },
      ]}
      adsCarousel={false}
    >
      <section
        className={`flex w-full max-w-desktop flex-col px-mobile pb-2 md:px-desktop`}
      >
        <div className='mb-2 flex w-full flex-wrap items-center justify-between gap-1 min-[790px]:flex-nowrap'>
          <div className='flex items-center gap-1'>
            <SortBy
              selectItems={selectItems}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              disabled
            />
          </div>
          <div className='flex items-center gap-1 min-[790px]:flex-grow-0'>
            <Button
              size='md'
              rightIcon={<FileText size={15} />}
              label='Select proposals'
              variant='tertiary'
              disabled
            />
            <Button
              size='md'
              rightIcon={<Users size={15} />}
              label='Select DReps'
              variant='tertiary'
              disabled
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={[]}
            />
          </div>
        </div>
        <VotingTable />
      </section>
    </PageBase>
  );
};
