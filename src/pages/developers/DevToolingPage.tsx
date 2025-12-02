import { PageBase } from "@/components/global/pages/PageBase";
import { networks } from "@/constants/networks";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  ArrowRight,
  Code,
  Link,
  Mail,
  MessageSquare,
  Search,
  ArrowLeftRight,
  Wrench,
} from "lucide-react";
import { DiscordLogo, GithubLogo } from "@vellumlabs/cexplorer-sdk";

interface DevToolingSection {
  label: string;
  description: string;
  buttons: Array<{
    label: string;
    href: string;
    variant: "primary" | "tertiary" | "discord";
    icon?: React.ReactNode;
    external?: boolean;
    isActiveNetwork?: boolean;
  }>;
  icon: React.ReactNode;
}

const devToolingSections: DevToolingSection[] = [
  {
    label: "Address inspector",
    description: "Decode and analyze any Cardano address.",
    buttons: [
      {
        label: "Address inspector",
        href: "/address/inspector",
        variant: "primary",
        icon: <ArrowRight size={16} />,
      },
    ],
    icon: <Search className='text-primary' />,
  },
  {
    label: "Datum inspector",
    description: "Parse on-chain datum values stored in scripts.",
    buttons: [
      {
        label: "Datum inspector",
        href: "/datum",
        variant: "primary",
        icon: <ArrowRight size={16} />,
      },
    ],
    icon: <Code className='text-primary' />,
  },
  {
    label: "Cexplorer API",
    description:
      "Access real-time Cardano on-chain data and integrate directly into your apps.",
    buttons: [
      {
        label: "Documentation",
        href: "https://docs.cexplorer.io",
        variant: "tertiary",
        external: true,
      },
      {
        label: "Get API key",
        href: "/api",
        variant: "tertiary",
      },
      {
        label: "API Page",
        href: "/api",
        variant: "primary",
        icon: <ArrowRight size={16} />,
      },
    ],
    icon: <Link className='text-primary' />,
  },
  {
    label: "Cexplorer SDK",
    description: "An official set of tooling for Cexplorer front-end.",
    buttons: [
      {
        label: "SDK",
        href: "https://github.com/vellum-labs/cexplorer-sdk",
        variant: "primary",
        icon: <ArrowRight size={16} />,
        external: true,
      },
    ],
    icon: <Wrench className='text-primary' />,
  },
  {
    label: "Cexplorer instances",
    description:
      "Access blockchain explorer for both Cardano mainnet and testnet environments.",
    buttons: networks.map(network => ({
      label: network.label.split(" ")[0],
      href: network.url,
      variant: "tertiary" as const,
      external: true,
      isActiveNetwork: network.isActive,
    })),
    icon: <ArrowLeftRight className='text-primary' />,
  },
  {
    label: "Github",
    description: "Explore the source, contribute, and track updates.",
    buttons: [
      {
        label: "Report a bug",
        href: "https://github.com/vellum-labs/cexplorer-fe/issues/new?template=bug_report.md",
        variant: "tertiary",
        external: true,
      },
      {
        label: "Suggest a feature",
        href: "https://github.com/vellum-labs/cexplorer-fe/issues/new?template=feature_request.md",
        variant: "tertiary",
        external: true,
      },
      {
        label: "Github",
        href: "https://github.com/vellum-labs/cexplorer-fe",
        variant: "tertiary",
        external: true,
      },
    ],
    icon: (
      <img
        src={GithubLogo}
        alt='Github'
        width={24}
        height={24}
        className='text-primary'
      />
    ),
  },
  {
    label: "Get in touch",
    description:
      "Reach out to our team for questions, partnerships, feedback, or developer support.",
    buttons: [
      {
        label: "Email",
        href: "mailto:support@cexplorer.io",
        variant: "tertiary",
        icon: <Mail size={16} />,
        external: true,
      },
      {
        label: "Join Discord",
        href: "https://discord.gg/PGCmmQC3dj",
        variant: "discord",
        icon: (
          <img
            src={DiscordLogo}
            alt='Discord'
            width={16}
            height={16}
            className='brightness-0 invert'
          />
        ),
        external: true,
      },
    ],
    icon: <MessageSquare className='text-primary' />,
  },
];

export const DevToolingPage = () => {
  return (
    <PageBase
      metadataTitle='devTooling'
      title='Developer Tools'
      breadcrumbItems={[{ label: "Developers" }]}
    >
      <section className='mt-2 w-full max-w-desktop px-mobile pb-3 md:px-desktop'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {devToolingSections.map((section, index) => (
            <div
              key={index}
              className='flex flex-col rounded-l border border-border px-3 py-2 font-medium'
            >
              <div className='w-fit rounded-m border border-border p-1/2'>
                {section.icon}
              </div>

              <h2 className='mt-2 border-b border-border pb-1 text-text-lg text-text'>
                {section.label}
              </h2>

              <p className='mt-2 text-text-sm text-grayTextPrimary'>
                {section.description}
              </p>

              <div className='mt-6 flex flex-wrap gap-2'>
                {section.buttons.map((button, btnIndex) => (
                  <div
                    key={btnIndex}
                    className={
                      button.variant === "tertiary" && button.external
                        ? "[&>button]:hover:text-primary"
                        : ""
                    }
                  >
                    <Button
                      href={button.external ? undefined : (button.href as any)}
                      onClick={
                        button.external
                          ? () => window.open(button.href, "_blank")
                          : undefined
                      }
                      variant={button.variant}
                      size='sm'
                      label={
                        <span
                          className={`flex items-center gap-1 ${button.isActiveNetwork ? "text-primary" : ""}`}
                        >
                          {button.icon &&
                            button.variant === "tertiary" &&
                            button.icon}
                          {button.label}
                          {button.icon &&
                            (button.variant === "primary" ||
                              button.variant === "discord") &&
                            button.icon}
                        </span>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageBase>
  );
};
