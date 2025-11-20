import { PageBase } from "@/components/global/pages/PageBase";
import { ChevronDown } from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@vellumlabs/cexplorer-sdk";

import FeatureCards from "@/resources/images/features/feature_cards.svg";
import ExportTable from "@/resources/images/features/export_table.svg";
import FeatureData from "@/resources/images/features/feature_data.svg";
import FeatureGovernance from "@/resources/images/features/feature_governance.svg";

const GradientCheckIcon = ({ id }: { id: string }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='mt-0.5 flex-shrink-0'
  >
    <defs>
      <linearGradient
        id={`check-gradient-${id}`}
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
    <circle
      cx='12'
      cy='12'
      r='10'
      stroke={`url(#check-gradient-${id})`}
      strokeWidth='2'
      fill='none'
    />
    <path
      d='M9 12l2 2 4-4'
      stroke={`url(#check-gradient-${id})`}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </svg>
);

const exposureFeatures = [
  "Each NFT boosts visibility of assets, stake pools, dReps, and policy IDs",
  "Choose to boost different or the same items with each NFT",
  "The more NFTs you boost with, the greater the visibility across Cexplorer",
];

const exclusiveFeatures = [
  "Export graphs and data in CSV or JSON formats",
  "Label up to 5000 wallets with custom names",
  "Use enhanced features to manage and analyze data",
];

const apiFeatures = [
  "Access a basic API key with PRO NFT",
  "Easily integrate Cexplorer data into your applications",
  "Use the data to enhance your projects",
];

const governanceFeatures = [
  "Help shape the future of Cexplorer",
  "Participate in important governance votes",
  "One vote per Cexplorer PRO NFT",
];

const faqItems = [
  {
    question: "How to get the Cexplorer PRO NFT?",
    answer: (
      <p>
        You will be able to mint a Cexplorer PRO NFT directly through Cexplorer.
        Details on the exact process will be{" "}
        <a
          href='https://x.com/cexplorer_io'
          target='_blank'
          rel='nofollow noreferrer'
          className='text-primary'
        >
          announced on our X
        </a>
        .
      </p>
    ),
  },
  {
    question: "What's the supply and price?",
    answer: (
      <p>
        <strong>TBA</strong> – Supply and pricing will be announced by the
        Cexplorer team.
      </p>
    ),
  },
  {
    question: "How long does PRO access last?",
    answer: (
      <p>
        PRO access lasts as long as you hold the Cexplorer PRO NFT. If you
        transfer or sell it, the access moves with the NFT.
      </p>
    ),
  },
  {
    question: "Do multiple NFTs grant more benefits?",
    answer: (
      <div>
        <p className='mb-2'>
          Yes. Each PRO NFT gives you one boost slot (asset, stake pool, dRep,
          or policy ID). The more NFTs you hold, the more items you can boost,
          and the stronger the visibility effect.
        </p>
        <p>In addition, API limits stack with each PRO NFT you hold.</p>
      </div>
    ),
  },
  {
    question: "Can I boost multiple assets with one NFT?",
    answer: (
      <p>
        No. Each NFT can boost one item at a time. To boost multiple items,
        you'll need multiple NFTs.
      </p>
    ),
  },
  {
    question:
      "How frequently can I update the featured policy ID, stake pool, asset ID, or dRep?",
    answer: (
      <p>
        You'll be able to update your featured item regularly. Exact update
        limits are TBA.
      </p>
    ),
  },
  {
    question: "What's the difference between a basic and PRO API key?",
    answer: (
      <div>
        <ul className='mb-2 ml-4 list-disc space-y-1'>
          <li>
            <strong>Basic API key</strong>: available to anyone and provides
            limited data access.
          </li>
          <li>
            <strong>PRO API key</strong>: unlocked with a Cexplorer PRO NFT and
            enables more endpoints and larger query limits.
          </li>
        </ul>
        <p>
          See{" "}
          <Link to='/api' className='text-primary'>
            Cexplorer API page
          </Link>{" "}
          for more details.
        </p>
      </div>
    ),
  },
];

