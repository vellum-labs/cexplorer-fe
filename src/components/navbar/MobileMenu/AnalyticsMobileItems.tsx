import { Button } from "@vellumlabs/cexplorer-sdk";
import { InfoCard } from "@vellumlabs/cexplorer-sdk";
import { Accordion } from "@vellumlabs/cexplorer-sdk";
import { colors } from "@/constants/colors";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { Cardano } from "@vellumlabs/cexplorer-sdk";
import type { MenuItem } from "@/types/navigationTypes";
import { ArrowRight, ChevronLeft } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { MobileMenuAccordionItem } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  onBack?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  power?: number;
}

export const AnalyticsMobileItems = ({ onBack, setOpen, power }: Props) => {
  const { t } = useAppTranslation("navigation");

  const menuItems: MenuItem[] = [
    {
      label: t("analytics.dapps"),
      icon: "layout-grid",
      items: nestedNavigationOptions.analyticsOptions["dapps"].options,
      href: nestedNavigationOptions.analyticsOptions["dapps"].labelHref,
    },
    {
      label: t("analytics.accounts"),
      icon: "users",
      items: nestedNavigationOptions.analyticsOptions["accounts"].options,
      href: nestedNavigationOptions.analyticsOptions["accounts"].labelHref,
    },
    {
      label: t("analytics.network"),
      icon: "network",
      items: [
        ...nestedNavigationOptions.analyticsOptions["network"].options,
        ...nestedNavigationOptions.analyticsOptions["others"].options,
      ],
      href: nestedNavigationOptions.analyticsOptions["network"].labelHref,
    },
  ];

  return (
    <>
      <button
        onClick={onBack}
        className='mb-1 flex h-[34px] -translate-x-1 items-center gap-1 font-medium'
      >
        <ChevronLeft size={20} className='font-regular' />
        <span>{t("main.analytics")}</span>
      </button>
      {power === 0 && (
        <InfoCard
          icon={<Cardano size={24} color={colors.primary} />}
          title={
            <span className='text-text-lg font-semibold'>
              {t("navbar.poweredBy")}{" "}
              <span className='text-primary'>{t("navbar.cardanoBlockchain")}</span>
            </span>
          }
          className='max-h-[200px] bg-darker'
        >
          <p className='text-text-xs font-regular'>
            {t("navbar.apiDescription")}
          </p>
          <Button
            className='mt-auto'
            label={t("navbar.startBuilding")}
            rightIcon={<ArrowRight />}
            variant='primary'
            size='sm'
          />
        </InfoCard>
      )}
      <Accordion className='' type='single' collapsible>
        {menuItems.map((item, index) => (
          <MobileMenuAccordionItem key={index} {...item} setIsOpen={setOpen} />
        ))}
      </Accordion>
    </>
  );
};
