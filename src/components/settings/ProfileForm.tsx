import type { FC, ReactNode } from "react";

interface ProfileFormProps {
  title: string;
  description: string;
  sideContent: ReactNode;
  showBorder?: boolean;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  title,
  description,
  sideContent,
  showBorder = true,
}) => {
  return (
    <div
      className={`flex flex-wrap items-start gap-x-5 gap-y-1.5 ${showBorder ? "border-b border-border" : ""} py-6`}
    >
      <div className='w-fit'>
        <h3>{title}</h3>
        <p className='text-grayTextPrimary max-w-[300px] text-sm'>
          {description}
        </p>
      </div>
      {sideContent}
    </div>
  );
};
