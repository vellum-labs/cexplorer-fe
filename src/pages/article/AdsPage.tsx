import { PageBase } from "@/components/global/pages/PageBase";
import {
  Zap,
  CircleCheck,
  Bell,
  Mail,
  ChevronDown,
  Heart,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import adsFeatured from "@/resources/images/features/feature_cards.svg";
import adsBoost from "@/resources/images/ads_boost.svg";
import adsJam from "@/resources/images/ads_jam.svg";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const heroFeaturesConfig = [
  {
    icon: Users,
    titleKey: "adsPage.reach.features.audience.title",
    descriptionKey: "adsPage.reach.features.audience.description",
  },
  {
    icon: Zap,
    titleKey: "adsPage.reach.features.intent.title",
    descriptionKey: "adsPage.reach.features.intent.description",
  },
  {
    icon: Heart,
    titleKey: "adsPage.reach.features.trusted.title",
    descriptionKey: "adsPage.reach.features.trusted.description",
  },
];

const displayFeaturesConfig = [
  {
    titleKey: "adsPage.display.features.visibility.title",
    descriptionKey: "adsPage.display.features.visibility.description",
  },
  {
    titleKey: "adsPage.display.features.reach.title",
    descriptionKey: "adsPage.display.features.reach.description",
  },
  {
    titleKey: "adsPage.display.features.placement.title",
    descriptionKey: "adsPage.display.features.placement.description",
  },
];

const proFeaturesConfig = [
  {
    titleKey: "adsPage.pro.features.exposure.title",
    descriptionKey: "adsPage.pro.features.exposure.description",
  },
  {
    titleKey: "adsPage.pro.features.continuous.title",
    descriptionKey: "adsPage.pro.features.continuous.description",
  },
  {
    titleKey: "adsPage.pro.features.targeted.title",
    descriptionKey: "adsPage.pro.features.targeted.description",
  },
];

const boostFeaturesConfig = [
  {
    titleKey: "adsPage.boosts.features.instant.title",
    descriptionKey: "adsPage.boosts.features.instant.description",
  },
  {
    titleKey: "adsPage.boosts.features.anyone.title",
    descriptionKey: "adsPage.boosts.features.anyone.description",
  },
  {
    titleKey: "adsPage.boosts.features.strategic.title",
    descriptionKey: "adsPage.boosts.features.strategic.description",
  },
];

export const AdsPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataOverride={{ title: t("adsPage.metaTitle") }}
      title={t("adsPage.title")}
      subTitle={t("adsPage.subtitle")}
      breadcrumbItems={[{ label: t("adsPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <svg width='0' height='0' className='absolute' aria-hidden='true'>
        <defs>
          <linearGradient
            id='grad-pro'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#0094D4' />
            <stop offset='100%' stopColor='#8E2DE2' />
          </linearGradient>
          <linearGradient
            id='grad-boost'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#F49062' />
            <stop offset='100%' stopColor='#FD371F' />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .icon-grad-pro svg,
        .icon-grad-pro svg * { stroke: url(#grad-pro) !important; }
        .icon-grad-boost svg,
        .icon-grad-boost svg * { stroke: url(#grad-boost) !important; }
      `}</style>

      <section className='flex w-full max-w-desktop flex-col items-center gap-16 px-mobile pt-6 pb-3 md:px-desktop'>
        <div className='flex w-full flex-col gap-10 md:flex-row md:items-stretch md:justify-between'>
          <div className='flex flex-col md:w-[50%]'>
            <h2 className='mb-4 text-display-xs font-bold'>
              {t("adsPage.reach.title")}
            </h2>
            <p className='mb-4 text-text-md text-textPrimary'>
              {t("adsPage.reach.description1")}
            </p>
            <p className='mb-4 text-text-md text-textPrimary'>
              {t("adsPage.reach.description2")}
            </p>
            <p className='mb-6 text-text-md text-textPrimary'>
              {t("adsPage.reach.description3")}
            </p>
            <Button
              size='lg'
              variant='primary'
              label={t("adsPage.reach.button")}
              rightIcon={<ChevronDown size={20} />}
            />
          </div>

          <div className='flex flex-col justify-between gap-6 md:w-[50%]'>
            {heroFeaturesConfig.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className='flex items-start gap-3'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100'>
                    <Icon size={20} className='text-sky-500' />
                  </div>
                  <div className='flex flex-col'>
                    <div className='text-text-xl font-semibold text-darkBlue'>
                      {t(feature.titleKey)}
                    </div>
                    <div className='text-text-md text-grayTextPrimary'>
                      {t(feature.descriptionKey)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className='w-full border-border' />

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div className='flex flex-1 flex-col' style={{ minWidth: "280px" }}>
            <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{ color: 'var(--darkBlue)' }}
              >
                <path
                  d='M12 4L12 20'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M4 12L20 12'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M6.34 6.34L17.66 17.66'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M17.66 6.34L6.34 17.66'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <h2 className='mb-3 text-2xl font-bold'>
              {t("adsPage.display.title")}
            </h2>
            <p className='mb-6 text-sm leading-relaxed text-grayTextPrimary'>
              {t("adsPage.display.description")}
            </p>
            <ul className='mb-5 flex flex-col gap-4'>
              {displayFeaturesConfig.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={18}
                    className='mt-0.5 flex-shrink-0 text-darkBlue'
                  />
                  <span className='text-sm'>
                    <strong>{t(feature.titleKey)}</strong> –{" "}
                    {t(feature.descriptionKey)}
                  </span>
                </li>
              ))}
            </ul>
            <p className='mb-5 text-sm'>
              {t("adsPage.display.coinzillaText")}{" "}
              <a
                href='https://coinzilla.com'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='text-darkBlue hover:underline'
              >
                Coinzilla
              </a>
              {t("adsPage.display.coinzillaDescription")}
            </p>
            <div className='flex flex-wrap items-center gap-2'>
              <a
                href='https://cexplorer.io/api'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button
                  size='md'
                  variant='tertiary'
                  label={t("adsPage.display.examples")}
                />
              </a>
              <a href='mailto:hello@vellumlabs.cz'>
                <Button
                  size='md'
                  variant='primary'
                  label={t("adsPage.display.email")}
                  leftIcon={<Mail size={16} />}
                />
              </a>
              <a
                href='https://coinzilla.com'
                target='_blank'
                rel='noreferrer noopener nofollow'
              >
                <Button
                  size='md'
                  variant='primary'
                  label={t("adsPage.display.coinzilla")}
                  rightIcon={<ExternalLink size={16} />}
                />
              </a>
            </div>
          </div>

          <div
            className='flex flex-1 items-center justify-center'
            style={{ minWidth: "280px" }}
          >
            <img
              src={adsJam}
              alt='Display advertising examples'
              className='w-full max-w-[612px]'
            />
          </div>
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div
            className='flex flex-1 items-center justify-center'
            style={{ minWidth: "280px" }}
          >
            <img
              src={adsFeatured}
              alt='Featured promotions'
              className='w-full max-w-[612px]'
            />
          </div>

          <div
            className='flex flex-1 flex-col'
            style={{ minWidth: "280px", maxWidth: "600px" }}
          >
            <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <defs>
                  <linearGradient
                    id='grad-pro-icon'
                    x1='0'
                    y1='0'
                    x2='24'
                    y2='24'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0%' stopColor='#0094D4' />
                    <stop offset='100%' stopColor='#8E2DE2' />
                  </linearGradient>
                </defs>
                <path
                  d='M12 4L12 20'
                  stroke='url(#grad-pro-icon)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M4 12L20 12'
                  stroke='url(#grad-pro-icon)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M6.34 6.34L17.66 17.66'
                  stroke='url(#grad-pro-icon)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M17.66 6.34L6.34 17.66'
                  stroke='url(#grad-pro-icon)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <h2 className='mb-3 text-2xl font-bold'>
              {t("adsPage.pro.title")}{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #0094D4, #8E2DE2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PRO
              </span>
            </h2>
            <p className='mb-6 text-sm leading-relaxed text-textPrimary'>
              {t("adsPage.pro.description")}
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {proFeaturesConfig.map((feature, index) => (
                <li key={index} className='icon-grad-pro flex items-start gap-3'>
                  <CircleCheck
                    size={20}
                    className='mt-0.5 flex-shrink-0'
                  />
                  <span className='text-sm'>
                    <strong>{t(feature.titleKey)}</strong> -{" "}
                    {t(feature.descriptionKey)}
                  </span>
                </li>
              ))}
            </ul>
            <div className='flex flex-wrap items-center gap-2'>
              <a
                href='https://cexplorer.io/api'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button
                  size='md'
                  variant='tertiary'
                  label={t("adsPage.pro.documentation")}
                />
              </a>
              <a
                href='https://cexplorer.io/pro'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button
                  size='md'
                  variant='purple'
                  label={t("adsPage.pro.getCexplorerPro")}
                />
              </a>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div className='flex flex-1 flex-col' style={{ minWidth: "280px" }}>
            <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'
                  stroke='url(#grad-boost)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h2 className='mb-3 flex items-center gap-2 text-2xl font-bold'>
              <span className='text-xl' style={{ color: "#F97316" }}>
                ⚡
              </span>
              {t("adsPage.boosts.title")}
            </h2>
            <p className='mb-6 text-sm leading-relaxed text-grayTextPrimary'>
              {t("adsPage.boosts.description")}
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {boostFeaturesConfig.map((feature, index) => (
                <li
                  key={index}
                  className='icon-grad-boost flex items-start gap-3'
                >
                  <CircleCheck
                    size={18}
                    className='mt-0.5 flex-shrink-0'
                  />
                  <span className='text-sm'>
                    <strong>{t(feature.titleKey)}</strong> –{" "}
                    {t(feature.descriptionKey)}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              size='md'
              variant='tertiary'
              label={t("adsPage.boosts.comingSoon")}
              rightIcon={<Bell size={16} />}
              disabled
            />
          </div>

          <div
            className='flex flex-1 items-center justify-center'
            style={{ minWidth: "280px" }}
          >
            <img
              src={adsBoost}
              alt='Boosted preview'
              className='w-full max-w-[612px]'
            />
          </div>
        </div>
      </section>
    </PageBase>
  );
};
