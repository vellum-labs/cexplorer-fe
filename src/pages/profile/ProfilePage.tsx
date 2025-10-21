import { HeaderBanner } from "@/components/global/HeaderBanner";
import { CustomLabels } from "@/components/profile/CustomLabels";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";

import Tabs from "@/components/global/Tabs";
import { ApiProfile } from "@/components/profile/ApiProfile";
import { ProfilePro } from "@/components/profile/ProfilePro";

export const ProfilePage = () => {
  return (
    <>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <Helmet>{<title>{metadata.profile.title}</title>}</Helmet>

        <HeaderBanner
          title='Settings'
          breadcrumbItems={[{ label: "Settings" }]}
          subTitle
        />
        <Tabs
          wrapperClassname='mt-0'
          items={[
            {
              key: "settings",
              label: "Profile settings",
              content: <ProfileSettings />,
              visible: true,
            },
            {
              key: "labels",
              label: "Custom labels",
              content: <CustomLabels />,
              visible: true,
            },
            {
              key: "api",
              label: "API",
              content: <ApiProfile />,
              visible: true,
            },
            {
              key: "pro",
              label: "PRO",
              content: <ProfilePro />,
              visible: true,
            },
          ]}
        />
      </main>
    </>
  );
};
