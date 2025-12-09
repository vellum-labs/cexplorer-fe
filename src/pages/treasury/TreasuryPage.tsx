import { PageBase } from "@/components/global/pages/PageBase";
import { useFetchAddressDetail } from "@/services/address";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import {
  formatString,
  formatNumberWithSuffix,
  Copy,
  GlobalTable,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";

const TREASURY_WALLETS = [
  {
    name: "Operations, hot wallet",
    address:
      "addr1q9sz5kw40pmnkcmmfvssm5fy2vzkk7l0wu5szv25nnffkqnkc35qyrgnqu8tl96u5eejytgvtsqatr2ms6hrxhdzq4pslvp2rm",
  },
  {
    name: "Company treasury wallet",
    address:
      "addr1q9f9zr2ts4pzx0v3m9e2tkl6uyefrlhz39cdm3257a935efcupfwzfyl6n8szftvejs46h6697f2uvmfslq47m6vz9psek28vr",
  },
];

interface WalletRowData {
  name: string;
  address: string;
  adaBalance: number;
  usdBalance: number;
}

export const TreasuryPage = () => {
  const currencyMarket = useGetMarketCurrency();
  const adaUsdRate = currencyMarket?.adaUsdClose ?? 0;

  const wallet1Query = useFetchAddressDetail(TREASURY_WALLETS[0].address);
  const wallet2Query = useFetchAddressDetail(TREASURY_WALLETS[1].address);

  const isLoading = wallet1Query.isLoading || wallet2Query.isLoading;

  const getAdaBalance = (data: typeof wallet1Query.data) => {
    const addressData = data?.data?.[0];
    return addressData?.balance ?? 0;
  };

  const walletData: WalletRowData[] = TREASURY_WALLETS.map((wallet, index) => {
    const query = index === 0 ? wallet1Query : wallet2Query;
    const balanceLovelace = getAdaBalance(query.data);
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
          query={wallet1Query}
        />
      </div>
    </PageBase>
  );
};
