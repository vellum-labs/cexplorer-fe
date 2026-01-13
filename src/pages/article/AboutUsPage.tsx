import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  Check,
  TrendingUp,
  Landmark,
  User,
  Zap,
  Heart,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Service {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  link: string;
}

const services: Service[] = [
  {
    icon: Check,
    titleKey: "aboutPage.services.explore.title",
    descriptionKey: "aboutPage.services.explore.description",
    link: "/tx",
  },
  {
    icon: TrendingUp,
    titleKey: "aboutPage.services.analytics.title",
    descriptionKey: "aboutPage.services.analytics.description",
    link: "/analytics",
  },
  {
    icon: Landmark,
    titleKey: "aboutPage.services.governance.title",
    descriptionKey: "aboutPage.services.governance.description",
    link: "/gov",
  },
  {
    icon: User,
    titleKey: "aboutPage.services.developers.title",
    descriptionKey: "aboutPage.services.developers.description",
    link: "/more",
  },
  {
    icon: Zap,
    titleKey: "aboutPage.services.reliability.title",
    descriptionKey: "aboutPage.services.reliability.description",
    link: "/faq",
  },
  {
    icon: Heart,
    titleKey: "aboutPage.services.community.title",
    descriptionKey: "aboutPage.services.community.description",
    link: "/donate",
  },
];

export const AboutUsPage = () => {
  const { t } = useAppTranslation();
  return (
    <PageBase
      metadataOverride={{ title: t("aboutPage.metaTitle") }}
      title={t("aboutPage.title")}
      breadcrumbItems={[{ label: t("aboutPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <div className='mb-12 flex w-full max-w-[800px] flex-col items-center text-center'>
          <p className='text-base text-muted-foreground'>
            {t("aboutPage.description")}
          </p>
        </div>

        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h2 className='text-2xl mb-2 font-semibold'>
            {t("aboutPage.sectionTitle")}
          </h2>
          <p className='text-base text-muted-foreground mb-8'>
            {t("aboutPage.sectionSubtitle")}
          </p>

          <div className='grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className='flex flex-col items-center gap-4 text-center'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
                    <Icon size={20} className='text-foreground' />
                  </div>
                  <h3 className='text-lg font-semibold'>
                    {t(service.titleKey)}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {t(service.descriptionKey)}
                  </p>
                  <Button
                    variant='primary'
                    size='sm'
                    label={
                      <span className='flex items-center gap-2'>
                        {t("aboutPage.learnMore")}
                        <ArrowRight size={15} />
                      </span>
                    }
                    href={service.link as any}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageBase>
  );
};
