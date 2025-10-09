import Button from "@/components/global/Button";
import { InfoCard } from "@/components/global/cards/InfoCard";
import { Accordion } from "@/components/ui/accordion";
import { colors } from "@/constants/colors";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { Cardano } from "@/resources/images/icons/Cardano";
import type { MenuItem } from "@/types/navigationTypes";
import { ArrowRight, ChevronLeft } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import MobileMenuAccordionItem from "../MobileMenuAccordionItem";

interface Props {
  onBack?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  power?: number;
}

export const AnalyticsMobileItems = ({ onBack, setOpen, power }: Props) => {
  const menuItems: MenuItem[] = [
    {
      label: "dApps",
      icon: "layout-grid",
      items: nestedNavigationOptions.analyticsOptions["dapps"].options,
      href: nestedNavigationOptions.analyticsOptions["dapps"].labelHref,
    },
    {
      label: "Accounts",
      icon: "users",
      items: nestedNavigationOptions.analyticsOptions["accounts"].options,
      href: nestedNavigationOptions.analyticsOptions["accounts"].labelHref,
    },
    {
      label: "Network",
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
        <span>Analytics</span>
      </button>
      {power === 0 && (
        <InfoCard
          icon={<Cardano size={24} color={colors.primary} />}
          title={
            <span className='text-text-lg font-semibold'>
              Powered by{" "}
              <span className='text-primary'>Cardano Blockchain</span>
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
            label='Start building'
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
