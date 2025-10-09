import { donationAddress } from "@/constants/confVariables";
import { footerLinks } from "@/constants/footerLinks";
import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import DiscordLogo from "../../resources/images/icons/discord.svg";
import GithubLogo from "../../resources/images/icons/github.svg";
import TelegramLogo from "../../resources/images/icons/telegram.svg";
import TwitterLogo from "../../resources/images/icons/twitter.svg";
import { CoinPaprikaPartner } from "../../resources/images/partners/CoinPaprikaPartner";
import { NufiPartner } from "../../resources/images/partners/NufiPartner";
import YoroiPartner from "../../resources/images/partners/YoroiPartner.svg";
import LinksColumn from "../footer/LinksColumn";
import Copy from "../global/Copy";
import MainLogo from "../global/MainLogo";

const Footer = () => {
  return (
    <footer className='flex w-full flex-col items-center border-t border-borderFaded'>
      <div className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col p-mobile md:px-desktop md:py-mobile'>
          <section className='flex w-full flex-col gap-2 py-4 md:flex-row md:justify-between'>
            <div className='flex w-[250px] shrink-0 flex-col gap-3'>
              <MainLogo className='-translate-x-[5px]' />
              <p className='w-full text-text-sm text-grayTextPrimary'>
                The oldest and most feature-rich Cardano explorer, serving you
                since the Incentivized Testnet.
              </p>
              <div className='flex gap-3'>
                <a href='https://x.com/cexplorer_io' target='_blank'>
                  <img src={TwitterLogo} alt='Twitter' width={30} />
                </a>
                <a href='https://discord.gg/PGCmmQC3dj ' target='_blank'>
                  <img src={DiscordLogo} alt='Discord' width={30} />
                </a>
                <a href='https://t.me/cexplorer' target='_blank'>
                  <img src={TelegramLogo} alt='Telegram' width={30} />
                </a>
                <img src={GithubLogo} alt='Github' width={30} />
              </div>
            </div>
            <div className='mt-3 flex w-full justify-start gap-[10%] md:mt-0 md:justify-end'>
              <LinksColumn header='Company' links={footerLinks.company} />
              <LinksColumn header='Information' links={footerLinks.resources} />
              <LinksColumn header='Support us' links={footerLinks.supportUs} />
            </div>
          </section>
        </div>
      </div>
      <section className='flex w-full flex-col items-center bg-darker'>
        <div className='flex h-auto w-full max-w-desktop items-center justify-between gap-3 p-mobile py-2 md:h-[60px] md:px-desktop md:py-mobile'>
          <span className='md:text-sm text-text-sm text-grayTextPrimary'>
            Copyright © 2019-{new Date().getFullYear()} Cexplorer. All rights
            reserved.
          </span>
          <span className='md:text-sm flex items-center text-text-sm text-grayTextPrimary'>
            Donations:{" "}
            <Link to='/donate' className='ml-1/2 text-primary underline'>
              {formatString(donationAddress, "short")}
            </Link>{" "}
            <Copy copyText={donationAddress} className='mx-1/2' />
            ❤️
          </span>
        </div>
        <div className='flex h-auto w-full max-w-desktop items-center gap-2 p-mobile py-2 md:px-desktop md:py-mobile'>
          <span className='md:text-sm text-text-xs text-grayTextPrimary'>
            Partners:{" "}
          </span>
          <div className='flex w-full flex-wrap items-center justify-around gap-1'>
            <a
              href='https://yoroi-wallet.com/'
              target='_blank'
              rel='noopener nofollow'
            >
              <img src={YoroiPartner} className='rounded-s bg-[#1B67CC] p-1' />
            </a>
            <a href='https://nu.fi/' target='_blank' rel='noopener nofollow'>
              <NufiPartner />
            </a>
            <a
              href='https://coinpaprika.com/'
              target='_blank'
              rel='noopener nofollow'
              className='h-fit'
            >
              <CoinPaprikaPartner />
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
