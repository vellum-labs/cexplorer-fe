import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ExternalLink, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { colors } from "@/constants/colors";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const guidelineKeys = ["g1", "g2"];

export const BountyPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataOverride={{ title: t("bountyPage.metaTitle") }}
      title={t("bountyPage.title")}
      subTitle={t("bountyPage.subtitle")}
      breadcrumbItems={[{ label: t("bountyPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <div className='mb-6 w-full max-w-[800px] rounded-xl border border-border p-6'>
          <h3 className='text-xl mt-0 font-semibold'>
            {t("bountyPage.guidelines.title")}
          </h3>
          <p className='text-sm mb-4 text-grayTextPrimary'>
            {t("bountyPage.guidelines.description")}
          </p>
          <ul className='mb-4 flex flex-col gap-3'>
            {guidelineKeys.map(key => (
              <li key={key} className='flex items-start gap-3'>
                <span className='text-sm text-grayTextPrimary'>
                  {t(`bountyPage.guidelines.items.${key}`)}
                </span>
              </li>
            ))}
          </ul>
          <p className='text-sm'>
            <strong></strong>
          </p>
        </div>

        <div className='mb-4 flex w-full max-w-[800px] flex-col justify-between gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center'>
          <div className='flex flex-col'>
            <h3 className='text-xl mb-2 font-semibold'>
              {t("bountyPage.reportBug.title")}
            </h3>
            <p className='text-sm text-grayTextPrimary'>
              {t("bountyPage.reportBug.description")}
            </p>
          </div>
          <div className='flex-shrink-0'>
            <a
              href='https://github.com/vellum-labs/cexplorer-fe/issues'
              target='_blank'
              rel='noreferrer noopener'
            >
              <Button
                size='md'
                variant='primary'
                label={t("bountyPage.reportBug.button")}
                rightIcon={<ExternalLink size={15} />}
              />
            </a>
          </div>
        </div>

        <div className='mb-6 flex w-full max-w-[800px] flex-col justify-between gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center'>
          <div className='flex flex-col'>
            <h3 className='text-xl mb-2 font-semibold'>
              {t("bountyPage.suggestFeature.title")}
            </h3>
            <p className='text-sm text-grayTextPrimary'>
              {t("bountyPage.suggestFeature.description")}
            </p>
          </div>
          <div className='flex-shrink-0'>
            <a
              href='https://github.com/vellum-labs/cexplorer-fe/issues'
              target='_blank'
              rel='noreferrer noopener'
            >
              <Button
                size='md'
                variant='primary'
                label={t("bountyPage.suggestFeature.button")}
                rightIcon={<ExternalLink size={15} />}
              />
            </a>
          </div>
        </div>

        <div className='flex w-full max-w-[800px] flex-wrap gap-4 border-t border-border pt-6'>
          <div className='flex flex-1 basis-[350px] flex-col rounded-xl border border-border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div
                className='flex h-8 w-8 items-center justify-center rounded-xl'
                style={{
                  backgroundColor: "rgba(219, 234, 254, 0.9)",
                  outline: "6px solid rgba(219, 234, 254, 0.5)",
                }}
              >
                <MessageCircle size={20} color={colors.darkBlue} />
              </div>
              <h3 className='text-lg m-0 font-semibold'>
                {t("bountyPage.support.title")}
              </h3>
            </div>
            <p className='text-sm mb-4 pl-11 text-grayTextPrimary'>
              {t("bountyPage.support.description")}
            </p>
            <div className='ml-auto mt-auto'>
              <a
                href='https://discord.gg/PGCmmQC3dj'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button
                  size='sm'
                  variant='discord'
                  label={t("bountyPage.support.button")}
                />
              </a>
            </div>
          </div>

          <div className='flex flex-1 basis-[350px] flex-col rounded-xl border border-border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div
                className='flex h-8 w-8 items-center justify-center rounded-xl'
                style={{
                  backgroundColor: "rgba(219, 234, 254, 0.9)",
                  outline: "6px solid rgba(219, 234, 254, 0.5)",
                }}
              >
                <Heart size={20} color={colors.darkBlue} />
              </div>
              <h3 className='text-lg m-0 font-semibold'>
                {t("bountyPage.donate.title")}
              </h3>
            </div>
            <p className='text-sm mb-4 pl-11 text-grayTextPrimary'>
              {t("bountyPage.donate.description")}
            </p>
            <div className='ml-auto mt-auto'>
              <a href='/donate'>
                <Button
                  size='sm'
                  variant='tertiary'
                  label={t("bountyPage.donate.button")}
                  rightIcon={<ArrowRight size={16} />}
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageBase>
  );
};
