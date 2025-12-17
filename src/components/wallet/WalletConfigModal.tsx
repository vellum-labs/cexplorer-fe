import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { loginUser } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletConfigModalState } from "@/stores/states/walletConfigModalState";
import { useUqStore } from "@/stores/uqStore";
import { useWalletStore } from "@/stores/walletStore";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { toast } from "sonner";

const date = new Date();
const month = date.toLocaleDateString("en-US", { month: "2-digit" });
const year = date.toLocaleDateString("en-US", { year: "2-digit" });
const dateNumber = month + year;

const WalletConfigModal = () => {
  const { isOpen, setIsOpen } = useWalletConfigModalState();
  const { uq } = useUqStore();
  const secureRef = useRef<0 | 1>(0);
  const expirationRef = useRef<"d" | "w" | "m" | "y">("d");
  const { address, wallet } = useWalletStore();
  const { tokens, setTokens } = useAuthTokensStore();
  const { disconnect } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);

  const closeAndDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  const translateExpiration = (expiration: "d" | "w" | "m" | "y") => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);

    switch (expiration) {
      case "d":
        futureDate.setDate(currentDate.getDate() + 1);
        break;
      case "w":
        futureDate.setDate(currentDate.getDate() + 7);
        break;
      case "m":
        futureDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "y":
        futureDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        throw new Error("Invalid expiration type");
    }

    const day = String(futureDate.getDate()).padStart(2, "0");
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const year = futureDate.getFullYear();
    const hours = String(futureDate.getHours()).padStart(2, "0");
    const minutes = String(futureDate.getMinutes()).padStart(2, "0");
    const seconds = String(futureDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleConfirmation = async () => {
    if (!wallet || !address) {
      toast.error("Wallet not connected. Please try reconnecting.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = `cexplorer_${dateNumber}_${address}`;
      const hexPayload = Buffer.from(payload, "utf8").toString("hex");

      const message = await wallet.signData(hexPayload, address);

      const loginData = await loginUser({
        address,
        uq,
        signature: message.signature,
        key: message.key,
        version: 1,
        secure: secureRef.current,
        expiration: translateExpiration(expirationRef.current),
      });

      const token = loginData?.data.token;

      if (!token) {
        toast.error("Failed to get authorization token.");
        return;
      }

      setTokens({
        ...tokens,
        [address]: {
          token,
        },
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Wallet confirmation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to sign message",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      minWidth='400px'
      maxWidth='95%'
      onClose={closeAndDisconnect}
      className='border border-border'
    >
      <h2 className='mb-3 text-text-lg font-medium'>Authorization Token</h2>

      <div className='mb-2 rounded-m border border-border bg-cardBg p-1.5'>
        <p className='text-muted-foreground mb-1.5 text-text-sm'>
          We use a signature token to protect your privacy and keep your
          watchlist, custom names, and personal data secure.
        </p>
        <p className='text-muted-foreground text-text-sm'>
          If you cancel or remove the authorization token, we cannot connect
          your wallet.
        </p>
      </div>

      <div className='flex items-center gap-1'>
        <span className='text-text-sm'>Security level:</span>
        <Tooltip
          forceDirection='left'
          content={
            <p className='w-[150px]'>
              Strong security restricts token usage to your current IP address
              only.
            </p>
          }
        >
          <QuestionMarkCircledIcon className='text-muted-foreground h-3 w-3' />
        </Tooltip>
      </div>
      <RadioGroup
        onValueChange={value => {
          secureRef.current = parseInt(value) as 0 | 1;
        }}
        defaultValue='0'
        className='mt-1.5 flex gap-3'
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='0' id='0' />
          <Label htmlFor='0'>Normal</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='1' id='1' />
          <Label htmlFor='1'>Strong</Label>
        </div>
      </RadioGroup>

      <div className='mt-3 text-text-sm'>Token duration:</div>
      <RadioGroup
        onValueChange={value => {
          expirationRef.current = value as "d" | "w" | "m" | "y";
        }}
        defaultValue='d'
        className='mt-1.5 flex gap-2'
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='d' id='d' />
          <Label htmlFor='d'>Day</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='w' id='w' />
          <Label htmlFor='w'>Week</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='m' id='m' />
          <Label htmlFor='m'>Month</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='y' id='y' />
          <Label htmlFor='y'>Year</Label>
        </div>
      </RadioGroup>
      <div className='flex justify-end'>
        <Button
          className='mt-5 px-4'
          label={isLoading ? "Confirming..." : "Confirm"}
          size='md'
          onClick={handleConfirmation}
          variant='primary'
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};

export default WalletConfigModal;
