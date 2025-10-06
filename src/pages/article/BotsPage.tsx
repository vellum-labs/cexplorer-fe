import Button from "@/components/global/Button";
import { ArrowRight, BellRing } from "lucide-react";
import { Helmet } from "react-helmet";

import Discord from "@/resources/images/icons/discord.svg";
import Telegram from "@/resources/images/icons/telegram.svg";
import X from "@/resources/images/icons/twitter.svg";

import PulseDot from "@/components/global/PulseDot";
import { useFetchArticleDetail } from "@/services/article";
import { webUrl } from "@/constants/confVariables";
// import parse from "html-react-parser";

export const BotsPage = () => {
  const query = useFetchArticleDetail("en", "page", "bots");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const bots = [
    {
      key: "x",
      title: "X notification bot",
      icon: X,
      description: "Coming soon...",
      tags: ["Global", "Live"],
      link: undefined,
    },
    {
      key: "tg",
      title: "Telegram bot",
      icon: Telegram,
      description: "Coming soon...",
      tags: ["Customizable", "Coming soon"],
      link: undefined,
    },
    {
      key: "dc",
      title: "Discord bot",
      icon: Discord,
      description: "Coming soon...",
      tags: ["Customizable", "Coming soon"],
      link: undefined,
    },
  ];

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>Bots | Cexplorer.io</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center px-mobile md:px-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h1 className='py-4'>Cexplorer.io Bots</h1>
          <div className='flex w-full flex-col items-center gap-4 px-mobile md:px-desktop'>
            {bots.map(item => (
              <div
                key={item.key}
                className='flex w-full max-w-[800px] flex-col justify-between gap-1 rounded-lg border border-border px-mobile py-mobile sm:flex-row sm:items-center sm:gap-0 md:px-desktop'
              >
                <div className='flex max-w-[410px] flex-col gap-1.5'>
                  <div className='flex w-full flex-wrap gap-1'>
                    {item.tags.map(tag => (
                      <div
                        key={tag}
                        className='flex items-center gap-[6px] rounded-md border border-border px-[6px] py-[2px]'
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
                        <span className='text-xs font-medium'>{tag}</span>
                      </div>
                    ))}
                  </div>
                  <div className='flex flex-grow items-center justify-between'>
                    <div className='flex flex-col justify-between gap-1/2 self-start text-wrap'>
                      <div className='flex items-center gap-1'>
                        <img
                          src={item.icon}
                          alt='BotIcon'
                          height={24}
                          width={24}
                        />
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
              <p className='text-start text-lg text-grayTextPrimary'>
                At Cexplorer, we prioritize fair and responsible use of our
                platform. As such, the use of automated bots or scripts to
                crawl, scrape, or interact with our website and API is strictly
                prohibited. Our API is intended for genuine user interaction,
                and any automated access, including bot usage, is not allowed.
              </p>
              <p className='text-start text-lg text-grayTextPrimary'>
                For any questions or concerns regarding our policy, feel free to
                contact us directly.
              </p>
            </div>
          </div>
        </div>
        {/* // TODO? {parse(data?.data.map(item => item).join("") || "")} */}
      </main>
    </>
  );
};
