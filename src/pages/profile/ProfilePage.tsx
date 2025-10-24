import { HeaderBanner } from "@/components/global/HeaderBanner";
import { CustomLabels } from "@/components/profile/CustomLabels";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ApiProfile } from "@/components/profile/ApiProfile";
import { ProfilePro } from "@/components/profile/ProfilePro";
import { webUrl } from "@/constants/confVariables";

export const ProfilePage = () => {
  return (
    <>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <Helmet>
          <meta charSet='utf-8' />
          {<title>{metadata.profile.title}</title>}
          <meta name='description' content={metadata.profile.description} />
          <meta name='keywords' content={metadata.profile.keywords} />
          <meta property='og:title' content={metadata.profile.title} />
          <meta
            property='og:description'
            content={metadata.profile.description}
          />
          <meta property='og:type' content='website' />
          <meta property='og:url' content={webUrl + location.pathname} />
        </Helmet>

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
