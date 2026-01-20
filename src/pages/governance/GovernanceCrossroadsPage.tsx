import { PageBase } from "@/components/global/pages/PageBase";
import {
  User,
  Send,
  FileText,
  Building,
  Gauge,
  ScrollText,
} from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceSection {
  key: string;
  labelKey: string;
  descriptionKey: string;
  href?: string;
  buttonTextKey?: string;
  sections?: Array<{ labelKey: string; href: string }>;
  icon: React.ReactNode;
}

const governanceSectionsConfig: GovernanceSection[] = [
  {
    key: "dreps",
    labelKey: "governanceCrossroads.sections.dreps.label",
    descriptionKey: "governanceCrossroads.sections.dreps.description",
    sections: [
      {
        labelKey: "governanceCrossroads.sections.dreps.viewAll",
        href: "/drep",
      },
      {
        labelKey: "governanceCrossroads.sections.dreps.analytics",
        href: "/drep?tab=analytics",
      },
    ],
    icon: <User className='text-primary' />,
  },
  {
    key: "votes",
    labelKey: "governanceCrossroads.sections.votes.label",
    descriptionKey: "governanceCrossroads.sections.votes.description",
    href: "/gov/vote",
    buttonTextKey: "governanceCrossroads.sections.votes.button",
    icon: <Send className='text-primary' />,
  },
  {
    key: "actions",
    labelKey: "governanceCrossroads.sections.actions.label",
    descriptionKey: "governanceCrossroads.sections.actions.description",
    href: "/gov/action",
    buttonTextKey: "governanceCrossroads.sections.actions.button",
    icon: <FileText className='text-primary' />,
  },
  {
    key: "cc",
    labelKey: "governanceCrossroads.sections.cc.label",
    descriptionKey: "governanceCrossroads.sections.cc.description",
    href: "/gov/cc",
    buttonTextKey: "governanceCrossroads.sections.cc.button",
    icon: <Building className='text-primary' />,
  },
  {
    key: "powerThresholds",
    labelKey: "governanceCrossroads.sections.powerThresholds.label",
    descriptionKey: "governanceCrossroads.sections.powerThresholds.description",
    href: "/gov/power-thresholds",
    buttonTextKey: "governanceCrossroads.sections.powerThresholds.button",
    icon: <Gauge className='text-primary' />,
  },
  {
    key: "constitution",
    labelKey: "governanceCrossroads.sections.constitution.label",
    descriptionKey: "governanceCrossroads.sections.constitution.description",
    href: "/gov/constitution",
    buttonTextKey: "governanceCrossroads.sections.constitution.button",
    icon: <ScrollText className='text-primary' />,
  },
  {
    key: "certificates",
    labelKey: "governanceCrossroads.sections.certificates.label",
    descriptionKey: "governanceCrossroads.sections.certificates.description",
    sections: [
      {
        labelKey: "governanceCrossroads.sections.certificates.registrations",
        href: "/drep/registrations",
      },
      {
        labelKey: "governanceCrossroads.sections.certificates.deregistrations",
        href: "/drep/deregistrations",
      },
      {
        labelKey: "governanceCrossroads.sections.certificates.updates",
        href: "/drep/updates",
      },
    ],
    icon: <FileText className='text-primary' />,
  },
];

export const GovernanceCrossroadsPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataTitle='governance'
      title={t("governanceCrossroads.title")}
      breadcrumbItems={[{ label: t("governanceCrossroads.breadcrumb") }]}
    >
      <section className='mt-2 w-full max-w-desktop px-mobile pb-3 md:px-desktop'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {governanceSectionsConfig.map(section => (
            <div
              key={section.key}
              className='flex flex-col rounded-l border border-border px-3 py-2 font-medium'
            >
              <div className='w-fit rounded-m border border-border p-1/2'>
                {section.icon}
              </div>

              <h2 className='mt-2 border-b border-border pb-1 text-text-lg text-text'>
                {t(section.labelKey)}
              </h2>

              <p className='mt-2 text-text-sm text-grayTextPrimary'>
                {t(section.descriptionKey)}
              </p>

              {section.sections ? (
                <div className='mt-6 flex flex-wrap gap-2'>
                  {section.sections.map((subsection, subIndex) => (
                    <Button
                      key={subIndex}
                      href={subsection.href as any}
                      variant={
                        section.key === "dreps" && subIndex === 0
                          ? "primary"
                          : "tertiary"
                      }
                      size='sm'
                      label={t(subsection.labelKey)}
                    />
                  ))}
                </div>
              ) : (
                <div className='mt-6 flex gap-2'>
                  <Button
                    href={section.href! as any}
                    variant='primary'
                    size='sm'
                    label={t(section.buttonTextKey!)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageBase>
  );
};
