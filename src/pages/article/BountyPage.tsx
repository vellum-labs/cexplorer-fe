import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ExternalLink, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { colors } from "@/constants/colors";

const guidelines = [
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
];

export const BountyPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "Bug Bounty Program | Cexplorer.io" }}
      title='Bug Bounty Program'
      subTitle='Find bugs, get rewarded.'
      breadcrumbItems={[{ label: "Bug Bounty" }]}
      adsCarousel={false}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <div className='mb-6 w-full max-w-[800px] rounded-xl border border-border p-6'>
          <h3 className='text-xl mt-0 font-semibold'>Guidelines</h3>
          <p className='text-sm mb-4 text-grayTextPrimary'>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat.
          </p>
          <ul className='mb-4 flex flex-col gap-3'>
            {guidelines.map((guideline, index) => (
              <li key={index} className='flex items-start gap-3'>
                <span className='text-sm text-grayTextPrimary'>
                  {guideline}
                </span>
              </li>
            ))}
          </ul>
          <p className='text-sm'>
            <strong>Note:</strong> XYZ
          </p>
        </div>

        <div className='mb-4 flex w-full max-w-[800px] flex-col justify-between gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center'>
          <div className='flex flex-col'>
            <h3 className='text-xl mb-2 font-semibold'>
              Report a bug on GitHub
            </h3>
            <p className='text-sm text-grayTextPrimary'>
              Spotted something off? Help us squash bugs and improve Cexplorer.
            </p>
          </div>
          <div className='flex-shrink-0'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noreferrer noopener'
            >
              <Button
                size='md'
                variant='primary'
                label='Report a bug'
                rightIcon={<ExternalLink size={15} />}
              />
            </a>
          </div>
        </div>

        <div className='mb-6 flex w-full max-w-[800px] flex-col justify-between gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center'>
          <div className='flex flex-col'>
            <h3 className='text-xl mb-2 font-semibold'>
              Suggest a new feature
            </h3>
            <p className='text-sm text-grayTextPrimary'>
              Think we should add something? Suggest a feature you'd love to
              see.
            </p>
          </div>
          <div className='flex-shrink-0'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noreferrer noopener'
            >
              <Button
                size='md'
                variant='primary'
                label='Suggest a feature'
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
              <h3 className='text-lg m-0 font-semibold'>Support</h3>
            </div>
            <p className='text-sm mb-4 pl-11 text-grayTextPrimary'>
              Join our Discord to get in touch with our support team.
            </p>
            <div className='ml-auto mt-auto'>
              <a
                href='https://discord.gg/yourlink'
                target='_blank'
                rel='noreferrer noopener'
              >
                <Button size='sm' variant='discord' label='Join Discord' />
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
              <h3 className='text-lg m-0 font-semibold'>Donate</h3>
            </div>
            <p className='text-sm mb-4 pl-11 text-grayTextPrimary'>
              Support our mission and keep the Cexplorer rolling
            </p>
            <div className='ml-auto mt-auto'>
              <a href='/donate'>
                <Button
                  size='sm'
                  variant='tertiary'
                  label='Donate page'
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
