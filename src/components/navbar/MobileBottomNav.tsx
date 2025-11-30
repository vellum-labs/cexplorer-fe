import type { FC } from "react";
import { Wallet, Settings, Search, Menu } from "lucide-react";
import CexLogo from "@/resources/images/cexLogo.svg";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MenuItems } from "./MobileMenu/MenuItems";
import { AnalyticsMobileItems } from "./MobileMenu/AnalyticsMobileItems";
import { GovernanceMobileItems } from "./MobileMenu/GovernanceMobileItems";
import { MoreMobileItems } from "./MobileMenu/MoreMobileItems";
import { SettingsMobileItems } from "./MobileMenu/settingsMobileItems/SettingsMobileItems";
import { StakingMobileItems } from "./MobileMenu/StakingMobileItems";
import { useFetchUserInfo } from "@/services/user";
import type { MobileMenuScreen } from "@/types/navigationTypes";
import ConnectWalletModal from "../wallet/ConnectWalletModal";
import { useWalletStore } from "@/stores/walletStore";
import { GlobalSearch } from "@vellumlabs/cexplorer-sdk";
import { useNavigate } from "@tanstack/react-router";

export const MobileBottomNav: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<MobileMenuScreen>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [autoOpenWallet, setAutoOpenWallet] = useState(false);
  const infoQuery = useFetchUserInfo();
  const { address, walletType } = useWalletStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (showSearchModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSearchModal]);

  const handleLogo = () => {
    window.scrollTo({ top: 0 });
    navigate({ to: "/" });
  };

  return (
    <>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      <nav
        className='fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border bg-background px-4 md:hidden'
        style={{
          boxShadow:
            "0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          className='flex flex-col items-center gap-1'
          onClick={() => {
            if (address && walletType) {
              setActiveMenu(null);
              setAutoOpenWallet(true);
              setIsOpen(true);
            } else {
              setShowWalletModal(true);
            }
          }}
        >
          <Wallet size={24} className='text-grayTextPrimary' />
        </button>

        <button
          className='flex flex-col items-center gap-1'
          onClick={() => {
            setActiveMenu("settings");
            setIsOpen(true);
          }}
        >
          <Settings size={24} className='text-grayTextPrimary' />
        </button>

        <div
          className='rounded-full flex h-12 w-12 flex-col items-center justify-center gap-1'
          onClick={handleLogo}
        >
          <img src={CexLogo} alt='Cexplorer' className='h-7 w-7' />
        </div>

        <button
          className='flex flex-col items-center gap-1'
          onClick={() => setShowSearchModal(true)}
        >
          <Search size={24} className='text-grayTextPrimary' />
        </button>

        <Sheet
          open={isOpen}
          onOpenChange={() => {
            setIsOpen(!isOpen);
            setActiveMenu(null);
            setAutoOpenWallet(false);
          }}
        >
          <SheetTrigger asChild>
            <button className='flex flex-col items-center gap-1'>
              <Menu size={24} className='text-grayTextPrimary' />
            </button>
          </SheetTrigger>
          <SheetContent className='hide-scrollbar overflow-y-auto'>
            <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
            <SheetDescription className='sr-only'>
              Access navigation options, settings, and account features
            </SheetDescription>
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
              <MenuItems
                setOpen={setIsOpen}
                setActiveMenu={setActiveMenu}
                autoOpenWallet={autoOpenWallet}
              />
            )}
          </SheetContent>
        </Sheet>
      </nav>

      {showSearchModal && (
        <div
          className='bg-black/60 fixed inset-0 z-[100] flex items-start justify-center pt-20 backdrop-blur-sm'
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className='w-full max-w-2xl px-4'
            onClick={e => e.stopPropagation()}
          >
            <GlobalSearch />
          </div>
        </div>
      )}
    </>
  );
};
