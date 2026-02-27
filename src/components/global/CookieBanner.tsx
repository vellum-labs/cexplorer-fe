import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { useCookieConsentStore } from "@/stores/cookieConsentStore";
import { isEuUser } from "@/utils/isEuUser";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const CookieBanner: FC = () => {
  const { t } = useAppTranslation("common");
  const { accepted, setAccepted } = useCookieConsentStore();

  if (accepted || !isEuUser()) {
    return null;
  }

  return (
    <div id='cookie'>
      <div className='fixed bottom-14 z-40 flex w-full justify-center p-mobile md:bottom-0 md:px-desktop'>
        <div className='box-border flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-l border border-border bg-background p-mobile md:px-desktop md:py-mobile'>
          <p className='text-sm text-text-secondary'>
            {t("cookie.message")}{" "}
            <Link to='/terms' className='text-primary'>
              {t("navigation:footer.termsConditions")}
            </Link>{" "}
            &{" "}
            <Link to='/privacy' className='text-primary'>
              {t("navigation:footer.privacyPolicy")}
            </Link>
          </p>
          <Button
            label={t("cookie.accept")}
            variant='primary'
            size='sm'
            onClick={() => setAccepted(true)}
          />
        </div>
      </div>
    </div>
  );
};
