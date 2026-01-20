import { PageBase } from "@/components/global/pages/PageBase";
import {
  Zap,
  Signature,
  CloudDownload,
  Sparkles,
  CircleCheck,
  Bell,
  Mail,
  ArrowRight,
  Code2,
} from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import adsFeatured from "@/resources/images/features/feature_cards.svg";
import adsBoost from "@/resources/images/ads_boost.svg";
import adsJam from "@/resources/images/ads_jam.svg";
import { Banner } from "@/components/global/Banner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const reachStatsConfig = [
  { icon: Zap, value: "TBD", labelKey: "adsPage.stats.monthlyPageViews" },
  { icon: Signature, value: "TBD", labelKey: "adsPage.stats.uniqueUsers" },
  {
    icon: CloudDownload,
    value: "TBD",
    labelKey: "adsPage.stats.adImpressions",
  },
  { icon: Sparkles, value: "TBD", labelKey: "adsPage.stats.averageCtr" },
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

const bannerFeaturesConfig = [
  {
    titleKey: "adsPage.banners.features.visibility.title",
    descriptionKey: "adsPage.banners.features.visibility.description",
  },
  {
    titleKey: "adsPage.banners.features.reach.title",
    descriptionKey: "adsPage.banners.features.reach.description",
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
      <section className='flex w-full max-w-desktop flex-col items-center gap-16 px-mobile py-2 pb-3 md:px-desktop'>
        <Banner description={t("adsPage.banner")} />

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div
            className='flex flex-1 flex-col'
            style={{ minWidth: "280px", maxWidth: "500px" }}
          >
            <h2 className='text-xl mb-4 font-bold'>
              {t("adsPage.reach.title")}
            </h2>
            <p className='text-sm text-textPrimary mb-4 leading-relaxed'>
              {t("adsPage.reach.description1")}
            </p>
            <p className='text-sm text-textPrimary mb-6 leading-relaxed'>
              {t("adsPage.reach.description2")}
            </p>
            <Link to='/promotion'>
              <Button
                size='lg'
                variant='primary'
                label={t("adsPage.reach.button")}
                rightIcon={<ArrowRight size={20} />}
              />
            </Link>
          </div>

          <div
            className='grid flex-1 grid-cols-2 gap-8'
            style={{ minWidth: "280px" }}
          >
            {reachStatsConfig.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100'>
                    <Icon size={20} className='text-sky-500' />
                  </div>
                  <div className='flex flex-col'>
                    <div className='text-xl font-bold text-darkBlue'>
                      {stat.value}
                    </div>
                    <div className='text-sm text-textPrimary'>
                      {t(stat.labelKey)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
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
                    id='gradient-pro'
                    x1='0'
                    y1='0'
                    x2='24'
                    y2='24'
                  >
                    <stop offset='0%' stopColor='#0094D4' />
                    <stop offset='100%' stopColor='#8E2DE2' />
                  </linearGradient>
                </defs>
                <path
                  d='M12 6v12'
                  stroke='url(#gradient-pro)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M17.196 9L6.804 15'
                  stroke='url(#gradient-pro)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M6.804 9L17.196 15'
                  stroke='url(#gradient-pro)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 font-bold'>
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
            <p className='text-sm text-textPrimary mb-6 leading-relaxed'>
              {t("adsPage.pro.description")}
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {proFeaturesConfig.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={20}
                    className='mt-0.5 flex-shrink-0 text-darkBlue'
                  />
                  <span className='text-sm'>
                    <strong>{t(feature.titleKey)}</strong> -{" "}
                    {t(feature.descriptionKey)}
                  </span>
                </li>
              ))}
            </ul>
            <div className='flex flex-wrap items-center justify-center gap-2'>
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
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
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

          <div className='flex flex-1 flex-col' style={{ minWidth: "280px" }}>
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
                    id='gradient-boost'
                    x1='0'
                    y1='0'
                    x2='24'
                    y2='24'
                  >
                    <stop offset='0%' stopColor='#F49062' />
                    <stop offset='100%' stopColor='#FD371F' />
                  </linearGradient>
                </defs>
                <path
                  d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'
                  stroke='url(#gradient-boost)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 flex items-center gap-2 font-bold'>
              <span className='text-xl' style={{ color: "#F97316" }}>
                ⚡
              </span>
              {t("adsPage.boosts.title")}
            </h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              {t("adsPage.boosts.description")}
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {boostFeaturesConfig.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={18}
                    className='text-red mt-0.5 flex-shrink-0'
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
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div className='flex flex-1 flex-col' style={{ minWidth: "280px" }}>
            <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
              <Code2 size={24} className='text-darkBlue' />
            </div>
            <h2 className='text-2xl mb-3 flex items-center gap-2 font-bold'>
              {t("adsPage.banners.title")}
            </h2>
            <p className='text-sm mb-5 leading-relaxed text-grayTextPrimary'>
              {t("adsPage.banners.description")}
            </p>
            <ul className='mb-5 flex flex-col gap-4'>
              {bannerFeaturesConfig.map((feature, index) => (
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
            <p className='text-sm mb-5'>
              {t("adsPage.banners.coinzillaText")}{" "}
              <a
                href='https://coinzilla.com'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='text-darkBlue hover:underline'
              >
                Coinzilla
              </a>
              {t("adsPage.banners.coinzillaDescription")}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <a
                href='https://cexplorer.io/api'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button
                  size='md'
                  variant='tertiary'
                  label={t("adsPage.banners.documentation")}
                />
              </a>
              <a href='mailto:hello@vellumlabs.cz'>
                <Button
                  size='md'
                  variant='primary'
                  label={t("adsPage.banners.email")}
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
                  label='Coinzilla'
                  rightIcon={<ArrowRight size={16} />}
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
              alt='Banner advertising examples'
              className='w-full max-w-[612px]'
            />
          </div>
        </div>
      </section>
    </PageBase>
  );
};
