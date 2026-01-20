import { Button } from "@vellumlabs/cexplorer-sdk";
import { InfoCard } from "@vellumlabs/cexplorer-sdk";
import { Accordion } from "@vellumlabs/cexplorer-sdk";
import { colors } from "@/constants/colors";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import type { MenuItem } from "@/types/navigationTypes";
import { ArrowRight, ChevronLeft, ChevronsUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { MobileMenuAccordionItem } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  onBack?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  power?: number;
}

export const MoreMobileItems = ({ onBack, setOpen, power }: Props) => {
  const { t } = useAppTranslation("navigation");

  const menuItems: MenuItem[] = [
    {
      label: t("main.tools"),
      icon: "wrench",
      items: nestedNavigationOptions.moreOptions["tools"].options,
    },
    {
      label: t("main.services"),
      icon: "database",
      items: nestedNavigationOptions.moreOptions["services"].options,
    },
    {
      label: t("main.cexplorer"),
      icon: "notebook-text",
      items: nestedNavigationOptions.moreOptions["cexplorer"].options,
    },
  ];

  return (
    <>
      <button
        onClick={onBack}
        className='mb-1 flex h-[34px] -translate-x-1 items-center gap-1 font-medium'
      >
        <ChevronLeft size={20} className='font-regular' />
        <span>{t("main.more")}</span>
      </button>
      {power === 0 && (
        <InfoCard
          icon={<ChevronsUp color={colors.purpleText} />}
          title={
            <span className='text-text-lg font-semibold'>
              {t("navbar.getCexplorer")}{" "}
              <span className='text-purpleText'>{t("navbar.pro")}</span>
            </span>
          }
          className='max-h-[200px] bg-darker'
        >
          <p className='text-text-xs font-regular'>
            {t("navbar.apiDescription")}
          </p>
          <Button
            className='mt-auto'
            label={t("navbar.getPro")}
            rightIcon={<ArrowRight />}
            variant='purple'
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
