import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { Checkbox } from "@/components/ui/checkbox";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import { donationAddress, supportedPools } from "@/constants/confVariables";
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
import { toast } from "sonner";
import { RandomDelegationModal } from "@/components/wallet/RandomDelegationModal";
import { sendDelegationInfo } from "@/services/tool";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  title: string;
  description: string;
  placeholder: string;
}

export const DonatePage = () => {
  const { t } = useAppTranslation();
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
  const { wallet } = useWalletStore();
  const randomPool =
    supportedPools[Math.floor(Math.random() * supportedPools.length)];

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStake = () => {
    stakeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDonation = async () => {
    if (!wallet) {
      setShowWalletModal(true);
      return;
    }

    const amountToSend =
      activeDonation !== undefined && activeDonation > 0
        ? String(activeDonation * 1000000)
        : String(Number(customAmount) * 1000000);

    try {
      const { MeshTxBuilder, BlockfrostProvider } = await import(
        "@meshsdk/core"
      );

      const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;

      const provider = new BlockfrostProvider(apiKey);
      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();

      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        evaluator: provider,
      });

      txBuilder.txOut(donationAddress, [
        { unit: "lovelace", quantity: amountToSend },
      ]);

      const unsignedTx = await txBuilder
        .selectUtxosFrom(utxos)
        .changeAddress(changeAddress)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
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
    if (!wallet) {
      setShowWalletModal(true);
      return;
    }
    setOpenDelegationModal(true);
  };

  return (
    <PageBase
      metadataOverride={{ title: t("donatePage.metaTitle") }}
      title={t("donatePage.title")}
      subTitle={t("donatePage.subtitle")}
      breadcrumbItems={[{ label: t("donatePage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
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
              {t("donatePage.successModal.message")}
            </h3>
            <p className='mt-4'>
              {t("donatePage.successModal.transactionHash")}{" "}
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
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <section className='mt-6 flex flex-wrap gap-4'>
          <InfoCard
            icon={<Zap color={colors.darkBlue} />}
            heading={t("donatePage.infoCards.itn.heading")}
            description={t("donatePage.infoCards.itn.description")}
          />
          <InfoCard
            icon={<Users color={colors.darkBlue} />}
            heading={t("donatePage.infoCards.community.heading")}
            description={t("donatePage.infoCards.community.description")}
          />
          <InfoCard
            icon={<Wrench color={colors.darkBlue} />}
            heading={t("donatePage.infoCards.builders.heading")}
            description={t("donatePage.infoCards.builders.description")}
          />
        </section>
        <section className='mt-6 flex flex-wrap justify-center gap-4 border-b border-border pb-5'>
          <Button
            size='lg'
            label={t("donatePage.buttons.stakeWithCexplorer")}
            variant='tertiary'
            leftIcon={<CornerRightDown />}
            onClick={scrollToStake}
            className='max-w-[300px]'
          />
          <Button
            size='lg'
            label={t("donatePage.buttons.sendDonation")}
            variant='primary'
            leftIcon={<Wallet />}
            onClick={scrollToDonate}
            className='max-w-[300px]'
          />
        </section>
        <section ref={donateRef} className='border-b border-border py-8'>
          <h2>{t("donatePage.donateSection.title")}</h2>
          <div className='flex flex-wrap justify-between gap-2'>
            <div className='flex flex-col'>
              <p className='mt-2 font-regular text-grayTextPrimary'>
                {t("donatePage.donateSection.thankYou")}
              </p>
              <p className='mb-1 mt-2 text-text-sm font-medium'>
                {t("donatePage.donateSection.sendDonationHere")}
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
              <p className='text-text-sm font-medium'>{t("donatePage.donateSection.otherMethods")}</p>
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
            {t("donatePage.donateSection.useDappConnector")}
          </p>
          <div className='flex flex-wrap gap-2'>
            <DonateCard
              icon={<Coffee color={colors.darkBlue} />}
              amount={10}
              title={t("donatePage.donationCards.coffee.title")}
              description={t("donatePage.donationCards.coffee.description")}
              onClick={() => setActiveDonation(10)}
              isActive={activeDonation === 10}
            />
            <DonateCard
              icon={<GitCommitHorizontal color={colors.darkBlue} />}
              amount={50}
              title={t("donatePage.donationCards.commit.title")}
              description={t("donatePage.donationCards.commit.description")}
              onClick={() => setActiveDonation(50)}
              isActive={activeDonation === 50}
            />
            <DonateCard
              icon={<Bug color={colors.darkBlue} />}
              amount={100}
              title={t("donatePage.donationCards.bug.title")}
              description={t("donatePage.donationCards.bug.description")}
              onClick={() => setActiveDonation(100)}
              isActive={activeDonation === 100}
            />
            <DonateCard
              icon={<Code color={colors.darkBlue} />}
              amount={500}
              title={t("donatePage.donationCards.api.title")}
              description={t("donatePage.donationCards.api.description")}
              onClick={() => setActiveDonation(500)}
              isActive={activeDonation === 500}
            />
            <CustomDonateCard
              amount={customAmount}
              setAmount={setCustomAmount}
              isActive={activeDonation === 0}
              onClick={() => setActiveDonation(0)}
              title={t("donatePage.donationCards.custom.title")}
              description={t("donatePage.donationCards.custom.description")}
              placeholder={t("donatePage.donationCards.custom.placeholder")}
            />
          </div>
          <div className='flex w-full justify-center'>
            <Button
              size='lg'
              label={t("donatePage.buttons.donate")}
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
            <img
              className='hidden h-[206px] w-[160px] shrink md:block'
              src={CexLogo}
            />
            <div className='flex flex-col gap-1.5'>
              <h2>{t("donatePage.stakeSection.title")}</h2>
              <p className='max-w-[350px] font-regular text-grayTextPrimary'>
                {t("donatePage.stakeSection.description1")}
              </p>
              <p className='max-w-[350px] font-regular text-grayTextPrimary'>
                {t("donatePage.stakeSection.description2")}
              </p>
              <Link
                to='/pool/$id'
                params={{ id: randomPool }}
                className='my-2 flex items-center text-text-sm font-medium text-grayTextPrimary'
              >
                {t("donatePage.stakeSection.poolPerformance")} <ArrowRight />
              </Link>
            </div>
          </div>
          <div className='flex flex-col'>
            <p className='text-text-xs'>{t("donatePage.stakeSection.delegateViaDapp")}</p>
            <Button
              size='lg'
              label={t("donatePage.buttons.delegateToPools")}
              variant='primary'
              leftIcon={<Wallet />}
              onClick={handleDelegation}
            />
            <p className='mt-4 text-text-xs'>
              {" "}
              {t("donatePage.stakeSection.poolIdLabel")}
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
      </section>
    </PageBase>
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
  title,
  description,
  placeholder,
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
        placeholder={placeholder}
      />
      <p className='font-medium'>{title}</p>
      <p className='mt-1.5 text-left text-text-sm text-grayTextPrimary'>
        {description}
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
