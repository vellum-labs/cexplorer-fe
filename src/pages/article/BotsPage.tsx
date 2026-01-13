import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ArrowRight, BellRing } from "lucide-react";

import { DiscordLogo } from "@vellumlabs/cexplorer-sdk";
import { TelegramLogo } from "@vellumlabs/cexplorer-sdk";
import { TwitterLogo } from "@vellumlabs/cexplorer-sdk";

import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

type TagKey = "global" | "live" | "customizable" | "comingSoon";

interface BotConfig {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  tagKeys: TagKey[];
  link?: string;
}

const botsConfig: BotConfig[] = [
  {
    key: "x",
    titleKey: "botsPage.bots.x.title",
    descriptionKey: "botsPage.bots.x.description",
    icon: TwitterLogo,
    tagKeys: ["global", "live"],
    link: undefined,
  },
  {
    key: "tg",
    titleKey: "botsPage.bots.telegram.title",
    descriptionKey: "botsPage.bots.telegram.description",
    icon: TelegramLogo,
    tagKeys: ["customizable", "comingSoon"],
    link: undefined,
  },
  {
    key: "dc",
    titleKey: "botsPage.bots.discord.title",
    descriptionKey: "botsPage.bots.discord.description",
    icon: DiscordLogo,
    tagKeys: ["customizable", "comingSoon"],
    link: undefined,
  },
];

export const BotsPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataOverride={{ title: t("botsPage.metaTitle") }}
      title={t("botsPage.title")}
      subTitle={t("botsPage.subtitle")}
      breadcrumbItems={[{ label: t("botsPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-4 px-mobile pb-3 md:px-desktop'>
        {botsConfig.map(item => (
          <div
            key={item.key}
            className='flex w-full max-w-[800px] flex-col justify-between gap-1 rounded-m border border-border px-mobile py-mobile sm:flex-row sm:items-center sm:gap-0 md:px-desktop'
          >
            <div className='flex max-w-[410px] flex-col gap-1.5'>
              <div className='flex w-full flex-wrap gap-1'>
                {item.tagKeys.map(tagKey => (
                  <div
                    key={tagKey}
                    className='flex items-center gap-[6px] rounded-s border border-border px-[6px] py-[2px]'
                  >
                    {tagKey === "live" && (
                      <div className='relative'>
                        <PulseDot />
                      </div>
                    )}
                    {tagKey === "comingSoon" && (
                      <div className='relative'>
                        <PulseDot color='bg-yellowText' />
                      </div>
                    )}
                    <span className='text-text-xs font-medium'>{t(`botsPage.tags.${tagKey}`)}</span>
                  </div>
                ))}
              </div>
              <div className='flex flex-grow items-center justify-between'>
                <div className='flex flex-col justify-between gap-1/2 self-start text-wrap'>
                  <div className='flex items-center gap-1'>
                    <img src={item.icon} alt='BotIcon' height={24} width={24} />
                    <h3>{t(item.titleKey)}</h3>
                  </div>
                  <span className='text-grayTextPrimary'>
                    {t(item.descriptionKey)}
                  </span>
                </div>
              </div>
            </div>
            {item.link ? (
              <Button
                label={t("botsPage.buttons.follow")}
                rightIcon={<ArrowRight size={18} />}
                size='md'
                variant='primary'
              />
            ) : (
              <Button
                label={t("botsPage.buttons.comingSoon")}
                rightIcon={<BellRing size={18} />}
                size='md'
                variant='tertiary'
              />
            )}
          </div>
        ))}
        <div className='flex max-w-[800px] flex-col gap-4 text-wrap pb-5'>
          <div className='w-full text-center'>
            <h1>{t("botsPage.policy.title")}</h1>
          </div>
          <p className='text-start text-grayTextPrimary'>
            {t("botsPage.policy.paragraph1")}
          </p>
          <p className='text-start text-grayTextPrimary'>
            {t("botsPage.policy.paragraph2")}
          </p>
        </div>
      </section>
    </PageBase>
  );
};
