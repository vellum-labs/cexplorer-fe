import { CustomLabels } from "@/components/profile/CustomLabels";
import { ProfileSettings } from "@/components/profile/ProfileSettings";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ApiProfile } from "@/components/profile/ApiProfile";
import { ProfilePro } from "@/components/profile/ProfilePro";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PageBase } from "@/components/global/pages/PageBase";

export const ProfilePage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataTitle='profile'
      title={t("pages:profile.title")}
      breadcrumbItems={[{ label: t("pages:breadcrumbs.settings") }]}
      adsCarousel={false}
    >
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
    </PageBase>
  );
};
