import { PageBase } from "@/components/global/pages/PageBase";
import { networks } from "@/constants/networks";
import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  ArrowRight,
  Code,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Search,
  ArrowLeftRight,
  Wrench,
  Binary,
  ShieldCheck,
} from "lucide-react";
import { DiscordLogo, GithubLogo } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const DevToolingPage = () => {
  const { t } = useAppTranslation("common");

  const devToolingSections = [
    {
      label: t("devTooling.sections.addressInspector.label"),
      description: t("devTooling.sections.addressInspector.description"),
      buttons: [
        {
          label: t("devTooling.sections.addressInspector.button"),
          href: "/address/inspector",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
        },
      ],
      icon: <Search className='text-primary' />,
    },
    {
      label: t("devTooling.sections.datumInspector.label"),
      description: t("devTooling.sections.datumInspector.description"),
      buttons: [
        {
          label: t("devTooling.sections.datumInspector.button"),
          href: "/datum",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
        },
      ],
      icon: <Code className='text-primary' />,
    },
    {
      label: t("devTooling.sections.cexplorerApi.label"),
      description: t("devTooling.sections.cexplorerApi.description"),
      buttons: [
        {
          label: t("devTooling.sections.cexplorerApi.documentation"),
          href: "https://docs.cexplorer.io",
          variant: "tertiary" as const,
          external: true,
        },
        {
          label: t("devTooling.sections.cexplorerApi.getApiKey"),
          href: "/api",
          variant: "tertiary" as const,
        },
        {
          label: t("devTooling.sections.cexplorerApi.apiPage"),
          href: "/api",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
        },
      ],
      icon: <LinkIcon className='text-primary' />,
    },
    {
      label: t("devTooling.sections.cexplorerSdk.label"),
      description: t("devTooling.sections.cexplorerSdk.description"),
      buttons: [
        {
          label: t("devTooling.sections.cexplorerSdk.button"),
          href: "https://github.com/vellum-labs/cexplorer-sdk",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
          external: true,
        },
      ],
      icon: <Wrench className='text-primary' />,
    },
    {
      label: t("devTooling.sections.uplcViewer.label"),
      description: t("devTooling.sections.uplcViewer.description"),
      buttons: [
        {
          label: t("devTooling.sections.uplcViewer.button"),
          href: "/uplc",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
        },
      ],
      icon: <Binary className='text-primary' />,
    },
    {
      label: t("devTooling.sections.scriptVerification.label"),
      description: t("devTooling.sections.scriptVerification.description"),
      buttons: [
        {
          label: t("devTooling.sections.scriptVerification.button"),
          href: "/script/verification",
          variant: "primary" as const,
          icon: <ArrowRight size={16} />,
        },
      ],
      icon: <ShieldCheck className='text-primary' />,
    },
    {
      label: t("devTooling.sections.cexplorerInstances.label"),
      description: t("devTooling.sections.cexplorerInstances.description"),
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
      label: t("devTooling.sections.github.label"),
      description: t("devTooling.sections.github.description"),
      buttons: [
        {
          label: t("devTooling.sections.github.reportBug"),
          href: "https://github.com/vellum-labs/cexplorer-fe/issues/new?template=bug_report.md",
          variant: "tertiary" as const,
          external: true,
        },
        {
          label: t("devTooling.sections.github.suggestFeature"),
          href: "https://github.com/vellum-labs/cexplorer-fe/issues/new?template=feature_request.md",
          variant: "tertiary" as const,
          external: true,
        },
        {
          label: t("devTooling.sections.github.button"),
          href: "https://github.com/vellum-labs/cexplorer-fe",
          variant: "tertiary" as const,
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
      label: t("devTooling.sections.getInTouch.label"),
      description: t("devTooling.sections.getInTouch.description"),
      buttons: [
        {
          label: t("devTooling.sections.getInTouch.email"),
          href: "mailto:support@cexplorer.io",
          variant: "tertiary" as const,
          icon: <Mail size={16} />,
          external: true,
        },
        {
          label: t("devTooling.sections.getInTouch.joinDiscord"),
          href: "https://discord.gg/PGCmmQC3dj",
          variant: "discord" as const,
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

  return (
    <PageBase
      metadataTitle='devTooling'
      title={t("devTooling.title")}
      breadcrumbItems={[{ label: t("devTooling.breadcrumb") }]}
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
                {section.buttons.map((button, btnIndex) => {
                  const buttonContent = (
                    <Button
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
                  );

                  if (button.external) {
                    return (
                      <a
                        key={btnIndex}
                        href={button.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={
                          button.variant === "tertiary"
                            ? "[&>button]:hover:text-primary"
                            : ""
                        }
                      >
                        {buttonContent}
                      </a>
                    );
                  }

                  return (
                    <Link key={btnIndex} to={button.href as any}>
                      {buttonContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageBase>
  );
};
