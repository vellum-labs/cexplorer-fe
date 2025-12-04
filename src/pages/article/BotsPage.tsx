import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ArrowRight, BellRing } from "lucide-react";

import { DiscordLogo } from "@vellumlabs/cexplorer-sdk";
import { TelegramLogo } from "@vellumlabs/cexplorer-sdk";
import { TwitterLogo } from "@vellumlabs/cexplorer-sdk";

import { PulseDot } from "@vellumlabs/cexplorer-sdk";

export const BotsPage = () => {
  const bots = [
    {
      key: "x",
      title: "X notification bot",
      icon: TwitterLogo,
      description: "Coming soon...",
      tags: ["Global", "Live"],
      link: undefined,
    },
    {
      key: "tg",
      title: "Telegram bot",
      icon: TelegramLogo,
      description: "Coming soon...",
      tags: ["Customizable", "Coming soon"],
      link: undefined,
    },
    {
      key: "dc",
      title: "Discord bot",
      icon: DiscordLogo,
      description: "Coming soon...",
      tags: ["Customizable", "Coming soon"],
      link: undefined,
    },
  ];

  return (
    <PageBase
      metadataOverride={{ title: "Bots | Cexplorer.io" }}
      title='Cexplorer.io Bots'
      subTitle='Stay connected with automated notifications and updates'
      breadcrumbItems={[{ label: "Bots" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-4 px-mobile pb-3 md:px-desktop'>
        {bots.map(item => (
          <div
            key={item.key}
            className='flex w-full max-w-[800px] flex-col justify-between gap-1 rounded-m border border-border px-mobile py-mobile sm:flex-row sm:items-center sm:gap-0 md:px-desktop'
          >
            <div className='flex max-w-[410px] flex-col gap-1.5'>
              <div className='flex w-full flex-wrap gap-1'>
                {item.tags.map(tag => (
                  <div
                    key={tag}
                    className='flex items-center gap-[6px] rounded-s border border-border px-[6px] py-[2px]'
                  >
                    {tag === "Live" && (
                      <div className='relative'>
                        <PulseDot />
                      </div>
                    )}
                    {tag === "Coming soon" && (
                      <div className='relative'>
                        <PulseDot color='bg-yellowText' />
                      </div>
                    )}
                    <span className='text-text-xs font-medium'>{tag}</span>
                  </div>
                ))}
              </div>
              <div className='flex flex-grow items-center justify-between'>
                <div className='flex flex-col justify-between gap-1/2 self-start text-wrap'>
                  <div className='flex items-center gap-1'>
                    <img src={item.icon} alt='BotIcon' height={24} width={24} />
                    <h3>{item.title}</h3>
                  </div>
                  <span className='text-grayTextPrimary'>
                    {item.description}
                  </span>
                </div>
              </div>
            </div>
            {item.link ? (
              <Button
                label='Folow'
                rightIcon={<ArrowRight size={18} />}
                size='md'
                variant='primary'
              />
            ) : (
              <Button
                label='Coming Soon'
                rightIcon={<BellRing size={18} />}
                size='md'
                variant='tertiary'
              />
            )}
          </div>
        ))}
        <div className='flex max-w-[800px] flex-col gap-4 text-wrap pb-5'>
          <div className='w-full text-center'>
            <h1>Bots and Automation</h1>
          </div>
          <p className='text-start text-grayTextPrimary'>
            At Cexplorer, we prioritize fair and responsible use of our
            platform. As such, the use of automated bots or scripts to crawl,
            scrape, or interact with our website and API is strictly prohibited.
            Our API is intended for genuine user interaction, and any automated
            access, including bot usage, is not allowed.
          </p>
          <p className='text-start text-grayTextPrimary'>
            For any questions or concerns regarding our policy, feel free to
            contact us directly.
          </p>
        </div>
      </section>
    </PageBase>
  );
};
