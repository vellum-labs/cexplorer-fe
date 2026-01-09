import type { FC } from "react";

import { colors } from "@/constants/colors";
import { enabledWalletConnector } from "@/constants/confVariables";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";
import { useNestedNavigationOptions } from "@/hooks/useNestedNavigationOptions";
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
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { configJSON } from "@/constants/conf";

interface NavbarProps {
  randomTopAd?: boolean;
}

const Navbar: FC<NavbarProps> = ({ randomTopAd }) => {
  const { t } = useAppTranslation("navigation");
  const { theme } = useThemeStore();
  const price = useAdaPriceWithHistory();
  const { navigationOptions, labels } = useNavigationOptions();
  const { nestedNavigationOptions } = useNestedNavigationOptions();

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
                label={labels.blockchain}
                options={navigationOptions.blockchain}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='staking'
                label={labels.staking}
                options={navigationOptions.staking}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='governance'
                label={labels.governance}
                options={navigationOptions.governance}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='tokens'
                label={labels.tokens}
                options={navigationOptions.tokens}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='nfts'
                label={labels.nfts}
                options={navigationOptions.nfts}
                withBorder
                wrapperClassname='z-[50]'
              />
              <Dropdown
                id='education'
                label={labels.education}
                options={navigationOptions.education}
                withBorder
                wrapperClassname='z-[50]'
              />
              <ScreenDropdown
                id='analytics'
                label={labels.analytics}
                options={nestedNavigationOptions.analyticsOptions}
                randomTopAd={randomTopAd}
                card={
                  <InfoCard
                    icon={<Cardano size={24} color={colors.primary} />}
                    title={
                      <span className='text-text-lg font-semibold'>
                        {t("navbar.poweredBy")}{" "}
                        <span className='text-primary'>{t("navbar.cardanoBlockchain")}</span>
                      </span>
                    }
                    className='bg-darker'
                  >
                    <p className='font-regular'>
                      {t("navbar.apiDescription")}
                    </p>
                    <Button
                      className='mt-auto'
                      label={t("navbar.startBuilding")}
                      rightIcon={<ArrowRight />}
                      variant='primary'
                      size='lg'
                    />
                  </InfoCard>
                }
              />
              <ScreenDropdown
                id='more'
                label={labels.more}
                options={nestedNavigationOptions.moreOptions}
                randomTopAd={randomTopAd}
                card={
                  <InfoCard
                    icon={<ChevronsUp color={colors.purpleText} />}
                    title={
                      <span className='text-text-lg font-semibold'>
                        {t("navbar.getCexplorer")}{" "}
                        <span className='text-purpleText'>{t("navbar.pro")}</span>
                      </span>
                    }
                    className='bg-darker'
                  >
                    <p className='font-regular'>
                      {t("navbar.apiDescription")}
                    </p>
                    <Button
                      href='/pro'
                      className='mt-auto'
                      label={t("navbar.getPro")}
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
