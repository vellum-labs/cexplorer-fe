import type { FC } from "react";
import { useState, useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { RewardsTab } from "./tabs/RewardsTab";
import { WithdrawalsTab } from "./tabs/WithdrawalsTab";
import { CircleAlert } from "lucide-react";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";

export const TaxToolPage: FC = () => {
  const { view } = useSearch({
    from: "/tax-tool",
  });

  const [search, setSearch] = useState<string>(view ?? "");
  const debouncedSearch = useDebounce(search);

  const tabItems = useMemo(
    () => [
      {
        key: "rewards",
        label: "Rewards",
        title: "Rewards",
        content: <RewardsTab stakeKey={debouncedSearch} />,
        visible: true,
      },
      {
        key: "withdrawals",
        label: "Withdrawals",
        title: "Withdrawals",
        content: <WithdrawalsTab stakeKey={debouncedSearch} />,
        visible: true,
      },
    ],
    [debouncedSearch],
  );

  return (
    <PageBase
      metadataTitle='taxTool'
      title='Tax tool'
      breadcrumbItems={[{ label: "Tax tool" }]}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-2 p-mobile md:p-desktop'>
          <div className='border-blue-500/40 bg-blue-500/5 flex items-start gap-2 rounded-m border p-2'>
            <CircleAlert className='mt-0.5 text-blue-500' size={18} />
            <div className='flex flex-col gap-1 text-text-sm'>
              <p className='font-medium text-text'>
                Please note that the data is for informational purposes only, we
                do not guarantee its correctness or accuracy.
              </p>
              <p className='text-grayTextPrimary'>
                Always consult your taxes with professional tax advisor.
              </p>
            </div>
          </div>

          <div className='flex w-full'>
            <TableSearchInput
              value={search}
              onchange={val => setSearch(val)}
              placeholder='Stake key'
              showSearchIcon
              wrapperClassName='w-full'
              showPrefixPopup={false}
            />
          </div>

          {debouncedSearch && (
            <Tabs items={tabItems} withPadding={false} withMargin={false} />
          )}
        </div>
      </section>
    </PageBase>
  );
};
