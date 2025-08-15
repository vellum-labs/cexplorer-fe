import { PageBase } from "@/components/global/pages/PageBase";
import { User, Send, FileText, Building, Gauge } from "lucide-react";
import Button from "@/components/global/Button";

interface GovernanceSection {
  label: string;
  description: string;
  href?: string;
  buttonText?: string;
  sections?: Array<{ label: string; href: string }>;
  icon: React.ReactNode;
}

const governanceSections: GovernanceSection[] = [
  {
    label: "Delegated Representatives (DReps)",
    description:
      "Explore all Cardano DReps, their voting history, and participation stats.",
    sections: [
      { label: "View all DReps", href: "/drep" },
      { label: "Analytics", href: "/drep?tab=analytics" },
    ],
    icon: <User className='text-primary' />,
  },
  {
    label: "Governance Votes",
    description:
      "Browse all votes from DReps, SPOs, and the Constitutional Committee.",
    href: "/gov/vote",
    buttonText: "View votes",
    icon: <Send className='text-primary' />,
  },
  {
    label: "Governance Actions",
    description: "View every governance action, its details, and the outcomes.",
    href: "/gov/action",
    buttonText: "View governance actions",
    icon: <FileText className='text-primary' />,
  },
  {
    label: "Constitutional Committee (CC)",
    description:
      "See who's on the committee, their role, and how they've voted.",
    href: "/gov/cc",
    buttonText: "View Constitutional Committee",
    icon: <Building className='text-primary' />,
  },
  {
    label: "Power Thresholds",
    description: "See Cardano power distribution and governance.",
    href: "/gov/power-thresholds",
    buttonText: "View Power Thresholds",
    icon: <Gauge className='text-primary' />,
  },
  {
    label: "Certificates",
    description:
      "All transactions with DRep registrations, updates, and deregistrations.",
    sections: [
      { label: "DRep registrations", href: "/drep/registrations" },
      { label: "DRep deregistrations", href: "/drep/deregistrations" },
      { label: "DRep updates", href: "/drep/updates" },
    ],
    icon: <FileText className='text-primary' />,
  },
];

export const GovernanceCrossroadsPage = () => {
  return (
    <PageBase
      metadataTitle='governance'
      title='Governance'
      breadcrumbItems={[{ label: "Governance" }]}
    >
      <section className='mt-4 w-full max-w-desktop px-mobile pb-5 md:px-desktop'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          {governanceSections.map((section, index) => (
            <div
              key={index}
              className='flex flex-col rounded-xl border border-border px-6 py-4 font-medium'
            >
              <div className='w-fit rounded-lg border border-border p-1'>
                {section.icon}
              </div>

              <h2 className='mt-4 border-b border-border pb-2 text-lg text-text'>
                {section.label}
              </h2>

              <p className='mt-4 text-sm text-grayTextPrimary'>
                {section.description}
              </p>

              {section.sections ? (
                <div className='mt-12 flex flex-wrap gap-4'>
                  {section.sections.map((subsection, subIndex) => (
                    <Button
                      key={subIndex}
                      href={subsection.href as any}
                      variant={
                        section.label === "Delegated Representatives (DReps)" &&
                        subIndex === 0
                          ? "primary"
                          : "tertiary"
                      }
                      size='sm'
                      label={subsection.label}
                    />
                  ))}
                </div>
              ) : (
                <div className='mt-12 flex gap-4'>
                  <Button
                    href={section.href! as any}
                    variant='primary'
                    size='sm'
                    label={section.buttonText}
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
