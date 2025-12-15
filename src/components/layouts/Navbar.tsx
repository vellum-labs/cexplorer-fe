import type { FC } from "react";

import { colors } from "@/constants/colors";
import { enabledWalletConnector } from "@/constants/confVariables";
import { navigationOptions } from "@/constants/navigationOptions";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { Cardano } from "@vellumlabs/cexplorer-sdk";
import { ArrowRight, ChevronsUp } from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { MainLogo } from "@vellumlabs/cexplorer-sdk";
import { InfoCard } from "@vellumlabs/cexplorer-sdk";
import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { ScreenDropdown } from "@vellumlabs/cexplorer-sdk";
import SettingsDropdown from "../global/dropdowns/SettingsDropdown";
import { AdaPriceIndicator } from "@vellumlabs/cexplorer-sdk";
import { MobileBottomNav } from "../navbar/MobileBottomNav";
import MobileMenu from "../navbar/MobileMenu/MobileMenu";
import WalletButton from "../wallet/WalletButton";
import { LayoutNotification } from "@/utils/LayoutNotification";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

import { configJSON } from "@/constants/conf";

interface NavbarProps {
  randomTopAd?: boolean;
}

const Navbar: FC<NavbarProps> = ({ randomTopAd }) => {
  const { theme } = useThemeStore();
  const price = useAdaPriceWithHistory();

  return (
    <>
      <header>
        <nav className='flex h-[75px] w-full items-center justify-center border-b border-borderFaded bg-cardBg py-2 pr-2 lg:pr-0'>
          <div className='flex w-full max-w-desktop justify-between p-mobile md:px-desktop md:py-mobile'>
            <div className='flex items-center gap-1'>
              <MainLogo
                className='-translate-x-[6px]'
                network={configJSON.network}
              />
              <div className='hidden xl:contents'>
                <AdaPriceIndicator price={price} />
              </div>
            </div>
            <div className='hidden items-center gap-2 xl:flex xl:h-[75px]'>
              <Dropdown
                id='blockchain'
                label='Blockchain'
                options={navigationOptions.blockchain}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='staking'
                label='Staking'
                options={navigationOptions.staking}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='governance'
                label='Governance'
                options={navigationOptions.governance}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='tokens'
                label='Tokens'
                options={navigationOptions.tokens}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='nfts'
                label='NFTs'
                options={navigationOptions.nfts}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='education'
                label='Education'
                options={navigationOptions.education}
                withBorder
                wrapperClassname='z-[50]'
              />
              <ScreenDropdown
                id='analytics'
                label='Analytics'
                options={nestedNavigationOptions.analyticsOptions}
                randomTopAd={randomTopAd}
                card={
                  <InfoCard
                    icon={<Cardano size={24} color={colors.primary} />}
                    title={
                      <span className='text-text-lg font-semibold'>
                        Powered by{" "}
                        <span className='text-primary'>Cardano Blockchain</span>
                      </span>
                    }
                    className='bg-darker'
                  >
                    <p className='font-regular'>
                      Access Our API for Comprehensive Blockchain Data and Build
                      Your Next-Level dApp!
                    </p>
                    <Button
                      className='mt-auto'
                      label='Start building'
                      rightIcon={<ArrowRight />}
                      variant='primary'
                      size='lg'
                    />
                  </InfoCard>
                }
              />
              <ScreenDropdown
                id='more'
                label='More'
                options={nestedNavigationOptions.moreOptions}
                randomTopAd={randomTopAd}
                card={
                  <InfoCard
                    icon={<ChevronsUp color={colors.purpleText} />}
                    title={
                      <span className='text-text-lg font-semibold'>
                        Get Cexplorer.io{" "}
                        <span className='text-purpleText'>PRO</span>
                      </span>
                    }
                    className='bg-darker'
                  >
                    <p className='font-regular'>
                      Access Our API for Comprehensive Blockchain Data and Build
                      Your Next-Level dApp!
                    </p>
                    <Button
                      href='/pro'
                      className='mt-auto'
                      label='Get PRO'
                      rightIcon={<ArrowRight />}
                      variant='purple'
                      size='lg'
                    />
                  </InfoCard>
                }
              />
            </div>
            <div className='hidden items-center gap-3 md:flex'>
              {enabledWalletConnector && <WalletButton />}
              <SettingsDropdown withBorder />
            </div>
          </div>
          <div className='hidden md:block xl:hidden'>
            <MobileMenu />
          </div>
        </nav>
        <LayoutNotification
          storeKey='navbar-line-1'
          message="👋 Welcome to Cexplorer 2.0! We're still in active development and putting the final touches on a few things. Since treasury withdrawal voting is underway, we wanted to give you an early look at what we're building right now. "
          link={{
            text: "Treasury Withdrawal Leaderboard",
            href: "/gov/drep-vote/",
          }}
          backgroundColor={theme === "light" ? "#0094d4" : "#79defd"}
          textColor={theme === "light" ? "#ffffff" : "#101828"}
          startTime={new Date("2025-06-23T00:00:00Z")}
          endTime={new Date("2025-08-20T00:00:00Z")}
        />
      </header>
      <MobileBottomNav />
    </>
  );
};

export default Navbar;
