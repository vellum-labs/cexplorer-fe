import { Button } from "@vellumlabs/cexplorer-sdk";
import { InfoCard } from "@/components/global/cards/InfoCard";
import { Accordion } from "@vellumlabs/cexplorer-sdk";
import { colors } from "@/constants/colors";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import type { MenuItem } from "@/types/navigationTypes";
import { ArrowRight, ChevronLeft, ChevronsUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { MobileMenuAccordionItem } from "@vellumlabs/cexplorer-sdk";

interface Props {
  onBack?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  power?: number;
}

export const MoreMobileItems = ({ onBack, setOpen, power }: Props) => {
  const menuItems: MenuItem[] = [
    {
      label: "Tools",
      icon: "wrench",
      items: nestedNavigationOptions.moreOptions["tools"].options,
    },
    {
      label: "Services",
      icon: "database",
      items: nestedNavigationOptions.moreOptions["services"].options,
    },
    {
      label: "Cexplorer",
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
        <span>Analytics</span>
      </button>
      {power === 0 && (
        <InfoCard
          icon={<ChevronsUp color={colors.purpleText} />}
          title={
            <span className='text-text-lg font-semibold'>
              Get Cexplorer.io <span className='text-purpleText'>PRO</span>
            </span>
          }
          className='max-h-[200px] bg-darker'
        >
          <p className='text-text-xs font-regular'>
            Access Our API for Comprehensive Blockchain Data and Build Your
            Next-Level dApp!
          </p>
          <Button
            className='mt-auto'
            label='Get PRO'
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
