import { HeaderBanner } from "@/components/global/HeaderBanner";
import { CustomLabels } from "@/components/profile/CustomLabels";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ApiProfile } from "@/components/profile/ApiProfile";
import { ProfilePro } from "@/components/profile/ProfilePro";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ProfilePage = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <Helmet>{<title>{metadata.profile.title}</title>}</Helmet>

        <HeaderBanner
          title={t("pages:profile.title")}
          breadcrumbItems={[{ label: t("pages:breadcrumbs.settings") }]}
          subTitle
        />
        <Tabs
          wrapperClassname='mt-0'
          items={[
            {
              key: "settings",
              label: t("tabs.profile.profileSettings"),
              content: <ProfileSettings />,
              visible: true,
            },
            {
              key: "labels",
              label: t("tabs.profile.customLabels"),
              content: <CustomLabels />,
              visible: true,
            },
            {
              key: "api",
              label: t("tabs.profile.api"),
              content: <ApiProfile />,
              visible: true,
            },
            {
              key: "pro",
              label: t("tabs.profile.pro"),
              content: <ProfilePro />,
              visible: true,
            },
          ]}
        />
      </main>
    </>
  );
};
