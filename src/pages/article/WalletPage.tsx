import type { CompareWallet } from "@/types/walletTypes";
import type { FC } from "react";

import { HeaderBanner } from "@/components/global/HeaderBanner";
import AdsCarousel from "@/components/global/ads/AdsCarousel";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { WalletRow } from "@/components/wallet/WalletRow";
import Android from "@/resources/images/platforms/android.svg";
import AndroidDark from "@/resources/images/platforms/android_dark.svg";
import Apple from "@/resources/images/platforms/apple.svg";
import AppleDark from "@/resources/images/platforms/apple_dark.svg";
import PC from "@/resources/images/platforms/pc.svg";
import PCDark from "@/resources/images/platforms/pc_dark.svg";
import ApexFusion from "@/resources/images/wallet/apexfusion.svg";
import Bitcoin from "@/resources/images/wallet/bitcoin.svg";
import KeyStoneDark from "@/resources/images/wallet/keystone-dark.svg";
import KeyStone from "@/resources/images/wallet/keystone.svg";
import LedgerDark from "@/resources/images/wallet/ledger-dark.svg";
import Ledger from "@/resources/images/wallet/ledger.svg";
import TrezorDark from "@/resources/images/wallet/trezor-dark.svg";
import Trezor from "@/resources/images/wallet/trezor.svg";
import { CircleCheck, CircleHelp, Minus } from "lucide-react";
import { Helmet } from "react-helmet";

import { useFetchCompareWallets } from "@/services/wallet";
import { useCompareWalletsStore } from "@/stores/tables/compareWalletsStore";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect, useState } from "react";

import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";

import { Select, SelectTrigger } from "@/components/ui/select";
import { webUrl } from "@/constants/confVariables";
import { useLocation } from "@tanstack/react-router";
import { configJSON } from "@/constants/conf";

