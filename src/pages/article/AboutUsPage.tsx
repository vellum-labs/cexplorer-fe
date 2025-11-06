import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  MessagesSquare,
  Zap,
  SquareArrowOutUpRight,
  Smile,
  Command,
  MessageCircleHeart,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: MessagesSquare,
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
  },
  {
    icon: Zap,
    title: "Deliver instant answers",
    description:
      "An all-in-one customer service platform that helps you balance everything your customers need to be happy.",
  },
  {
    icon: SquareArrowOutUpRight,
    title: "Manage your team with reports",
    description:
      "Measure what matters with Untitled's easy-to-use reports. You can filter, export, and drilldown on the data in a couple clicks.",
  },
  {
    icon: Smile,
    title: "Connect with customers",
    description:
      "Solve a problem or close a sale in real-time with chat. If no one is available, customers are seamlessly routed to email without confusion.",
  },
  {
    icon: Command,
    title: "Connect the tools you already use",
    description:
      "Explore 100+ integrations that make your day-to-day workflow more efficient and familiar. Plus, our extensive developer tools.",
  },
  {
    icon: MessageCircleHeart,
    title: "Our people make the difference",
    description:
      "We're an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.",
  },
];

export const AboutUsPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "About us | Cexplorer.io" }}
      title='About us'
      breadcrumbItems={[{ label: "About us" }]}
      adsCarousel={false}
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
          <h2 className='text-2xl mb-2 font-semibold'>Services</h2>
          <p className='text-base text-muted-foreground mb-8'>
            Our shared values keep us connected and guide us as one team.
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
                    onClick={() => {}}
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
