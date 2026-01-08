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

const reachStats = [
  {
    icon: Zap,
    value: "TBD",
    label: "Monthly page views",
  },
  {
    icon: Signature,
    value: "TBD",
    label: "Unique users",
  },
  {
    icon: CloudDownload,
    value: "TBD",
    label: "Ad impressions",
  },
  {
    icon: Sparkles,
    value: "TBD",
    label: "Average CTR",
  },
];

const proFeatures = [
  {
    title: "More NFTs, More Exposure",
    description:
      "The more NFTs promoting a dRep, stake pool, assets, or policy, the more frequently it appears across Cexplorer.io",
  },
  {
    title: "Continuous Promotion",
    description:
      "Keep your promotion active with the ability to update anytime.",
  },
  {
    title: "Targeted Exposure",
    description:
      "Promote directly to our engaged user base, with visibility on relevant Cexplorer pages based on the type of promotion, ensuring maximum reach.",
  },
];

const boostFeatures = [
  {
    title: "Instant Visibility",
    description: "projects gets featured prominently for a set duration.",
  },
  {
    title: "Anyone Can Boost",
    description:
      "Boosts are open to all; you don't need to own the project to promote it. Boost multiple times for extended visibility.",
  },
  {
    title: "Strategic Placement",
    description:
      "Boosted items appear highlighted and in lists and across Cexplorer, maximizing exposure.",
  },
];

const bannerFeatures = [
  {
    title: "High Visibility",
    description:
      "Ads appear on key sections of Cexplorer, ensuring maximum exposure.",
  },
  {
    title: "Expanded Reach",
    description:
      "Your ad will not only be visible on Cexplorer.io but also on all preview/preprod instances managed by Cexplorer.",
  },
];

export const AdsPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "Promotion & Advertising | Cexplorer.io" }}
      title='Advertise with us'
      subTitle='Promote your project on Cexplorer'
      breadcrumbItems={[{ label: "Advertise with us" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-16 px-mobile py-2 pb-3 md:px-desktop'>
        <Banner description='Ads will be available at a later date.' />

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div
            className='flex flex-1 flex-col'
            style={{ minWidth: "280px", maxWidth: "500px" }}
          >
            <h2 className='text-xl mb-4 font-bold'>Reach your audience!</h2>
            <p className='text-sm text-textPrimary mb-4 leading-relaxed'>
              Cexplorer.io is the top Cardano blockchain explorer and analytics
              platform, offering insights into blockchain, staking, governance,
              and more.
            </p>
            <p className='text-sm text-textPrimary mb-6 leading-relaxed'>
              Advertise with us, to reach an audience of Cardano enthusiasts and
              developers, gaining exposure within the growing Cardano community.
            </p>
            <Link to='/ads/promotion'>
              <Button
                size='lg'
                variant='primary'
                label='Promote'
                rightIcon={<ArrowRight size={20} />}
              />
            </Link>
          </div>

          <div
            className='grid flex-1 grid-cols-2 gap-8'
            style={{ minWidth: "280px" }}
          >
            {reachStats.map((stat, index) => {
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
                    <div className='text-sm text-textPrimary'>{stat.label}</div>
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
              Promote with Cexplorer{" "}
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
              By holding the Cexplorer PRO NFT, you can promote assets, policy
              IDs, stake pools, or dReps while enjoying perks and exclusive
              features.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {proFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={20}
                    className='mt-0.5 flex-shrink-0 text-darkBlue'
                  />
                  <span className='text-sm'>
                    <strong>{feature.title}</strong> - {feature.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <a
                href='https://beta.cexplorer.io/api'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button size='md' variant='tertiary' label='Documentation' />
              </a>
              <a
                href='https://beta.cexplorer.io/pro'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button size='md' variant='purple' label='Get Cexplorer PRO' />
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
              Boosts – Get Noticed Instantly
            </h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              Boosts provide a temporary yet impactful highlight for stake
              pools, dReps, tokens, or NFT collections, making them stand out
              across Cexplorer's UI.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {boostFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={18}
                    className='text-red mt-0.5 flex-shrink-0'
                  />
                  <span className='text-sm'>
                    <strong>{feature.title}</strong> – {feature.description}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              size='md'
              variant='tertiary'
              label='Coming soon'
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
              Banner Advertising on Cexplorer
            </h2>
            <p className='text-sm mb-5 leading-relaxed text-grayTextPrimary'>
              Banner advertisements offer a way to reach our engaged and promote
              your project or upcoming launch.
            </p>
            <ul className='mb-5 flex flex-col gap-4'>
              {bannerFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <CircleCheck
                    size={18}
                    className='mt-0.5 flex-shrink-0 text-darkBlue'
                  />
                  <span className='text-sm'>
                    <strong>{feature.title}</strong> – {feature.description}
                  </span>
                </li>
              ))}
            </ul>
            <p className='text-sm mb-5'>
              We work with{" "}
              <a
                href='https://coinzilla.com'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='text-darkBlue hover:underline'
              >
                Coinzilla
              </a>
              , a trusted advertising network that manually reviews campaigns to
              maintain quality and relevance.
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <a
                href='https://beta.cexplorer.io/api'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button size='md' variant='tertiary' label='Documentation' />
              </a>
              <a href='mailto:hello@vellumlabs.cz'>
                <Button
                  size='md'
                  variant='primary'
                  label='E-mail'
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
