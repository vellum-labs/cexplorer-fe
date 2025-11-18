import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  Check,
  TrendingUp,
  Landmark,
  User,
  Zap,
  Heart,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Check,
    title: "Explore everything on Cardano",
    description:
      "Cexplorer lets you browse everything happening on the Cardano blockchain. From blocks and transactions to epochs, assets, and smart contracts, all network activity is transparent and easy to explore.",
    link: "/tx",
  },
  {
    icon: TrendingUp,
    title: "Rich analytics and insights",
    description:
      "Gain a deeper understanding of Cardano through clear data and visual metrics. Track staking performance, transaction volumes, and protocol activity to stay informed and ahead.",
    link: "/analytics",
  },
  {
    icon: Landmark,
    title: "Governance made simple",
    description:
      "Take part in Cardano governance directly within the explorer. Delegate your stake to DReps, follow proposals and votes, and stay updated on key network decisions.",
    link: "/gov",
  },
  {
    icon: User,
    title: "Powerful tools for developers",
    description:
      "Cexplorer provides a complete set of developer tools, including the API, SDK, and specialized inspectors for addresses and datum. Access real-time Cardano data, integrate it into your apps, and explore both mainnet and testnet environments with ease.",
    link: "/more",
  },
  {
    icon: Zap,
    title: "Built for reliability & performance",
    description:
      "Cexplorer is optimized for speed, accuracy, and uptime. Every part of the platform is designed to deliver a smooth, dependable experience across desktop and mobile.",
    link: "/faq",
  },
  {
    icon: Heart,
    title: "Built for the community",
    description:
      "Serving as an essential resource for the Cardano ecosystem since the Incentivized Testnet. We have been building and maintaining Cexplorer while actively supporting decentralization as a DRep and SPO.",
    link: "/donate",
  },
];

export const AboutUsPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "About us | Cexplorer.io" }}
      title='About us'
      breadcrumbItems={[{ label: "About us" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <div className='mb-12 flex w-full max-w-[800px] flex-col items-center text-center'>
          <p className='text-base text-muted-foreground'>
            Cexplorer.io, the independent and most feature-rich Cardano
            blockchain explorer, empowers users and developers with
            comprehensive tools for browsing the blockchain, staking and
            analysis, serving as an essential resource for the Cardano ecosystem
            since the Incentivized Testnet.
          </p>
        </div>

        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h2 className='text-2xl mb-2 font-semibold'>Cexplorer</h2>
          <p className='text-base text-muted-foreground mb-8'>
            Supporting the Cardano ecosystem with tools and data.
          </p>

          <div className='grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className='flex flex-col items-center gap-4 text-center'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
                    <Icon size={20} className='text-foreground' />
                  </div>
                  <h3 className='text-lg font-semibold'>{service.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {service.description}
                  </p>
                  <Button
                    variant='primary'
                    size='sm'
                    label={
                      <span className='flex items-center gap-2'>
                        Learn more
                        <ArrowRight size={15} />
                      </span>
                    }
                    href={service.link}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageBase>
  );
};
