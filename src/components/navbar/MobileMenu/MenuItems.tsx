import type { MenuItem, MobileMenuScreen } from "@/types/navigationTypes";
import type { Dispatch, FC, SetStateAction } from "react";

import { navigationOptions } from "@/constants/navigationOptions";

import { MainLogo } from "@vellumlabs/cexplorer-sdk";
import { Accordion } from "@vellumlabs/cexplorer-sdk";
import WalletButton from "@/components/wallet/WalletButton";
import { enabledWalletConnector } from "@/constants/confVariables";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ChevronRight, ChevronRightIcon, LineChart } from "lucide-react";
import { MobileMenuAccordionItem } from "@vellumlabs/cexplorer-sdk";
import SettingsMobile from "../SettingsMobile";
import { AdaPriceIndicator } from "@vellumlabs/cexplorer-sdk";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

import { configJSON } from "@/constants/conf";

interface MenuItemsProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setActiveMenu: Dispatch<SetStateAction<MobileMenuScreen>>;
  autoOpenWallet?: boolean;
}

export const MenuItems: FC<MenuItemsProps> = ({ setOpen, setActiveMenu, autoOpenWallet = false }) => {
  const price = useAdaPriceWithHistory();

  const menuItems: MenuItem[] = [
    {
      label: "Blockchain",
      icon: "link-2",
      items: navigationOptions.blockchain,
    },
    {
      label: "Staking",
      icon: "layers",
      items: navigationOptions.staking,
    },
    {
      label: "Governance",
      icon: "shield",
      items: navigationOptions.governance,
    },
    {
      label: "Tokens",
      icon: "coins",
      items: navigationOptions.tokens,
    },
    {
      label: "NFTs",
      icon: "image",
      items: navigationOptions.nfts,
    },
    {
      label: "Education",
      icon: "book-open",
      items: navigationOptions.education,
    },
  ];

  return (
    <>
      <MainLogo
        className='-translate-x-1'
        size={120}
        onClick={() => setOpen(false)}
        network={configJSON.network}
      />
      <Accordion className='' type='single' collapsible>
        {menuItems.map((menuItem, index) => (
          <MobileMenuAccordionItem
            key={index}
            {...menuItem}
            items={menuItem.items.map(item => ({
              ...item,
              label: item.nestedOptions ? (
                <span className='flex items-center justify-between'>
                  {item.label} <ChevronRight size={15} />
                </span>
              ) : (
                item.label
              ),
              href: item.nestedOptions ? undefined : item.href,
              onClick: () => {
                item.nestedOptions
                  ? setActiveMenu(
                      menuItem.label.toLowerCase() as MobileMenuScreen,
                    )
                  : setOpen(false);
              },
            }))}
            setIsOpen={setOpen}
          />
        ))}
      </Accordion>
      <button
        className={`mt-3 flex h-[40px] w-full items-center gap-1.5 py-1 hover:underline`}
        onClick={() => setActiveMenu("analytics")}
      >
        <LineChart height={20} width={20} />
        <span className='font-medium'>Analytics</span>
        <ChevronRightIcon
          height={16}
          width={16}
          className='ml-auto'
          strokeWidth={1.6}
        />
      </button>
      <button
        className={`mt-3 flex h-[40px] w-full items-center gap-1.5 py-1 hover:underline`}
        onClick={() => setActiveMenu("more")}
      >
        <DotsVerticalIcon height={20} width={20} />
        <span className='font-medium'>More</span>
        <ChevronRightIcon
          height={16}
          width={16}
          className='ml-auto'
          strokeWidth={1.6}
        />
      </button>
      <SettingsMobile
        className='mb-3 mt-4'
        onClick={() => setActiveMenu("settings")}
      />
      <div className='flex w-full flex-col md:hidden'>
        {enabledWalletConnector && <WalletButton variant='long' autoOpen={autoOpenWallet} />}
      </div>
      <div className='w-full pt-1.5' onClick={() => setOpen(false)}>
        <AdaPriceIndicator price={price} />
      </div>
    </>
  );
};