export const WalletPage: FC = () => {
  const { theme } = useThemeStore();
  const { data, isLoading } = useFetchCompareWallets();

  const [compareWalletOptions, setCompareWalletOptions] = useState<
    {
      label: string;
      isVisible: boolean;
      onClick: () => void;
    }[]
  >([]);
  const description = data?.data.description;
  const keywords = data?.data.keywords;
  const name = data?.data.name;
  const [walletsData, setWalletsData] = useState<CompareWallet[]>([]);
  const location = useLocation();

  const { supportedWallets } = configJSON;

  const { columnsVisibility, setColumnVisibility, removeColumnVisibility } =
    useCompareWalletsStore();

  useEffect(() => {
    if (!isLoading && Array.isArray(data?.data.data)) {
      const columnsKeys = Object.keys(columnsVisibility);

      for (let i = 0; i < columnsKeys.length; i++) {
        const findData = data?.data.data[0].find(
          item => item.internalName === columnsKeys[i],
        );

        if (!findData) {
          removeColumnVisibility(columnsKeys[i]);
        }
      }
    }
  }, [columnsVisibility, data, isLoading]);

  useEffect(() => {
    const columnsVisibilityEntries = Object.entries(columnsVisibility);

    if (columnsVisibilityEntries.length) {
      setCompareWalletOptions(
        columnsVisibilityEntries.map(([label, isVisible]) => ({
          label: label[0].toUpperCase() + label.substring(1).toLowerCase(),
          isVisible,
          onClick: () => setColumnVisibility(label, !isVisible),
        })),
      );
    }
  }, [columnsVisibility]);

  useEffect(() => {
    if (Array.isArray(data?.data?.data) && !isLoading) {
      const walletData = data?.data?.data[0];
      for (let i = 0; i < walletData.length; i++) {
        if (
          typeof columnsVisibility[walletData[i].internalName] === "undefined"
        ) {
          setColumnVisibility(walletData[i].internalName, true);
        }
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (Array.isArray(data?.data?.data) && !isLoading) {
      const walletsPos = Object.entries(supportedWallets[0]).filter(
        ([walletName]) =>
          data?.data?.data[0].find(item => item.internalName === walletName),
      );

      const walletDataInstance = data?.data?.data[0].filter(
        item =>
          typeof columnsVisibility[item.internalName] === "undefined" ||
          columnsVisibility[item.internalName],
      );

      setWalletsData(
        walletDataInstance.sort((a, b) => {
          const walletA = walletsPos.find(([name]) => a.internalName === name);
          const walletB = walletsPos.find(([name]) => b.internalName === name);

          if (walletA && walletB) {
            return walletA[1][0].pos - walletB[1][0].pos;
          }

          if (walletA) return -1;
          if (walletB) return 1;

          return 0;
        }),
      );
    }
  }, [columnsVisibility, data, isLoading]);

  const columns = [
    {
      key: "basic_features",
      title: (
        <div className='flex h-full w-full items-end px-6 pb-4'>
          <span className='text-center text-sm font-semibold text-primary'>
            Basic features
          </span>
        </div>
      ),
      cells: walletsData.map(({ internalName }) => (
        <div className='flex h-full w-full items-end justify-center pb-4'>
          <span className='text-center text-sm font-semibold'>
            {internalName &&
              internalName[0].toUpperCase() +
                internalName.substring(1).toLowerCase()}
          </span>
        </div>
      )),
      darker: false,
    },
    {
      key: "supported_platforms",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Supported platforms</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ supportedPlatforms }) => (
        <div className='flex h-full w-full flex-wrap items-center justify-center gap-3 p-4'>
          {supportedPlatforms?.web && (
            <img src={theme === "light" ? PC : PCDark} alt='Web' />
          )}
          {supportedPlatforms?.iOS && (
            <img src={theme === "light" ? Apple : AppleDark} alt='Apple' />
          )}
          {supportedPlatforms?.android && (
            <img
              src={theme === "light" ? Android : AndroidDark}
              alt='Android'
            />
          )}
        </div>
      )),
      darker: true,
      dynamicHeight: true,
      className: "!min-h-[64px]",
      wrapperClassname: "items-normal",
    },
    {
      key: "opensource",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Opensource</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ opensource }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {opensource ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
    },
    {
      key: "smart_contracts_interaction",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>
            Smart contracts interaction
          </span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ smartContractInteraction }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {smartContractInteraction ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
    },
    {
      key: "testnet_support",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Testnet support</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ testnetSupport }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {testnetSupport ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
    },
    {
      key: "hardware_wallet_compatibility",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-nowrap text-sm font-medium'>
            Hardware wallet compatibility
          </span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ hardwareWalletCompatibility }) => (
        <div className='flex h-full w-full flex-wrap items-center justify-center gap-3'>
          {hardwareWalletCompatibility?.ledger && (
            <img
              src={theme === "light" ? Ledger : LedgerDark}
              alt='Ledger'
              className='!h-[22px] !w-[20px]'
            />
          )}
          {hardwareWalletCompatibility?.trezor && (
            <img
              src={theme === "light" ? Trezor : TrezorDark}
              alt='Trezor'
              className='!h-[22px] !w-[20px]'
            />
          )}
          {hardwareWalletCompatibility?.keystone && (
            <img
              src={theme === "light" ? KeyStone : KeyStoneDark}
              alt='Ledger'
              className='!h-[22px] !w-[20px]'
            />
          )}
        </div>
      )),
      darker: true,
      dynamicHeight: true,
      className: "py-4 !min-h-[64px]",
      wrapperClassname: "items-normal",
    },
    {
      key: "cross_chain_compatibility",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-nowrap text-sm font-medium'>
            Cross-chain compatibility
          </span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ crossChainCompatibility }) => {
        return (
          <div className='flex h-full w-full items-center justify-center gap-3'>
            {crossChainCompatibility?.enabled ? (
              <div className='flex h-full w-full flex-wrap items-center justify-center gap-3'>
                {crossChainCompatibility?.supportedChains.map(item => (
                  <>
                    {item === "Apex Fusion" && (
                      <img
                        src={ApexFusion}
                        alt='ApexFusion'
                        className='!h-[22px] !w-[20px]'
                      />
                    )}
                    {item === "Bitcoin" && (
                      <img
                        src={Bitcoin}
                        alt='Bitcoin'
                        className='!h-[22px] !w-[20px]'
                      />
                    )}
                  </>
                ))}
              </div>
            ) : (
              <Minus className='text-[#98A2B3]' />
            )}
          </div>
        );
      }),
      className: "py-4 !min-h-[64px] border-b border-border",
      dynamicHeight: true,
      wrapperClassname: "items-normal",
    },
    {
      key: "staking_and_governance",
      title: (
        <div className='flex h-full w-full items-end px-6 pb-4'>
          <span className='text-center text-sm font-semibold text-primary'>
            Staking and governance
          </span>
        </div>
      ),
      cells: [],
    },
    {
      key: "staking_support",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Staking support</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ stakingSupport }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {stakingSupport ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
    },
    {
      key: "cardano_governance_features",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>
            Cardano governance features
          </span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ governanceSupport }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {governanceSupport ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
    },
    {
      key: "project_catalyst_registration",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>
            Project Catalyst registration
          </span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ governanceSupport }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {governanceSupport ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
    },
    {
      key: "multipool_delegation",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Multipool delegation</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ multiPoolDelegation }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {multiPoolDelegation ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
      className: "border-b border-border",
    },
    {
      key: "features",
      title: (
        <div className='flex h-full w-full items-end px-6 pb-4'>
          <span className='text-center text-sm font-semibold text-primary'>
            Features
          </span>
        </div>
      ),
      cells: [],
    },
    {
      key: "dapp_browser",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>dApp browser</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ dAppBrowser }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {dAppBrowser ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
    },
    {
      key: "multiple_accounts",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Multiple accounts</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ multipleAccounts }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {multipleAccounts ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
    },
    {
      key: "custom_node",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Custom node</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ customNode }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {customNode ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
    },
    {
      key: "address_book",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Address book</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ addressBook }) => (
        <div className='flex h-full w-full items-center justify-center gap-3'>
          {addressBook ? (
            <CircleCheck className='text-[#079455]' />
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
    },
    {
      key: "other",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Other</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ otherFeatures }) => {
        const values = Object?.values(otherFeatures || {}).filter(e => e);

        return values.length ? (
          <div className='flex flex-col flex-wrap gap-[2px] py-1 text-center'>
            {values.map(item => (
              <div className='text-wrap text-[10px]'>{item}</div>
            ))}
          </div>
        ) : (
          <div className='flex flex-wrap items-center justify-center'>
            <Minus className='text-[#98A2B3]' />
          </div>
        );
      }),
      darker: true,
      dynamicHeight: true,
      className: "p-1 !min-h-[64px] border-b border-border",
      wrapperClassname: "items-normal",
    },
    {
      key: "integrations",
      title: (
        <div className='flex h-full w-full items-end px-6 pb-4'>
          <span className='text-center text-sm font-semibold text-primary'>
            Integrations
          </span>
        </div>
      ),
      cells: [],
    },
    {
      key: "nft_marketplace",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>NFT marketplace</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ nftMarketplaceIntegration }) => (
        <div
          className={`flex h-full w-full ${nftMarketplaceIntegration?.partner ? "" : "items-center"} justify-center gap-3 py-2`}
        >
          {nftMarketplaceIntegration?.enabled ? (
            nftMarketplaceIntegration?.partner ? (
              <div className='flex w-full flex-col items-center gap-2'>
                <CircleCheck className='text-[#079455]' />
                <span className='text-wrap text-center text-[10px]'>
                  {nftMarketplaceIntegration?.partner}
                </span>
              </div>
            ) : (
              <CircleCheck className='text-[#079455]' />
            )
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
      dynamicHeight: true,
      className: "p-1 !min-h-[64px]",
      wrapperClassname: "items-normal",
    },
    {
      key: "swaps_in_wallets",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Swaps in wallets</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ swapsInWallet }) => (
        <div
          className={`flex h-full w-full ${swapsInWallet?.partner ? "" : "items-center"} justify-center gap-3 py-2`}
        >
          {swapsInWallet?.enabled ? (
            swapsInWallet?.partner ? (
              <div className='flex w-full flex-col items-center gap-2'>
                <CircleCheck className='text-[#079455]' />
                <span className='text-wrap text-center text-[10px]'>
                  {swapsInWallet?.partner}
                </span>
              </div>
            ) : (
              <CircleCheck className='text-[#079455]' />
            )
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: false,
      dynamicHeight: true,
      className: "p-1 !min-h-[64px]",
      wrapperClassname: "items-normal",
    },
    {
      key: "fiat_onramp",
      title: (
        <div className='flex h-full w-full items-center gap-1 px-6'>
          <span className='text-sm font-medium'>Fiat onramp</span>
          <CircleHelp
            size={13}
            className='translate-y-[1px] text-grayTextPrimary'
          />
        </div>
      ),
      cells: walletsData.map(({ fiatOnramp }) => (
        <div
          className={`flex h-full w-full ${fiatOnramp?.partner ? "" : "items-center"} justify-center gap-3 py-2`}
        >
          {fiatOnramp?.enabled ? (
            fiatOnramp?.partner ? (
              <div className='flex w-full flex-col items-center gap-2'>
                <CircleCheck className='text-[#079455]' />
                <span className='text-wrap text-center text-[10px]'>
                  {fiatOnramp?.partner}
                </span>
              </div>
            ) : (
              <CircleCheck className='text-[#079455]' />
            )
          ) : (
            <Minus className='text-[#98A2B3]' />
          )}
        </div>
      )),
      darker: true,
      dynamicHeight: true,
      className: "p-1 !min-h-[64px]",
      wrapperClassname: "items-normal",
    },
  ];

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name} | Cexplorer.io</title>}

        {name && (
          <meta property='og:title' content={`${name} | Cexplorer.io`} />
        )}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:url' content={webUrl + location.pathname} />
        <meta property='og:type' content='website' />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title='Compare Cardano Wallets'
          breadcrumbItems={[{ label: "Wallets" }]}
          subTitle='Explore and compare the unique features of various Cardano wallets to find the best fit for your needs.'
        />
        <AdsCarousel />
        <section className='flex w-full justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-end gap-5 p-mobile md:p-desktop'>
            <div className='flex w-fit'>
              <div className='flex flex-col items-start gap-1'>
                <span className='w-fit text-xs font-medium'>
                  Compare wallets
                </span>
                <TableSettingsDropdown
                  rows={10}
                  setRows={() => {}}
                  columnsOptions={compareWalletOptions}
                  visibleRows={false}
                  customContent={
                    <Select>
                      <SelectTrigger className='w-[140px]'>
                        <span className='capitalize'>
                          {
                            Object.values(columnsVisibility).filter(
                              item => item,
                            ).length
                          }{" "}
                          selected
                        </span>
                      </SelectTrigger>
                    </Select>
                  }
                  customStyles={{
                    left: 0,
                    top: "45px",
                    width: "140px",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
            {isLoading ? (
              <LoadingSkeleton rounded='lg' width='1300px' height='1400px' />
            ) : (
              <div
                className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-lg border border-border bg-cardBg'
                style={{
                  transform: "rotateX(180deg)",
                }}
              >
                <div
                  className='w-full min-w-[1300px]'
                  style={{
                    transform: "rotateX(180deg)",
                  }}
                >
                  {columns.map(
                    ({
                      title,
                      key,
                      cells,
                      darker,
                      className,
                      dynamicHeight,
                      wrapperClassname,
                    }) => (
                      <WalletRow
                        title={title}
                        key={key}
                        darker={darker}
                        cells={cells}
                        className={className}
                        dynamicHeight={dynamicHeight}
                        wrapperClassname={wrapperClassname}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
