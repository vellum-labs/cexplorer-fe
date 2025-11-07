import { PageBase } from "@/components/global/pages/PageBase";
import { Button, PulseDot, Tabs } from "@vellumlabs/cexplorer-sdk";
import { Sparkles } from "lucide-react";
import CexLogo from "@/resources/images/cexLogo.svg";

const instances = [
  { name: "Mainnet", status: "available" },
  { name: "Preprod", status: "available" },
  { name: "Preview", status: "available" },
];

const permalinks = [
  { type: "Blocks", path: "/block/%blockHash%" },
  { type: "Epochs", path: "/epoch/%id%" },
  { type: "Transactions", path: "/tx/%txHash%" },
  { type: "Pools", path: "/pool/%poolIdBech%" },
  { type: "Assets", path: "/asset/%fingerprint%" },
  { type: "Policy IDs", path: "/policy/%policyHash%" },
  { type: "Addresses", path: "/address/%addr%" },
  { type: "Stake keys", path: "/stake/%stakeKey%" },
  { type: "Scripts", path: "/script/%scriptHash%" },
  { type: "Datums", path: "/datum/%datumHash%" },
  { type: "Pubkey hashes", path: "/pkh/%pubKeyHash%" },
];

export const DevelopersPage = () => {
  const networkTabs = [
    {
      key: "mainnet",
      label: "Mainnet",
      content: (
        <p className='text-xs text-grayText mb-4'>Domain: cexplorer.io</p>
      ),
      visible: true,
    },
    {
      key: "preprod",
      label: "Preprod",
      content: (
        <p className='text-xs text-grayText mb-4'>
          Domain: preprod.cexplorer.io
        </p>
      ),
      visible: true,
    },
    {
      key: "preview",
      label: "Preview",
      content: (
        <p className='text-xs text-grayText mb-4'>
          Domain: preview.cexplorer.io
        </p>
      ),
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataOverride={{ title: "Developers | Cexplorer.io" }}
      title='Developers'
      subTitle='API, instances support and permalink structure'
      breadcrumbItems={[{ label: "Developers" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-4 px-mobile pb-3 md:px-desktop'>
        <div className='rounded-lg flex w-full max-w-[800px] flex-col overflow-hidden rounded-xl border border-border sm:flex-row'>
          <div className='flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#2188bb] to-[#697088] sm:max-w-[240px]'>
            <img src={CexLogo} alt='Cexplorer' width='80' height='80' />
            <span className='text-xs font-medium text-white'>Cexplorer.io</span>
          </div>
          <div className='flex w-full flex-col gap-3 p-2'>
            <h3 className='text-xl font-semibold'>Comprehensive API</h3>
            <p className='text-sm text-grayTextPrimary'>
              Check out our API overview and explore flexible pricing options
              designed to fit your project needs.
            </p>
            <a href='/api'>
              <Button
                size='md'
                variant='primary'
                label='Discover API'
                rightIcon={<Sparkles size={15} />}
              />
            </a>
          </div>
        </div>

        <div className='rounded-lg flex w-full max-w-[800px] flex-col gap-3 rounded-xl border border-border p-6'>
          <h3 className='text-xl font-semibold'>Instances</h3>
          <p className='text-sm text-grayTextPrimary'>
            We support all existing public networks.
          </p>
          <div className='mt-3 flex flex-col gap-4'>
            {instances.map(instance => (
              <div
                key={instance.name}
                className='flex flex-wrap items-center justify-between gap-2'
              >
                <span className='text-base text-grayText w-[300px] font-medium'>
                  {instance.name}
                </span>
                <div className='flex items-center gap-2 rounded-xl border border-border px-1 py-0.5'>
                  <div className='relative'>
                    <PulseDot color='bg-greenText' />
                  </div>
                  <span className='text-sm'>{instance.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex w-full max-w-[800px] flex-col overflow-hidden rounded-xl border border-border'>
          <div className='flex items-start justify-between gap-4 p-6 pb-0'>
            <h3 className='text-xl pt-2 font-semibold'>Permalinks</h3>
            <div className='flex-shrink-0'>
              <Tabs items={networkTabs} wrapperClassname='my-0' />
            </div>
          </div>
          <div className='px-6'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-darker'>
                  <tr>
                    <th className='text-sm border-b border-border px-6 py-3 text-left font-semibold'>
                      Type
                    </th>
                    <th className='text-sm border-b border-border px-6 py-3 text-left font-semibold'>
                      Path
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permalinks.map((link, index) => (
                    <tr
                      key={link.type}
                      className={
                        index % 2 === 0 ? "bg-background" : "bg-darker"
                      }
                    >
                      <td className='text-sm border-b border-border px-6 py-3'>
                        {link.type}
                      </td>
                      <td className='font-mono text-sm border-b border-border px-6 py-3 text-grayTextPrimary'>
                        {link.path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='text-xs p-4 text-grayTextPrimary'>
              We kindly ask that you refrain from scraping our API outputs
              without written permission. For more information, please check our
              Bots Policy. Thank you for your understanding and support!
            </div>
          </div>
        </div>
      </section>
    </PageBase>
  );
};
