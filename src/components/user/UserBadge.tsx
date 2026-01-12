import { useWalletStore } from "@/stores/walletStore";
import type { User } from "@/types/userTypes";
import { Link } from "@tanstack/react-router";
import { Edit } from "lucide-react";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { UserSocials } from "./UserSocials";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  isLoading: boolean;
  user: User | undefined;
  address: string;
}

export const UserBadge = ({ isLoading, user, address }: Props) => {
  const { t } = useAppTranslation("common");
  const { address: myAddress } = useWalletStore();
  return (
    <>
      {isLoading ? (
        <LoadingSkeleton width='205px' height='30px' rounded='full' />
      ) : (
        <>
          {user?.profile && (
            <Tooltip
              content={
                <div className='relative flex w-[270px] flex-col gap-1'>
                  {address === myAddress && (
                    <Link to='/profile' className='absolute right-0 top-0.5'>
                      <Edit size={15} />
                    </Link>
                  )}
                  <span className='text-text-xs text-grayTextPrimary'>
                    {t("user.userProfile")} ({user?.profile ? t("user.public") : t("user.hidden")})
                  </span>
                  <div className='flex gap-1'>
                    <img
                      src={user?.profile?.picture}
                      height={50}
                      width={50}
                      className='h-[50px] w-[50px] rounded-max'
                    />
                    <div className='flex flex-col gap-1 text-[16px] font-medium'>
                      <span className='flex items-center gap-1'>
                        {user?.profile?.name}{" "}
                        {user?.membership && user.membership.nfts > 0 && (
                          <Badge
                            className='px-0 py-0'
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                              padding: "0px 4px 0px 4px",
                            }}
                            color='purple'
                          >
                            PRO
                          </Badge>
                        )}
                      </span>
                      <UserSocials author={user} />
                    </div>
                  </div>
                </div>
              }
            >
              <Badge
                color='gray'
                className='gap-1 py-1/2'
                style={{
                  fontSize: "13px",
                }}
              >
                <span className='h-5 w-5'>
                  <img
                    src={user?.profile?.picture}
                    height={20}
                    width={20}
                    className='h-5 w-5 rounded-max'
                  />
                </span>
                {user?.profile?.name}

                {user?.membership && user.membership.nfts > 0 && (
                  <Badge
                    className='px-0 py-0'
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "1px 3px 1px 3px",
                    }}
                    color='purple'
                  >
                    PRO
                  </Badge>
                )}
              </Badge>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
};
