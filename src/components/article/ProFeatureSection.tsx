import type { FC, ReactNode } from "react";
import { GradientCheckIcon } from "@/assets/icons/GradientCheckIcon";

interface ProFeatureSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  featureIdPrefix: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}

export const ProFeatureSection: FC<ProFeatureSectionProps> = ({
  icon,
  title,
  description,
  features,
  featureIdPrefix,
  imageSrc,
  imageAlt,
  imagePosition = "right",
}) => {
  const isImageRight = imagePosition === "right";

  return (
    <div className='flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between'>
      <div
        className={`flex flex-1 items-center justify-center ${isImageRight ? "md:order-2" : ""}`}
        style={{ minWidth: "280px" }}
      >
        <img src={imageSrc} alt={imageAlt} className='w-full max-w-[612px]' />
      </div>

      <div
        className={`flex flex-1 flex-col ${isImageRight ? "md:order-1" : ""}`}
        style={{ minWidth: "280px", maxWidth: isImageRight ? "600px" : "none" }}
      >
        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border'>
          {icon}
        </div>
        <h2 className='text-2xl mb-3 font-bold'>{title}</h2>
        <p className='text-sm mb-6 leading-relaxed text-grayTextPrimary'>
          {description}
        </p>
        <ul className='mb-6 flex flex-col gap-4'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-start gap-3'>
              <GradientCheckIcon id={`${featureIdPrefix}-${index}`} />
              <span className='text-sm'>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
