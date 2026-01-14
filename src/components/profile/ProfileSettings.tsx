import type { FC } from "react";

import { Button } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { Switch } from "@vellumlabs/cexplorer-sdk";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { EmptyState } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";

import { useAuthToken } from "@/hooks/useAuthToken";
import { updateUserProfile, useFetchUserInfo } from "@/services/user";
import { useEffect, useState } from "react";

import { X, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface UserInfo {
  public: boolean;
  name: string;
  picture: string;
  social: {
    web: string;
    xcom: string;
    telegram: string;
    discord: string;
    patreon: string;
    facebook: string;
    instagram: string;
    github: string;
    linkedin: string;
  };
}

export const ProfileSettings: FC = () => {
  const { t } = useAppTranslation("common");
  const token = useAuthToken();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data, refetch } = useFetchUserInfo();
  const location = useLocation();

  const profileData = data?.data?.profile;

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: profileData?.data?.name ?? "",
    picture: profileData?.data?.picture ?? "",
    public: profileData?.is_public ? Boolean(profileData?.is_public) : false,
    social: {
      xcom: profileData?.data?.social?.xcom ?? "",
      web: profileData?.data?.social?.web ?? "",
      telegram: profileData?.data?.social?.telegram ?? "",
      discord: profileData?.data?.social?.discord ?? "",
      patreon: profileData?.data?.social?.patreon ?? "",
      facebook: profileData?.data?.social?.facebook ?? "",
      instagram: profileData?.data?.social?.instagram ?? "",
      github: profileData?.data?.social?.github ?? "",
      linkedin: profileData?.data?.social?.linkedin ?? "",
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );

  const validationRules = {
    web: (value: string) => {
      const urlValue = value.trim();
      if (urlValue === "") return true;

      let formattedValue = urlValue;

      if (!/^https?:\/\//i.test(formattedValue)) {
        formattedValue = `https://${formattedValue}`;
      }

      try {
        new URL(formattedValue);
        return true;
      } catch {
        return false;
      }
    },
    xcom: (value: string) => /^[a-zA-Z0-9_]{1,30}$/.test(value),
    telegram: (value: string) => {
      return /^[a-zA-Z0-9_]{5,32}$/.test(value);
    },
    discord: (value: string) => /^[^\s#]{2,32}(#[0-9]+)?$/.test(value),
    patreon: (value: string) => /^[a-zA-Z0-9_]{3,50}$/.test(value),
    facebook: (value: string) => /^[a-zA-Z0-9.]{5,50}$/.test(value),
    instagram: (value: string) =>
      /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(value),
    github: (value: string) => /^(?!-)[a-zA-Z0-9-]{1,39}(?<!-)$/.test(value),
    linkedin: (value: string) => /^[a-zA-Z0-9-]{3,100}$/.test(value),
  };

  const errorMessages = {
    web: t("profile.settings.errors.web"),
    xcom: t("profile.settings.errors.xcom"),
    telegram: t("profile.settings.errors.telegram"),
    discord: t("profile.settings.errors.discord"),
    patreon: t("profile.settings.errors.patreon"),
    facebook: t("profile.settings.errors.facebook"),
    instagram: t("profile.settings.errors.instagram"),
    github: t("profile.settings.errors.github"),
    linkedin: t("profile.settings.errors.linkedin"),
  };

  const socialsData = Object.entries(userInfo?.social || {});

  const handleChange = (field: string, value: any) => {
    setUserInfo(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSocialsChange = (key: string, value: string) => {
    const trimmedValue = value.trim();

    setUserInfo(prevData => ({
      ...prevData,
      social: {
        ...(prevData.social || {}),
        [key]: trimmedValue,
      },
    }));

    if (trimmedValue === "") {
      setErrors(prevErrors => ({
        ...prevErrors,
        [key]: undefined,
      }));
      return;
    }

    if (key === "web") {
      let formattedValue = trimmedValue;

      if (!/^https?:\/\//i.test(formattedValue)) {
        formattedValue = `https://${formattedValue}`;
      }

      const isValid = validationRules[key](formattedValue);

      setErrors(prevErrors => ({
        ...prevErrors,
        [key]: isValid ? undefined : errorMessages[key],
      }));
    } else {
      const isValid = validationRules[key](trimmedValue);

      setErrors(prevErrors => ({
        ...prevErrors,
        [key]: isValid ? undefined : errorMessages[key],
      }));
    }
  };

  const handleSave = () => {
    const hasErrors = Object.values(errors).some(error => error !== undefined);

    if (hasErrors) {
      toast(t("profile.settings.fixErrors"), {
        action: {
          label: <X size={15} className='stroke-text' />,
          onClick: () => undefined,
        },
      });
      return;
    }

    const userInfoToSave = { ...userInfo };

    const webValue = userInfo.social?.web;
    if (webValue) {
      let formattedWebValue = webValue.trim();
      if (!/^https?:\/\//i.test(formattedWebValue)) {
        formattedWebValue = `https://${formattedWebValue}`;
      }
      userInfoToSave.social.web = formattedWebValue;
    }

    return updateUserProfile({
      token,
      body: {
        public: Number(userInfo.public),
        name: userInfoToSave.name,
        picture: "https://",
        social: userInfoToSave.social,
      },
    })
      .then(() => {
        toast(t("profile.settings.successfullyUpdated"), {
          action: {
            label: <X size={15} className='stroke-text' />,
            onClick: () => undefined,
          },
        });
      })
      .catch(error => {
        console.error("err", String(error));
        if (String(error).includes("read-only")) return;
        toast(t("profile.settings.updateFailed"), {
          action: {
            label: <X size={15} className='stroke-text' />,
            onClick: () => undefined,
          },
          id: "profile_update",
        });
      });
  };

  const handleCancel = () => {
    if (profileData?.data) {
      setUserInfo({
        ...profileData?.data,
        name: profileData?.data.name.split("_").join(" "),
        public: profileData?.is_public
          ? Boolean(profileData?.is_public)
          : false,
        social: profileData?.data?.social || {
          xcom: "",
          web: "",
          telegram: "",
          discord: "",
          patreon: "",
          facebook: "",
          instagram: "",
          github: "",
          linkedin: "",
        },
      });

      setErrors({});
      return;
    }

    setErrors({});
    setUserInfo({
      name: "",
      picture: "",
      public: false,
      social: {
        xcom: "",
        web: "",
        telegram: "",
        discord: "",
        patreon: "",
        facebook: "",
        instagram: "",
        github: "",
        linkedin: "",
      },
    });
  };

  useEffect(() => {
    handleCancel();
  }, [profileData]);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [location.href, token]);

  if (!token) {
    return (
      <>
        {showConnectModal && (
          <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
        )}
        <div className='flex w-full max-w-desktop flex-col'>
          <EmptyState
            icon={<Wallet size={24} />}
            primaryText={t("profile.walletNotConnected")}
            secondaryText={t("profile.settings.connectToAccess")}
            button={
              <Button
                label={t("profile.connectWallet")}
                variant='primary'
                size='md'
                onClick={() => setShowConnectModal(true)}
              />
            }
          />
        </div>
      </>
    );
  }

  return (
    <div className='flex w-full max-w-desktop flex-col'>
      <h2>{t("profile.settings.title")}</h2>
      <p className='border-b border-border pb-2 text-grayTextPrimary'>
        {t("profile.settings.description")}
      </p>
      <ProfileForm
        title={t("profile.settings.publicProfile")}
        description={t("profile.settings.publicProfileDescription")}
        sideContent={
          <Switch
            className='self-center'
            active={userInfo.public}
            onClick={() => handleChange("public", !userInfo.public)}
          />
        }
      />
      <ProfileForm
        title={t("profile.settings.username")}
        description={t("profile.settings.usernameDescription")}
        sideContent={
          <div className='w-full self-center min-[680px]:w-[300px]'>
            <TableSearchInput
              onchange={val => handleChange("name", val)}
              placeholder={t("profile.settings.noUsername")}
              value={userInfo.name}
              showPrefixPopup={false}
            />
          </div>
        }
      />
      <ProfileForm
        title={t("profile.settings.profilePicture")}
        description={t("profile.settings.profilePictureDescription")}
        sideContent={
          <p className='self-center'>{t("profile.settings.soon")}</p>
        }
      />
      <ProfileForm
        title={t("profile.settings.socialProfiles")}
        description={t("profile.settings.socialProfilesDescription")}
        sideContent={
          <div className='flex w-full flex-col gap-1.5 self-center min-[680px]:w-[300px]'>
            {socialsData.map(([key, value]) => (
              <div
                key={key}
                className='transition-all duration-300 ease-in-out'
              >
                <TableSearchInput
                  key={key}
                  onchange={val => handleSocialsChange(key, val)}
                  placeholder=''
                  value={value}
                  searchPrefix={key[0].toUpperCase() + key.slice(1)}
                  showPrefixPopup={false}
                  showSearchIcon={false}
                  stretchPrefix
                  prefixClassname='w-[80px]'
                />
                <p
                  className={`overflow-hidden text-text-sm text-red-500 opacity-0 ${
                    errors[key] ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors[key] && errorMessages[key]}
                </p>
              </div>
            ))}
          </div>
        }
        showBorder={false}
      />
      <div className='flex w-full justify-end gap-1'>
        <Button
          label={t("profile.cancel")}
          size='lg'
          variant='tertiary'
          onClick={handleCancel}
        />
        <Button
          label={t("profile.save")}
          size='lg'
          variant='primary'
          onClick={handleSave}
        />
      </div>
    </div>
  );
};
