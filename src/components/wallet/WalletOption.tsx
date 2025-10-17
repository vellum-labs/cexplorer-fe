import { walletInfos } from "@/constants/wallet";
import { useThemeStore } from "@/stores/themeStore";
import { useWalletStore } from "@/stores/walletStore";
import type { WalletType } from "@/types/walletTypes";
import { Button } from "@vellumlabs/cexplorer-sdk";

type Props = {
  name: WalletType;
  onConnect: () => void;
  onInstall: () => void;
  isInstalled: boolean;
  supported?: boolean;
};

const WalletOption: React.FC<Props> = ({
  name,
  onConnect,
  isInstalled,
  onInstall,
  supported = false,
}) => {
  const { theme } = useThemeStore();
  const { walletType } = useWalletStore();

  return (
    <button
      className={`relative mb-[15px] flex h-20 w-full items-center justify-between rounded-l border border-border py-[20px] pl-[65px] pr-[15px] hover:bg-darker ${
        supported && walletType !== name
          ? "cursor-pointer border border-border hover:text-primary"
          : "cursor-not-allowed"
      }`}
      onClick={
        !supported || walletType === name
          ? () => {}
          : isInstalled
            ? onConnect
            : onInstall
      }
    >
      <div className='absolute left-[25px] top-1/2 -translate-y-1/2'>
        <img
          alt='Wallet image'
          src={
            theme === "dark" && walletInfos[name]?.darkIcon
              ? walletInfos[name].darkIcon!
              : walletInfos[name]?.icon
          }
          width={30}
          height={30}
        />
      </div>
      <span className='flex items-center text-text-lg font-medium'>
        {walletInfos[name]?.name.slice(0, 1).toUpperCase() +
          walletInfos[name]?.name.slice(1)}
      </span>
      {walletType === name && (
        <span className='flex items-center text-text-sm font-bold text-green-500'>
          Connected
        </span>
      )}
      {!isInstalled && (
        <Button
          label='Install'
          size='sm'
          variant='primary'
          onClick={onInstall}
          disabled={!supported}
        />
      )}
      <div className='absolute bottom-[3px] right-4 text-[10px] text-red-500'>
        {!supported && "Unsupported browser or device"}
      </div>
    </button>
  );
};

export default WalletOption;
