import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@vellumlabs/cexplorer-sdk";
import { colors } from "@/constants/colors";
import CexLogo from "@/resources/images/cexLogo.svg";
import { useFetchMiscApi } from "@/services/misc";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Layers, Layers2, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Banner } from "@/components/global/Banner";

const faq = [
  {
    question: "1. What does the Starter plan include?",
    answer:
      "The Starter plan is a free-tier program designed for personal or single developer use. This program is available to every Cexplorer.io user.",
  },
  {
    question: "2. What are the benefits of the Basic plan?",
    answer: (
      <p>
        The Basic plan comes with owning a{" "}
        <Link className='text-primary underline' to='/pro'>
          Cexplorer PRO NFT
        </Link>
        . With each NFTs your limits are boosted. The more NFTs you own, the
        higher your API limits.
      </p>
    ),
  },
  {
    question: "3. How does the PRO plan work?",
    answer:
      "The PRO plan is tailored individually to fit the needs of large-sized projects. Please reach out to us with details about your intended use, and we’ll customize the limits and features to suit your requirements.",
  },
  {
    question: "4. Can I combine multiple Basic-tier NFTs for increased limits?",
    answer: (
      <p>
        Yes! If you own multiple{" "}
        <Link className='text-primary underline' to='/pro'>
          Cexplorer PRO NFT
        </Link>
        , their API request limits stack, giving you higher overall limits.
      </p>
    ),
  },
  {
    question: "5. What are tokens, and how are they used?",
    answer:
      "Tokens represent the usage limit for specific API features. Each request may consume a certain number of tokens depending on its complexity or data retrieved.",
  },
  {
    question: "6. How can I switch to a higher-tier plan?",
    answer: (
      <p>
        To upgrade to the Basic tier, purchase a{" "}
        <Link className='text-primary underline' to='/pro'>
          Cexplorer PRO NFT
        </Link>
        . For the PRO plan, contact our support team to discuss your specific
        requirements.
      </p>
    ),
  },
  {
    question:
      "7. Is there a way to get extra support if I’m on the Basic plan?",
    answer:
      "Priority support is available exclusively for PRO API plan. However, all users can access general support through our standard channels.",
  },
  {
    question:
      "8. Are there any additional perks for owning a Cexplorer PRO NFT?",
    answer: (
      <div className='flex flex-col gap-1'>
        <span className='flex gap-1/2'>
          Yes! Alongside the Basic API tier benefits,{" "}
          <Link className='text-primary underline' to='/pro'>
            Cexplorer PRO NFT
          </Link>{" "}
          holders gain access to:
        </span>
        <ul className='list-inside list-disc'>
          <li>Governance votes</li>
          <li>PRO features like exporting data in CSV or JSON formats</li>
          <li>Custom wallet labeling (up to 5,000 wallets)</li>
          <li>A PRO badge on their profile</li>
        </ul>
      </div>
    ),
  },
  {
    question: "9. Can I test the API before committing to a paid tier?",
    answer:
      "Absolutely! The Starter plan is free and allows you to test the API’s basic functionalities with limited requests and tokens.",
  },
  {
    question: "10. How do I contact support for the PRO plan?",
    answer:
      "A dedicated support channel will be created for you on our Discord server for direct and priority assistance.",
  },
];

const priceTierIcons = {
  starter: <Zap />,
  basic: <Layers2 />,
  pro: <Layers />,
};

