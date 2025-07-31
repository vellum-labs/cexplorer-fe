import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { loginUser } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletConfigModalState } from "@/stores/states/walletConfigModalState";
import { useUqStore } from "@/stores/uqStore";
import { useWalletStore } from "@/stores/walletStore";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useRef } from "react";
import Button from "../global/Button";
import Modal from "../global/Modal";
import { Tooltip } from "../ui/tooltip";

const date = new Date();
const month = date.toLocaleDateString("en-US", { month: "2-digit" });
const year = date.toLocaleDateString("en-US", { year: "2-digit" });
const dateNumber = month + year;

const WalletConfigModal = () => {
  const { isOpen, setIsOpen } = useWalletConfigModalState();
  const { uq } = useUqStore();
  const secureRef = useRef<0 | 1>(0);
  const expirationRef = useRef<"d" | "w" | "m" | "y">("m");
  const { address, job } = useWalletStore();
  const { tokens, setTokens } = useAuthTokensStore();
  const { disconnect } = useConnectWallet();

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
    const params = await job?.sign(`cexplorer_${dateNumber}_${address}`);
    const loginData = await loginUser({
      address,
      uq,
      signature: params?.signature || "",
      key: params?.key || "",
      version: 1,
      secure: secureRef.current,
      expiration: translateExpiration(expirationRef.current),
    });

    const token = loginData?.data.token;

    if (!token || !address) return;

    setTokens({
      ...tokens,
      [address]: {
        token,
      },
    });

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      minHeight='400px'
      minWidth='400px'
      maxWidth='95%'
      onClose={closeAndDisconnect}
    >
      <p className='mb-5 pr-7'>Please generate a new authorization token:</p>
      <div className='flex items-center gap-2'>
        Select the security of your login session:{" "}
        <Tooltip
          forceDirection='left'
          content={
            <p className='w-[150px]'>
              Choosing the strong option will disable anyone with different IP
              address to use your token.
            </p>
          }
        >
          <QuestionMarkCircledIcon />
        </Tooltip>
      </div>
      <RadioGroup
        onValueChange={value => {
          secureRef.current = parseInt(value) as 0 | 1;
        }}
        defaultValue='0'
        className='mt-2 flex'
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

      <div className='mt-5'>Please select the longevity of your token:</div>
      <RadioGroup
        onValueChange={value => {
          expirationRef.current = value as "d" | "w" | "m" | "y";
        }}
        defaultValue='m'
        className='mt-2 flex'
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
      <Button
        className='mt-10'
        label='Confirm'
        size='md'
        onClick={handleConfirmation}
        variant='primary'
      />
    </Modal>
  );
};

export default WalletConfigModal;
