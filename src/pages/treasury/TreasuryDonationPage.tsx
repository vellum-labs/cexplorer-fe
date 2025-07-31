import Tabs from "@/components/global/Tabs";
import { TreasuryDonationEpochsTab } from "@/components/script/treasury/tabs/TreasuryDonationEpochsTab";
import { TreasuryDonationOverview } from "@/components/script/treasury/TreasuryDonationOverview";
import { useFetchTreasuryDonationStats } from "@/services/treasury";
import { TxListPage } from "../tx/TxListPage";
import { PageBase } from "@/components/global/pages/PageBase";

export const TreasuryDonationPage = () => {
  const query = useFetchTreasuryDonationStats();

  const tabItems = [
    {
      key: "donations",
      label: "Recent Donations",
      content: <TxListPage key='donation' isDonationPage />,
      visible: true,
    },
    {
      key: "stats",
      label: "Epoch by epoch",
      content: <TreasuryDonationEpochsTab query={query} />,
      visible: true,
    },
  ];
  return (
    <PageBase
      metadataTitle='treasuryDonations'
      title='Treasury Donations'
      breadcrumbItems={[
        {
          label: "Treasury Donations",
        },
      ]}
      adsCarousel={false}
    >
      <TreasuryDonationOverview query={query} />
      <Tabs items={tabItems} />
    </PageBase>
  );
};