export const ApiInfoPage = () => {
  const { data } = useFetchMiscApi();
  const apiData = data?.data.plans;

  const priceTiers = {
    starter: {
      tier: "Free plan",
      title: "Starter",
      subtitle: "Available to all Cexplorer users.",
      cta: "Get started",
      features: [
        "Ideal for developers and private projects",
        `${apiData?.starter.rq_min} requests per minute`,
        `${apiData?.starter.rq_day} requests per day`,
        `${apiData?.starter.tok_day} tokens per day`,
      ],
      disabled: false,
      link: undefined,
    },
    basic: {
      tier: "NFT tier",
      title: "Basic",
      subtitle: "Comes with owning Cexplorer PRO NFT.",
      cta: "Get started",
      features: [
        "Ideal for small to medium sized projects",
        "Owning multiple NFTs stacks the API requests limits",
        `${apiData?.basic.rq_min} requests per minute`,
        `${apiData?.basic.rq_day} requests per day for each NFT`,
        `${apiData?.basic.tok_day} tokens per day for each NFT`,
      ],
      disabled: true,
      link: undefined,
    },
    pro: {
      tier: "Individual",
      title: "PRO",
      subtitle: "Tailored individually based on your needs.",
      cta: "Contact us",
      features: [
        "Ideal for large sized projects",
        "Limits are always flexible & set based on the project needs",
        `${apiData?.pro.rq_min}+ requests per minute`,
        `${apiData?.pro.rq_day}+ requests per day`,
        `${apiData?.pro.tok_day}+ tokens per day`,
        "Priority support",
      ],
      disabled: false,
      link: "https://discord.gg/YuSFx7GS7y",
    },
  };

  return (
    <PageBase
      metadataOverride={{ title: "API Plans | Cexplorer.io" }}
      title='API Plans'
      subTitle='Effortless access to blockchain data. Choose the perfect plan for your needs.'
      breadcrumbItems={[{ label: "Developers", link: "/dev" }, { label: "API Plans" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-4 px-mobile pb-3 text-center md:px-desktop'>
        <Banner description='Only the Starter API is available right now. Additional tiers are coming later.' />
        <section className='mt-4 flex w-full flex-wrap items-center justify-center gap-3'>
          {Object.entries(priceTiers).map(([key, value]) => (
            <PriceCard
              key={key}
              tier={value.tier}
              title={value.title}
              subtitle={value.subtitle}
              features={value.features}
              cta={value.cta}
              icon={priceTierIcons[key]}
              disabled={value.disabled}
              link={value.link}
            />
          ))}
        </section>
        <section className='mt-4 flex w-full max-w-[500px] flex-col items-center justify-between gap-3 rounded-l border border-border p-2 md:flex-row md:text-left'>
          <div className='flex flex-col gap-2'>
            <h3>API documentation</h3>{" "}
            <p className='text-grayTextPrimary'>
              Explore the API docs to get started with your project!{" "}
            </p>
          </div>
          <a
            className='w-full max-w-[200px] text-nowrap hover:text-text'
            href='https://cexplorer.apidocumentation.com/cexplorer-api'
            target='_blank'
          >
            <Button
              rightIcon={<ArrowRight />}
              label='View documentation'
              variant='tertiary'
              size='md'
              className='h-[40px]'
            />
          </a>
        </section>
        <h2 className='-mb-4 mt-4 md:text-[30px]'>
          Frequently asked questions
        </h2>
        <p className='text-grayTextPrimary'>
          Everything you need to know about the product and billing.
        </p>
        <Accordion
          type='single'
          collapsible
          className='mt-2 w-full max-w-[600px]'
        >
          {faq?.map(item => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className='border-b border-border'
            >
              <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                <span className='text-text-md font-medium'>
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col pb-1.5 text-left text-grayTextPrimary'>
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <section className='flex w-full flex-col items-center gap-3 rounded-l bg-darker p-2'>
          <img
            src={CexLogo}
            alt='Cexplorer logo'
            className='mx-auto mt-4 h-12 w-12'
          />
          <h3>Still have questions?</h3>
          <p className='text-grayTextPrimary'>
            Can’t find the answer you’re looking for? Get in touch with our
            friendly team.
          </p>
          <a href='https://x.com/cexplorer_io' target='_blank'>
            <Button
              label='Get in touch'
              variant='primary'
              size='md'
              className='w-[220px] max-w-none'
            />
          </a>
        </section>
      </section>
    </PageBase>
  );
};

interface PriceCardProps {
  tier: string;
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
  icon: ReactNode;
  disabled?: boolean;
  link?: string;
}

const PriceCard = ({
  title,
  subtitle,
  tier,
  features,
  cta,
  icon,
  disabled = false,
  link,
}: PriceCardProps) => {
  return (
    <div className='relative mt-1 flex min-h-[420px] basis-[350px] flex-col items-center rounded-l bg-darker p-2 shadow-md'>
      <div className='absolute -top-5 rounded-s border border-border bg-background p-1'>
        {icon}
      </div>
      <span className='mt-3 font-medium'>{tier}</span>
      <h1 className='md:text-[40px]'>{title}</h1>
      <span className='text-text-sm text-grayTextPrimary'>{subtitle}</span>
      <ul className='mt-2 flex flex-col gap-1 text-left text-text-sm'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-center gap-1'>
            <CheckCircle
              color={colors.primary}
              size={15}
              className='shrink-0'
            />{" "}
            {feature}
          </li>
        ))}
      </ul>
      {link ? (
        <a href={link} target='_blank' className='mt-auto w-full max-w-none'>
          <Button
            label={`${cta} ${disabled ? "(Coming soon...)" : ""}`}
            variant='primary'
            size='md'
            className='mt-auto w-full max-w-none'
            disabled={disabled}
          />
        </a>
      ) : (
        <Button
          label={`${cta} ${disabled ? "(Coming soon...)" : ""}`}
          variant='primary'
          size='md'
          className='mt-auto w-full max-w-none'
          disabled={disabled}
        />
      )}
    </div>
  );
};
