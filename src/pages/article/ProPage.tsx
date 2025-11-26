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
import { ExposureIcon } from "@/assets/icons/ExposureIcon";
import { FeaturesIcon } from "@/assets/icons/FeaturesIcon";
import { ApiIcon } from "@/assets/icons/ApiIcon";
import { GovernanceIcon } from "@/assets/icons/GovernanceIcon";
import {
  exposureFeatures,
  exclusiveFeatures,
  apiFeatures,
  governanceFeatures,
} from "@/constants/proFeatures";
import { ProFeatureSection } from "@/components/article/ProFeatureSection";

import { Banner } from "@/components/global/Banner";

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
        <Banner description='Mint is not live yet. It will be available at a later date.' />
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

        <ProFeatureSection
          icon={<ExposureIcon />}
          title='Increase Exposure with Cexplorer PRO'
          description='Boost the visibility of assets, stake pools, dReps, and policy IDs with each Cexplorer PRO NFT.'
          features={exposureFeatures}
          featureIdPrefix='exposure'
          imageSrc={FeatureCards}
          imageAlt='Featured promotions'
          imagePosition='right'
        />

        <ProFeatureSection
          icon={<FeaturesIcon />}
          title='Exclusive PRO Features'
          description='Cexplorer PRO NFT unlocks exclusive features and tools to make the best out of Cexplorer.'
          features={exclusiveFeatures}
          featureIdPrefix='exclusive'
          imageSrc={ExportTable}
          imageAlt='Export table features'
          imagePosition='left'
        />

        <ProFeatureSection
          icon={<ApiIcon />}
          title='API Key Access'
          description="Get access to Cexplorer's data with a basic API key, enabling easy integration with your projects."
          features={apiFeatures}
          featureIdPrefix='api'
          imageSrc={FeatureData}
          imageAlt='API data features'
          imagePosition='right'
        />

        <ProFeatureSection
          icon={<GovernanceIcon />}
          title='Governance Access'
          description='Each Cexplorer PRO NFT represents one vote, giving you the power to influence key platform decisions.'
          features={governanceFeatures}
          featureIdPrefix='governance'
          imageSrc={FeatureGovernance}
          imageAlt='Governance features'
          imagePosition='left'
        />

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
