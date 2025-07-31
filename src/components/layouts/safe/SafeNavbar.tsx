import type { FC } from "react";

import { colors } from "@/constants/colors";
import { enabledWalletConnector } from "@/constants/confVariables";
import { navigationOptions } from "@/constants/navigationOptions";
import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { Cardano } from "@/resources/images/icons/Cardano";
import { ArrowRight, ChevronsUp } from "lucide-react";
import Button from "../../global/Button";
import MainLogo from "../../global/MainLogo";
import { InfoCard } from "../../global/cards/InfoCard";
import Dropdown from "../../global/dropdowns/Dropdown";
import { ScreenDropdown } from "../../global/dropdowns/ScreenDropdown";
import SettingsDropdown from "../../global/dropdowns/SettingsDropdown";
import MobileMenu from "../../navbar/MobileMenu/MobileMenu";
import WalletButton from "../../wallet/WalletButton";
import { LayoutNotification } from "@/utils/LayoutNotification";
import { useThemeStore } from "@/stores/themeStore";

export const SafeNavbar: FC = () => {
  const { theme } = useThemeStore();

  return (
    <header>
      <nav className='flex h-[75px] w-full items-center justify-center border-b border-borderFaded bg-cardBg py-md pr-md lg:pr-0'>
        <div className='flex w-full max-w-desktop justify-between p-mobile md:px-desktop md:py-mobile'>
          <div className='flex items-center gap-2'>
            <MainLogo className='-translate-x-[6px]' />
          </div>
          <div className='hidden items-center gap-5 xl:flex xl:h-[75px]'>
            <Dropdown
              id='blockchain'
              label='Blockchain'
              options={navigationOptions.blockchain}
            />
            <Dropdown
              id='staking'
              label='Staking'
              options={navigationOptions.staking}
            />
            <Dropdown
              id='governance'
              label='Governance'
              options={navigationOptions.governance}
            />
            <Dropdown
              id='tokens'
              label='Tokens'
              options={navigationOptions.tokens}
            />
            <Dropdown id='nfts' label='NFTs' options={navigationOptions.nfts} />
            <Dropdown
              id='education'
              label='Education'
              options={navigationOptions.education}
            />
            <ScreenDropdown
              id='analytics'
              label='Analytics'
              options={nestedNavigationOptions.analyticsOptions}
              closeOnSelect
              card={
                <InfoCard
                  icon={<Cardano size={24} color={colors.primary} />}
                  title={
                    <span className='text-lg font-semibold'>
                      Powered by{" "}
                      <span className='text-primary'>Cardano Blockchain</span>
                    </span>
                  }
                  className='bg-darker'
                >
                  <p className='font-normal'>
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
              closeOnSelect
              card={
                <InfoCard
                  icon={<ChevronsUp color={colors.purpleText} />}
                  title={
                    <span className='text-lg font-semibold'>
                      Get Cexplorer.io{" "}
                      <span className='text-purpleText'>PRO</span>
                    </span>
                  }
                  className='bg-darker'
                >
                  <p className='font-normal'>
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
          <div className='hidden items-center gap-5 md:flex'>
            {enabledWalletConnector && <WalletButton />}
            <SettingsDropdown />
          </div>
        </div>
        <MobileMenu />
      </nav>
      <LayoutNotification
        storeKey='bug-bounty-2025'
        message='Cexplorer Bug Bounty is Live! Find bugs, earn $ADA. More details '
        link={{
          text: "here",
          href: "/bounty",
        }}
        backgroundColor={theme === "light" ? "#0094d4" : "#79defd"}
        textColor={theme === "light" ? "#ffffff" : "#101828"}
        startTime={new Date("2025-06-23T00:00:00Z")}
        endTime={new Date("2026-01-01T00:00:00Z")}
      />
    </header>
  );
};
