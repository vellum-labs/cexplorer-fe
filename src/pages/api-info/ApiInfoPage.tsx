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
import { useAppTranslation } from "@/hooks/useAppTranslation";

type FaqItemType = "simple" | "withLink" | "withPerks";

interface FaqConfigItem {
  id: string;
  type: FaqItemType;
}

const faqConfig: FaqConfigItem[] = [
  { id: "q1", type: "simple" },
  { id: "q2", type: "withLink" },
  { id: "q3", type: "simple" },
  { id: "q4", type: "withLink" },
  { id: "q5", type: "simple" },
  { id: "q6", type: "withLink" },
  { id: "q7", type: "simple" },
  { id: "q8", type: "withPerks" },
  { id: "q9", type: "simple" },
  { id: "q10", type: "simple" },
];

const priceTierIcons = {
  starter: <Zap />,
  basic: <Layers2 />,
  pro: <Layers />,
};

export const ApiInfoPage = () => {
  const { t } = useAppTranslation();
  const { data } = useFetchMiscApi();
  const apiData = data?.data.plans;

  const priceTiers = {
    starter: {
      tier: t("apiPage.tiers.starter.tier"),
      title: t("apiPage.tiers.starter.title"),
      subtitle: t("apiPage.tiers.starter.subtitle"),
      cta: t("apiPage.tiers.starter.cta"),
      features: [
        t("apiPage.tiers.starter.features.ideal"),
        t("apiPage.tiers.starter.features.requestsPerMinute", { count: apiData?.starter.rq_min }),
        t("apiPage.tiers.starter.features.requestsPerDay", { count: apiData?.starter.rq_day }),
        t("apiPage.tiers.starter.features.tokensPerDay", { count: apiData?.starter.tok_day }),
      ],
      disabled: false,
      link: "/profile?tab=api",
    },
    basic: {
      tier: t("apiPage.tiers.basic.tier"),
      title: t("apiPage.tiers.basic.title"),
      subtitle: t("apiPage.tiers.basic.subtitle"),
      cta: t("apiPage.tiers.basic.cta"),
      features: [
        t("apiPage.tiers.basic.features.ideal"),
        t("apiPage.tiers.basic.features.stackingNote"),
        t("apiPage.tiers.basic.features.requestsPerMinute", { count: apiData?.basic.rq_min }),
        t("apiPage.tiers.basic.features.requestsPerDayNft", { count: apiData?.basic.rq_day }),
        t("apiPage.tiers.basic.features.tokensPerDayNft", { count: apiData?.basic.tok_day }),
      ],
      disabled: true,
      link: undefined,
    },
    pro: {
      tier: t("apiPage.tiers.pro.tier"),
      title: t("apiPage.tiers.pro.title"),
      subtitle: t("apiPage.tiers.pro.subtitle"),
      cta: t("apiPage.tiers.pro.cta"),
      features: [
        t("apiPage.tiers.pro.features.ideal"),
        t("apiPage.tiers.pro.features.flexibleLimits"),
        t("apiPage.tiers.pro.features.requestsPerMinute", { count: apiData?.pro.rq_min }),
        t("apiPage.tiers.pro.features.requestsPerDay", { count: apiData?.pro.rq_day }),
        t("apiPage.tiers.pro.features.tokensPerDay", { count: apiData?.pro.tok_day }),
        t("apiPage.tiers.pro.features.prioritySupport"),
      ],
      disabled: false,
      link: "https://discord.gg/YuSFx7GS7y",
    },
  };

  const renderFaqAnswer = (item: FaqConfigItem) => {
    const baseKey = `apiPage.faq.questions.${item.id}`;

    if (item.type === "simple") {
      return t(`${baseKey}.answer`);
    }

    if (item.type === "withLink") {
      return (
        <p>
          {t(`${baseKey}.answerPart1`)}{" "}
          <Link className='text-primary underline' to='/pro'>
            {t(`${baseKey}.answerLink`)}
          </Link>
          {t(`${baseKey}.answerPart2`)}
        </p>
      );
    }

    if (item.type === "withPerks") {
      return (
        <div className='flex flex-col gap-1'>
          <span className='flex gap-1/2'>
            {t(`${baseKey}.answerIntro`)}{" "}
            <Link className='text-primary underline' to='/pro'>
              {t(`${baseKey}.answerLink`)}
            </Link>{" "}
            {t(`${baseKey}.answerIntro2`)}
          </span>
          <ul className='list-inside list-disc'>
            <li>{t(`${baseKey}.perk1`)}</li>
            <li>{t(`${baseKey}.perk2`)}</li>
            <li>{t(`${baseKey}.perk3`)}</li>
            <li>{t(`${baseKey}.perk4`)}</li>
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <PageBase
      metadataOverride={{ title: t("apiPage.metaTitle") }}
      title={t("apiPage.title")}
      subTitle={t("apiPage.subtitle")}
      breadcrumbItems={[{ label: t("apiPage.breadcrumb.developers"), link: "/dev" }, { label: t("apiPage.breadcrumb.apiPlans") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-4 px-mobile pb-3 text-center md:px-desktop'>
        <Banner description={t("apiPage.banner")} />
        <section className='mt-4 flex w-full flex-wrap items-center justify-center gap-3'>
          {Object.entries(priceTiers).map(([key, value]) => (
            <PriceCard
              key={key}
              tier={value.tier}
              title={value.title}
              subtitle={value.subtitle}
              features={value.features}
              cta={value.cta}
              icon={priceTierIcons[key as keyof typeof priceTierIcons]}
              disabled={value.disabled}
              link={value.link}
              comingSoonText={t("apiPage.tiers.comingSoon")}
            />
          ))}
        </section>
        <section className='mt-4 flex w-full max-w-[500px] flex-col items-center justify-between gap-3 rounded-l border border-border p-2 md:flex-row md:text-left'>
          <div className='flex flex-col gap-2'>
            <h3>{t("apiPage.documentation.title")}</h3>{" "}
            <p className='text-grayTextPrimary'>
              {t("apiPage.documentation.description")}{" "}
            </p>
          </div>
          <a
            className='w-full max-w-[200px] text-nowrap hover:text-text'
            href='https://cexplorer.apidocumentation.com/cexplorer-api'
            target='_blank'
          >
            <Button
              rightIcon={<ArrowRight />}
              label={t("apiPage.documentation.button")}
              variant='tertiary'
              size='md'
              className='h-[40px]'
            />
          </a>
        </section>
        <h2 className='-mb-4 mt-4 md:text-[30px]'>
          {t("apiPage.faq.title")}
        </h2>
        <p className='text-grayTextPrimary'>
          {t("apiPage.faq.description")}
        </p>
        <Accordion
          type='single'
          collapsible
          className='mt-2 w-full max-w-[600px]'
        >
          {faqConfig.map(item => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className='border-b border-border'
            >
              <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                <span className='text-text-md font-medium'>
                  {t(`apiPage.faq.questions.${item.id}.question`)}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col pb-1.5 text-left text-grayTextPrimary'>
                  {renderFaqAnswer(item)}
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
          <h3>{t("apiPage.stillHaveQuestions.title")}</h3>
          <p className='text-grayTextPrimary'>
            {t("apiPage.stillHaveQuestions.description")}
          </p>
          <a href='https://x.com/cexplorer_io' target='_blank'>
            <Button
              label={t("apiPage.stillHaveQuestions.button")}
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
  comingSoonText?: string;
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
  comingSoonText = "(Coming soon...)",
}: PriceCardProps) => {
  const isExternalLink = link?.startsWith('http');

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
        isExternalLink ? (
          <a href={link} target='_blank' className='mt-auto w-full max-w-none'>
            <Button
              label={`${cta} ${disabled ? comingSoonText : ""}`}
              variant='primary'
              size='md'
              className='mt-auto w-full max-w-none'
              disabled={disabled}
            />
          </a>
        ) : (
          <Link to={link} className='mt-auto w-full max-w-none'>
            <Button
              label={`${cta} ${disabled ? comingSoonText : ""}`}
              variant='primary'
              size='md'
              className='mt-auto w-full max-w-none'
              disabled={disabled}
            />
          </Link>
        )
      ) : (
        <Button
          label={`${cta} ${disabled ? comingSoonText : ""}`}
          variant='primary'
          size='md'
          className='mt-auto w-full max-w-none'
          disabled={disabled}
        />
      )}
    </div>
  );
};