export const ProPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "Cexplorer PRO | Cexplorer.io" }}
      title='PRO page'
      breadcrumbItems={[{ label: "PRO" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-16 px-mobile pb-3 md:px-desktop'>
        <div className='flex w-full flex-col items-center gap-6 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold'>
            Utilize Cexplorer to the fullest with{" "}
            <span
              style={{
                background: "linear-gradient(to right, #0094D4, #8E2DE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PRO
            </span>
          </h1>
          <p className='text-lg max-w-3xl text-grayTextPrimary'>
            Powerful, self-serve product and growth analytics to help you
            convert, engage, and retain more.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Link to='/profile' search={{ tab: "pro" }}>
              <Button size='lg' variant='tertiary' label='Dashboard' />
            </Link>
            <Button
              size='lg'
              variant='purple'
              label='Mint NFT'
              rightIcon={<ChevronDown size={20} />}
            />
          </div>
          <div className='flex w-full max-w-md items-center gap-3'>
            <div className='rounded-full relative h-2 flex-1 overflow-hidden bg-border'>
              <div
                className='rounded-full h-full'
                style={{
                  width: "60%",
                  background: "linear-gradient(to right, #0094D4, #8E2DE2)",
                }}
              />
            </div>
            <span className='text-sm font-medium'>60%</span>
          </div>
        </div>

        <div className='flex w-full flex-col items-center gap-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold'>
            Unlock PRO Features and Boost Your Visibility
          </h2>
          <p className='text-lg max-w-4xl text-grayTextPrimary'>
            Get your assets, stake pools, dReps, and policy IDs featured, access
            advanced tools, and enjoy exclusive perks with Cexplorer PRO.
          </p>
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
                    id='gradient-exposure'
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
                  d='M12 6v12'
                  stroke='url(#gradient-exposure)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M17.196 9L6.804 15'
                  stroke='url(#gradient-exposure)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <path
                  d='M6.804 9L17.196 15'
                  stroke='url(#gradient-exposure)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 font-bold'>
              Increase Exposure with Cexplorer PRO
            </h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              Boost the visibility of assets, stake pools, dReps, and policy IDs
              with each Cexplorer PRO NFT.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {exposureFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <GradientCheckIcon id={`exposure-${index}`} />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className='flex flex-1 items-center justify-center'
            style={{ minWidth: "280px" }}
          >
            <img
              src={FeatureCards}
              alt='Featured promotions'
              className='w-full max-w-[612px]'
            />
          </div>
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div
            className='flex flex-1 items-center justify-center md:order-1'
            style={{ minWidth: "280px" }}
          >
            <img
              src={ExportTable}
              alt='Export table features'
              className='w-full max-w-[612px]'
            />
          </div>

          <div
            className='flex flex-1 flex-col md:order-2'
            style={{ minWidth: "280px" }}
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
                    id='gradient-features'
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
                  d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'
                  stroke='url(#gradient-features)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 font-bold'>Exclusive PRO Features</h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              Cexplorer PRO NFT unlocks exclusive features and tools to make the
              best out of Cexplorer.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {exclusiveFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <GradientCheckIcon id={`exclusive-${index}`} />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
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
                    id='gradient-api'
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
                  d='m18 16 4-4-4-4'
                  stroke='url(#gradient-api)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='m6 8-4 4 4 4'
                  stroke='url(#gradient-api)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='m14.5 4-5 16'
                  stroke='url(#gradient-api)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 font-bold'>API Key Access</h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              Get access to Cexplorer's data with a basic API key, enabling easy
              integration with your projects.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {apiFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <GradientCheckIcon id={`api-${index}`} />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className='flex flex-1 items-center justify-center'
            style={{ minWidth: "280px" }}
          >
            <img
              src={FeatureData}
              alt='API data features'
              className='w-full max-w-[612px]'
            />
          </div>
        </div>

        <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div
            className='flex flex-1 items-center justify-center md:order-1'
            style={{ minWidth: "280px" }}
          >
            <img
              src={FeatureGovernance}
              alt='Governance features'
              className='w-full max-w-[612px]'
            />
          </div>

          <div
            className='flex flex-1 flex-col md:order-2'
            style={{ minWidth: "280px" }}
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
                    id='gradient-gov'
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
                <line
                  x1='3'
                  x2='21'
                  y1='22'
                  y2='22'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <line
                  x1='6'
                  x2='6'
                  y1='18'
                  y2='11'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <line
                  x1='10'
                  x2='10'
                  y1='18'
                  y2='11'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <line
                  x1='14'
                  x2='14'
                  y1='18'
                  y2='11'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <line
                  x1='18'
                  x2='18'
                  y1='18'
                  y2='11'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <polygon
                  points='12 2 20 7 4 7'
                  stroke='url(#gradient-gov)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h2 className='text-2xl mb-3 font-bold'>Governance Access</h2>
            <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
              Each Cexplorer PRO NFT represents one vote, giving you the power
              to influence key platform decisions.
            </p>
            <ul className='mb-6 flex flex-col gap-4'>
              {governanceFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <GradientCheckIcon id={`governance-${index}`} />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='flex w-full flex-col gap-6'>
          <div className='flex flex-col gap-2 text-center'>
            <h2 className='text-3xl font-bold'>FAQs</h2>
            <p className='text-grayTextPrimary'>
              Everything you need to know about the Cexplorer PRO.
            </p>
            <p className='text-sm text-grayTextPrimary'>
              Can't find the answer you're looking for? Please chat to our
              friendly team.
            </p>
          </div>
          <Accordion type='single' collapsible className='w-full'>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='border-b border-border'
              >
                <AccordionTrigger className='w-full py-4 text-left'>
                  <span className='text-lg font-medium'>{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='pb-4 text-grayTextPrimary'>{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PageBase>
  );
};
