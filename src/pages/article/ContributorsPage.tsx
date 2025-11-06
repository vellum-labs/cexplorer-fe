import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ArrowRight } from "lucide-react";

interface ContributorCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
}

const contributors = [
  {
    name: "Placeholder",
    role: "contributor",
    description:
      "Consistently provides valuable feedback, offering insightful suggestions and identifying bugs to help improve Cexplorer.",
  },
];

const contributionWays: ContributorCardProps[] = [
  {
    title: "Support Our Work",
    description:
      "Consider donating or staking with our stake pool to support ongoing development and maintenance.",
    buttonLabel: "Donate",
    buttonLink: "/donate",
  },
  {
    title: "Advertise with Us",
    description:
      "Promote your project through Cexplorer and reach a broader community while supporting our platform.",
    buttonLabel: "Advertising",
    buttonLink: "/ads",
  },
  {
    title: "Provide Feedback",
    description:
      "Help us make Cexplorer better by reporting bugs or suggesting new features.",
    buttonLabel: "GitHub",
    buttonLink: "https://github.com",
  },
  {
    title: "Follow Us on Social Media",
    description:
      "Be part of the conversation! Follow us for updates, sneak peeks, and spread the word about Cexplorer on social media.",
    buttonLabel: "Follow us",
    buttonLink: "/socials",
  },
];

export const ContributorsPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "Contributors | Cexplorer.io" }}
      title='Contributors'
      subTitle='Recognizing those who help Cexplorer thrive and how you can contribute too.'
      breadcrumbItems={[{ label: "Contributors" }]}
      adsCarousel={false}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        {/* Long-term Contributors Section */}
        <div className='mb-8 w-full max-w-[800px]'>
          <div className='mb-6 text-center'>
            <h2>Long-term Cexplorer contributors</h2>
            <p className='text-grayTextPrimary'>
              We're grateful for all contributions, big and small. Thank you for
              being part of the journey!
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            {contributors.map((contributor, index) => (
              <div
                key={index}
                className='flex flex-col gap-2 rounded-xl border border-border p-4'
              >
                <div className='flex flex-col gap-1'>
                  <h3 className='m-0'>{contributor.name}</h3>
                  <span className='text-xs text-grayTextPrimary'>
                    Description of{" "}
                    <span className='text-primary'>{contributor.role}</span>
                  </span>
                </div>
                <p className='text-start text-sm text-grayTextPrimary'>
                  {contributor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How You Can Get Involved Section */}
        <div className='w-full max-w-[800px]'>
          <div className='mb-6 text-center'>
            <h2>How you can get involved</h2>
            <p className='text-grayTextPrimary'>
              Whether you're a developer, user, or supporter, here are some
              great ways to get involved:
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            {contributionWays.map((way, index) => (
              <div
                key={index}
                className='flex flex-col justify-between gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center'
              >
                <div className='flex flex-col gap-1'>
                  <h3 className='m-0'>{way.title}</h3>
                  <span className='text-sm text-grayTextPrimary'>
                    {way.description}
                  </span>
                </div>
                <div className='flex-shrink-0'>
                  <a
                    href={way.buttonLink}
                    target={
                      way.buttonLink.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      way.buttonLink.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
                  >
                    <Button
                      size='md'
                      variant='primary'
                      label={way.buttonLabel}
                      rightIcon={<ArrowRight size={15} />}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageBase>
  );
};
