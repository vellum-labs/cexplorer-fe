import type { FC } from "react";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuItems } from "./MenuItems";

import { useFetchUserInfo } from "@/services/user";
import type { MobileMenuScreen } from "@/types/navigationTypes";
import { useState } from "react";
import { AnalyticsMobileItems } from "./AnalyticsMobileItems";
import { GovernanceMobileItems } from "./GovernanceMobileItems";
import { MoreMobileItems } from "./MoreMobileItems";
import { SettingsMobileItems } from "./settingsMobileItems/SettingsMobileItems";
import { StakingMobileItems } from "./StakingMobileItems";

const MobileMenu: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<MobileMenuScreen>(null);
  const infoQuery = useFetchUserInfo();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        setActiveMenu(null);
      }}
    >
      <SheetTrigger>
        <Menu size={25} />
      </SheetTrigger>
      <SheetContent className='hide-scrollbar overflow-y-auto'>
        {activeMenu === "settings" ? (
          <SettingsMobileItems onBack={() => setActiveMenu(null)} />
        ) : activeMenu === "analytics" ? (
          <AnalyticsMobileItems
            onBack={() => setActiveMenu(null)}
            setOpen={setIsOpen}
            power={infoQuery.data?.data?.membership.nfts}
          />
        ) : activeMenu === "more" ? (
          <MoreMobileItems
            onBack={() => setActiveMenu(null)}
            setOpen={setIsOpen}
            power={infoQuery.data?.data?.membership?.nfts}
          />
        ) : activeMenu === "staking" ? (
          <StakingMobileItems
            onBack={() => setActiveMenu(null)}
            setOpen={setIsOpen}
          />
        ) : activeMenu === "governance" ? (
          <GovernanceMobileItems
            onBack={() => setActiveMenu(null)}
            setOpen={setIsOpen}
          />
        ) : (
          <MenuItems setOpen={setIsOpen} setActiveMenu={setActiveMenu} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
