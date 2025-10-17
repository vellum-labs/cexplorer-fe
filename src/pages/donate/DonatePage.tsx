import { Button } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import Modal from "@/components/global/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import {
  donationAddress,
  supportedPools,
  webUrl,
} from "@/constants/confVariables";
import CexLogo from "@/resources/images/cexLogo.svg";
import Patreon from "@/resources/images/patreon.svg";
import Paypal from "@/resources/images/paypal.svg";
import BuyMeACoffee from "@/resources/images/buymeacoffee.svg";
import { useWalletStore } from "@/stores/walletStore";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bug,
  Code,
  Coffee,
  CornerRightDown,
  GitCommitHorizontal,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import metadata from "../../../conf/metadata/en-metadata.json";
import { RandomDelegationModal } from "@/components/wallet/RandomDelegationModal";
import { sendDelegationInfo } from "@/services/tool";

interface InfoCardProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

interface DonateCardProps {
  amount: number | undefined;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface CustomDonateCardProps {
  amount: string;
  setAmount: (amount: string) => void;
  isActive?: boolean;
  onClick?: () => void;
}

export const DonatePage = () => {
  const donateRef = useRef<HTMLDivElement>(null);
  const stakeRef = useRef<HTMLDivElement>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [activeDonation, setActiveDonation] = useState<number | undefined>(
    undefined,
  );
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [openDelegationModal, setOpenDelegationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hash, setHash] = useState<string | undefined>("");
  const { walletApi, lucid } = useWalletStore();
  const randomPool =
    supportedPools[Math.floor(Math.random() * supportedPools.length)];

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStake = () => {
    stakeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDonation = async () => {
    if (!walletApi || !lucid) {
      setShowWalletModal(true);
      return;
    }

    const amountToSend = BigInt(
      activeDonation
        ? activeDonation * 1000000
        : Number(customAmount) * 1000000,
    );

    try {
      const tx = await lucid
        .newTx()
        .pay.ToAddress(donationAddress, {
          lovelace: amountToSend,
        })
        .complete();

      const signed = await tx.sign.withWallet();
      const signedTx = await signed.complete();
      const txHash = await signedTx.submit();
      sendDelegationInfo(txHash, "donation_page", "donate");
      setHash(txHash);
      setShowSuccessModal(true);
    } catch (error: any) {
      if (String(error).includes("read-only")) return;

      const errMessage =
        error.message !== undefined
          ? error.message
          : "User refused to sign the transaction.";
      toast.error("Transaction failed: " + errMessage);
    }
  };

  const handleDelegation = () => {
    if (!walletApi) {
      setShowWalletModal(true);
      return;
    }
    setOpenDelegationModal(true);
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.donatePage.title}</title>}
        <meta name='description' content={metadata.donatePage.description} />
        <meta name='keywords' content={metadata.donatePage.keywords} />
        <meta property='og:title' content={metadata.donatePage.title} />
        <meta
          property='og:description'
          content={metadata.donatePage.description}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {openDelegationModal && (
        <RandomDelegationModal onClose={() => setOpenDelegationModal(false)} />
      )}
      {showSuccessModal && (
        <Modal
          minWidth='400px'
          maxWidth='95%'
          onClose={() => setShowSuccessModal(false)}
        >
          <div className='mt-2 flex h-full w-full flex-col items-center overflow-hidden p-1.5'>
            <h3>
              Transaction successful, thank you so much for supporting
              Cexplorer.io ❤️
            </h3>
            <p className='mt-4'>
              Transaction Hash:{" "}
              <Link
                to='/tx/$hash'
                params={{ hash: hash ?? "" }}
                className='break-all text-primary'
              >
                {hash}
              </Link>
            </p>
          </div>
        </Modal>
      )}
      <div className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <p className='mt-4 text-text-sm font-semibold text-primary'>Donation</p>
        <h1 className='mb-2'>Fuel the Future of Cexplorer</h1>
        <p className='font-regular text-grayTextPrimary'>
          Your support helps us operate, maintain and improve everything on
          Cexplorer.io
        </p>
        <div className='flex w-full max-w-desktop flex-col'>
          <section className='mt-6 flex flex-wrap gap-4'>
            <InfoCard
              icon={<Zap color={colors.darkBlue} />}
              heading='Here for Cardano since ITN'
              description='We’ve been the oldest and most featured Cardano explorer since the Incentivized Testnet, providing essential tools for navigating the blockchain.'
            />
            <InfoCard
              icon={<Users color={colors.darkBlue} />}
              heading='From community for community'
              description='Created by Cardano enthusiasts, our independent tool supports all users with staking, decision-making, and education. We aim to maximize your profit and protect you from bad practices.'
            />
            <InfoCard
              icon={<Wrench color={colors.darkBlue} />}
              heading='Utilized by Cardano builders'
              description='Many builders rely on our tools to develop on Cardano. Supporting us helps maintain and enhance these resources, benefiting the entire development community.'
            />
          </section>
          <section className='mt-6 flex flex-wrap justify-center gap-4 border-b border-border pb-5'>
            <Button
              size='lg'
              label='Stake with Cexplorer'
              variant='tertiary'
              leftIcon={<CornerRightDown />}
              onClick={scrollToStake}
              className='max-w-[300px]'
            />
            <Button
              size='lg'
              label='Send a donation'
              variant='primary'
              leftIcon={<Wallet />}
              onClick={scrollToDonate}
              className='max-w-[300px]'
            />
          </section>
          <section ref={donateRef} className='border-b border-border py-8'>
            <h2>Donate</h2>
            <div className='flex flex-wrap justify-between gap-2'>
              <div className='flex flex-col'>
                <p className='mt-2 font-regular text-grayTextPrimary'>
                  Thank you for supporting the development of independent
                  Cardano explorer! ❤️
                </p>
                <p className='mb-1 mt-2 text-text-sm font-medium'>
                  Send your donation here
                </p>
                <div className='relative flex w-full max-w-[390px] items-center'>
                  <input
                    readOnly
                    value={donationAddress}
                    className='w-full max-w-[390px] rounded-m border border-border bg-background p-1.5 text-text-sm text-text'
                  />
                  <Copy
                    copyText={donationAddress}
                    className='absolute right-3 bg-background outline outline-4 outline-background'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-text-sm font-medium'>
                  Other donation methods
                </p>
                <div className='flex flex-wrap gap-2'>
                  <a
                    href='https://www.paypal.com/donate?business=billing@vellumlabs.cz&item_name=Cexplorer.io+-+maintenance,+development,+servers&currency_code=USD'
                    target='_blank'
                    className='flex items-center gap-1/2 font-medium text-grayTextPrimary'
                  >
                    <img src={Paypal} />
                    PayPal
                  </a>
                  <a
                    href='https://www.patreon.com/ADApools'
                    target='_blank'
                    className='flex items-center gap-1/2 font-medium text-grayTextPrimary'
                  >
                    <img src={Patreon} />
                    Patreon
                  </a>
                  <a
                    href='https://buymeacoffee.com/vellumlabs'
                    target='_blank'
                    className='flex items-center gap-1/2 font-medium text-grayTextPrimary'
                  >
                    <div className='flex h-6 w-6 items-center justify-center rounded-max bg-gray-300 dark:bg-gray-600'>
                      <img src={BuyMeACoffee} className='h-4 w-4' />
                    </div>
                    Buy Me a Coffee
                  </a>
                </div>
              </div>
            </div>
            <p className='mb-1 mt-5 text-text-sm font-medium'>
              Or use our dApp connector
            </p>
            <div className='flex flex-wrap gap-2'>
              <DonateCard
                icon={<Coffee color={colors.darkBlue} />}
                amount={10}
                title='Coffee For Devs'
                description='Fueling the minds behind the code.'
                onClick={() => setActiveDonation(10)}
                isActive={activeDonation === 10}
              />
              <DonateCard
                icon={<GitCommitHorizontal color={colors.darkBlue} />}
                amount={50}
                title='Code Commit'
                description='Helping push new features and fixes.'
                onClick={() => setActiveDonation(50)}
                isActive={activeDonation === 50}
              />
              <DonateCard
                icon={<Bug color={colors.darkBlue} />}
                amount={100}
                title='Bug Squasher'
                description='Cleaning up code and fixing bugs.'
                onClick={() => setActiveDonation(100)}
                isActive={activeDonation === 100}
              />
              <DonateCard
                icon={<Code color={colors.darkBlue} />}
                amount={500}
                title='API-ncredible Support'
                description='Tools for powerful integrations.'
                onClick={() => setActiveDonation(500)}
                isActive={activeDonation === 500}
              />
              <CustomDonateCard
                amount={customAmount}
                setAmount={setCustomAmount}
                isActive={activeDonation === 0}
                onClick={() => setActiveDonation(0)}
              />
            </div>
            <div className='flex w-full justify-center'>
              <Button
                size='lg'
                label='Donate'
                variant='primary'
                leftIcon={<Wallet />}
                className='mt-4'
                onClick={handleDonation}
                disabled={!activeDonation && customAmount === ""}
              />
            </div>
          </section>
          <section
            ref={stakeRef}
            className='mt-8 flex w-full flex-wrap justify-between rounded-l bg-cardBg px-4 py-5'
          >
            <div className='flex basis-[550px] gap-4'>
              <img className='hidden shrink md:block' src={CexLogo} />
              <div className='flex flex-col gap-1.5'>
                <h2>Stake with Cexplorer.io</h2>
                <p className='max-w-[350px] font-regular text-grayTextPrimary'>
                  Support Cexplorer and earn staking rewards by delegating your
                  ADA to our pool.
                </p>
                <p className='max-w-[350px] font-regular text-grayTextPrimary'>
                  Enjoy top-tier infrastructure and a win-win for both you and
                  us!
                </p>
                <Link
                  to='/pool/$id'
                  params={{ id: randomPool }}
                  className='my-2 flex items-center text-text-sm font-medium text-grayTextPrimary'
                >
                  Our stake pool performance <ArrowRight />
                </Link>
              </div>
            </div>
            <div className='flex flex-col'>
              <p className='text-text-xs'>Delegate via dApp</p>
              <Button
                size='lg'
                label='Delegate to [POOLS]'
                variant='primary'
                leftIcon={<Wallet />}
                onClick={handleDelegation}
              />
              <p className='mt-4 text-text-xs'>
                {" "}
                Pool ID for delegation via wallet
              </p>
              <div className='relative flex w-full max-w-[430px] items-center'>
                <input
                  readOnly
                  value={randomPool}
                  className='w-full max-w-[430px] rounded-m border border-border bg-background p-1.5 text-text-sm text-text'
                />
                <Copy
                  copyText={randomPool}
                  className='absolute right-3 bg-background outline outline-4 outline-background'
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const InfoCard = ({ icon, heading, description }: InfoCardProps) => {
  return (
    <section className='flex grow basis-[350px] flex-col'>
      <div className='flex items-center gap-1.5'>
        <div
          className='relative z-20 flex h-9 w-9 items-center justify-center rounded-max p-1/2 outline outline-[6px]'
          style={{
            backgroundColor: "rgba(219, 234, 254, 0.9)",
            outlineColor: "rgba(191, 219, 254, 0.5)",
          }}
        >
          {icon}
        </div>
        <h3>{heading}</h3>{" "}
      </div>
      <p className='pl-6 text-text-sm text-grayTextPrimary'>{description}</p>
    </section>
  );
};

const CustomDonateCard = ({
  amount,
  setAmount,
  isActive,
  onClick,
}: CustomDonateCardProps) => {
  const handleAmountChange = (value: string) => {
    if (value === "") setAmount(value);
    if (!/^\d+$/.test(value)) return;
    setAmount(value);
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex grow basis-[250px] cursor-pointer flex-col items-start gap-1 rounded-l border p-1.5 ${isActive ? "outline outline-2 outline-primary" : "border-border"}`}
    >
      <Checkbox className='absolute right-3 top-3' checked={isActive} />
      <div className='flex w-full justify-between'>
        <div
          className='relative z-20 flex h-9 w-9 items-center justify-center rounded-max p-1/2 outline outline-[6px]'
          style={{
            backgroundColor: "rgba(219, 234, 254, 0.9)",
            outlineColor: "rgba(191, 219, 254, 0.5)",
          }}
        >
          <Zap color={colors.darkBlue} />
        </div>
      </div>
      <TextInput
        inputClassName='h-10 my-1 w-full'
        wrapperClassName='w-full max-w-[300px]'
        value={amount}
        onchange={value => handleAmountChange(value)}
        placeholder='Choose the amount'
      />
      <p className='font-medium'>dApp Your Way</p>
      <p className='mt-1.5 text-left text-text-sm text-grayTextPrimary'>
        Empowering developers with the freedom to innovate.
      </p>
    </div>
  );
};

const DonateCard = ({
  amount,
  title,
  description,
  icon,
  onClick,
  isActive,
}: DonateCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex grow basis-[250px] cursor-pointer flex-col items-start gap-1 rounded-l border p-1.5 ${isActive ? "outline outline-2 outline-primary" : "border-border"}`}
    >
      <Checkbox className='absolute right-3 top-3' checked={isActive} />
      <div className='flex w-full justify-between'>
        <div
          className='relative z-20 flex h-9 w-9 items-center justify-center rounded-max p-1/2 outline outline-[6px]'
          style={{
            backgroundColor: "rgba(219, 234, 254, 0.9)",
            outlineColor: "rgba(191, 219, 254, 0.5)",
          }}
        >
          {icon}
        </div>
      </div>
      {amount ? (
        <h2 className='my-1.5 text-primary'>{amount} ADA</h2>
      ) : (
        <TextInput
          inputClassName='h-10 my-1 w-full'
          wrapperClassName='w-full max-w-[300px]'
          value=''
          onchange={() => {}}
          placeholder='Choose the amount'
        />
      )}
      <p className='font-medium'>{title}</p>
      <p className='mt-1.5 text-left text-text-sm text-grayTextPrimary'>
        {description}
      </p>
    </div>
  );
};
