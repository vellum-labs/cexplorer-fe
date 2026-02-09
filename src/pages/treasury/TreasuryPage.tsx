import { PageBase } from "@/components/global/pages/PageBase";
import { TREASURY_WALLETS } from "@/constants/treasury";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { useFetchMultipleAddressDetails } from "@/services/address";
import {
  Copy,
  formatNumberWithSuffix,
  formatString,
  GlobalTable,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

interface WalletRowData {
  name: string;
  address: string;
  adaBalance: number;
  usdBalance: number;
}

export const TreasuryPage = () => {
  const currencyMarket = useGetMarketCurrency();
  const adaUsdRate = currencyMarket?.adaUsdClose ?? 0;

  const addresses = useMemo(
    () => TREASURY_WALLETS.map(wallet => wallet.address),
    [],
  );
  const walletQueries = useFetchMultipleAddressDetails(addresses);

  const isLoading = walletQueries.some(query => query.isLoading);

  const walletData: WalletRowData[] = TREASURY_WALLETS.map((wallet, index) => {
    const query = walletQueries[index];
    const addressData = query.data?.data?.data?.[0];
    const balanceLovelace = addressData?.balance ?? 0;
    const adaBalance = balanceLovelace / 1e6;
    const usdBalance = adaBalance * adaUsdRate;

    return {
      name: wallet.name,
      address: wallet.address,
      adaBalance,
      usdBalance,
    };
  });

  const columns = [
    {
      key: "address",
      title: "Address",
      visible: true,
      widthPx: 300,
      render: (item: WalletRowData) => (
        <div className='flex items-center gap-1'>
          <Link
            to='/address/$address'
            params={{ address: item.address }}
            className='text-primary'
          >
            {formatString(item.address, "longer")}
          </Link>
          <Copy copyText={item.address} />
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      visible: true,
      widthPx: 200,
      render: (item: WalletRowData) => (
        <span className='text-grayTextPrimary'>{item.name}</span>
      ),
    },
    {
      key: "ada_balance",
      title: <p className='w-full text-right'>ADA balance</p>,
      visible: true,
      widthPx: 120,
      render: (item: WalletRowData) => (
        <p className='text-right'>
          {isLoading ? "-" : `₳ ${formatNumberWithSuffix(item.adaBalance)}`}
        </p>
      ),
    },
    {
      key: "usd_balance",
      title: <p className='w-full text-right'>USD balance</p>,
      visible: true,
      widthPx: 120,
      render: (item: WalletRowData) => (
        <p className='text-right'>
          {isLoading ? "-" : `$${formatNumberWithSuffix(item.usdBalance)}`}
        </p>
      ),
    },
  ];

  return (
    <PageBase
      metadataTitle='treasury'
      title='Treasury'
      breadcrumbItems={[
        {
          label: "Treasury",
        },
      ]}
      adsCarousel={false}
    >
      <div className='w-full max-w-desktop p-mobile lg:p-desktop'>
        <GlobalTable
          type='default'
          totalItems={walletData.length}
          itemsPerPage={walletData.length}
          items={walletData}
          columns={columns}
          query={walletQueries[0]}
          scrollable
          minContentWidth={700}
          renderDisplayText={(count, total) =>
            t("common:table.displaying", { count, total })
          }
          noItemsLabel={t("common:table.noItems")}
        />
      </div>
    </PageBase>
  );
};
