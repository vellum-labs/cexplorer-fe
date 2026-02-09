import type { FC } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { TableSearchInput, LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { RewardsTab } from "../../components/tax-tool/tabs/RewardsTab";
import { WithdrawalsTab } from "../../components/tax-tool/tabs/WithdrawalsTab";
import { CircleAlert } from "lucide-react";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const TaxToolPage: FC = () => {
  const { t } = useAppTranslation();
  const { stake } = useSearch({
    from: "/tax-tool/",
  });

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>(() => {
    const saved = localStorage.getItem("tax_tool_stake_key");
    return stake ?? saved ?? "";
  });
  const debouncedSearch = useDebounce(search);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (stake && isValidAddress(stake)) {
      localStorage.setItem("tax_tool_stake_key", stake);
      setSearch(stake);
    }
  }, [stake]);

  useEffect(() => {
    if (debouncedSearch && !isValidAddress(debouncedSearch)) {
      toast.error(t("taxTool.invalidStakeAddress"));
      setIsValid(false);
    } else if (debouncedSearch) {
      setIsValid(true);
      localStorage.setItem("tax_tool_stake_key", debouncedSearch);

      navigate({
        to: "/tax-tool/",
        search: { stake: debouncedSearch },
        replace: true,
      });
    } else {
      setIsValid(false);

      navigate({
        to: "/tax-tool/",
        search: {},
        replace: true,
      });
    }
  }, [debouncedSearch, navigate]);

  const isDebouncing = search !== debouncedSearch && search.length > 0;

  const tabItems = useMemo(
    () => [
      {
        key: "rewards",
        label: t("tabs.taxTool.rewards"),
        title: t("tabs.taxTool.rewards"),
        content: <RewardsTab stakeKey={debouncedSearch} />,
        visible: true,
      },
      {
        key: "withdrawals",
        label: t("tabs.taxTool.withdrawals"),
        title: t("tabs.taxTool.withdrawals"),
        content: <WithdrawalsTab stakeKey={debouncedSearch} />,
        visible: true,
      },
    ],
    [debouncedSearch, t],
  );

  return (
    <PageBase
      metadataTitle='taxTool'
      title={t("pages:taxTool.title")}
      breadcrumbItems={[{ label: t("pages:breadcrumbs.taxTool") }]}
      adsCarousel={false}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-2 p-mobile md:p-desktop'>
          <div className='flex items-start gap-2 rounded-m border border-border p-2'>
            <CircleAlert className='mt-0.5 text-primary' size={18} />
            <div className='flex flex-col gap-1 text-text-sm'>
              <p className='font-medium text-text'>
                {t("taxTool.disclaimer.title")}
              </p>
              <p className='text-grayTextPrimary'>
                {t("taxTool.disclaimer.subtitle")}
              </p>
            </div>
          </div>

          <div className='flex w-full'>
            <TableSearchInput
              value={search}
              onchange={val => setSearch(val)}
              placeholder={t("placeholders.stakeKey")}
              showSearchIcon
              wrapperClassName='w-full'
              showPrefixPopup={false}
            />
          </div>

          {isDebouncing ? (
            <div className='flex flex-col gap-2 pt-3'>
              <div className='flex gap-2'>
                <LoadingSkeleton height='40px' width='100px' />
                <LoadingSkeleton height='40px' width='120px' />
              </div>
              <div className='flex flex-col gap-3'>
                <LoadingSkeleton height='24px' width='200px' />
                <div className='flex flex-col gap-2'>
                  <LoadingSkeleton height='200px' width='100%' />
                  <LoadingSkeleton height='400px' width='100%' />
                </div>
              </div>
            </div>
          ) : (
            debouncedSearch &&
            isValid && (
              <Tabs items={tabItems} withPadding={false} withMargin={false} />
            )
          )}
        </div>
      </section>
    </PageBase>
  );
};
