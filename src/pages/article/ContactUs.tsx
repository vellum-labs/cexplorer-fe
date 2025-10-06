import Button from "@/components/global/Button";
import { colors } from "@/constants/colors";
import { webUrl } from "@/constants/confVariables";
import { Twitter } from "@/resources/images/icons/Twitter";
import { useFetchArticleDetail } from "@/services/article";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Heart, Mail, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

interface InfoCardProps {
  icon: ReactNode;
  heading: string;
  description: string;
  button: ReactNode;
}

export const ContactUsPage = () => {
  const [isCopied, setIsCopied] = useState(false);
  const query = useFetchArticleDetail("en", "page", "contact-us");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;
  const email = "hello@cexplorer.io";

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name} | Cexplorer.io</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <section className='wrapper border-b border-border pb-8'>
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-base text-primary'>Contact us</h2>
            <h1 className='text-3xl'>Get in touch</h1>
          </div>
          <div className='contributors__item'>
            <div className='contributors__item--title'>
              <h3>Support Our Work</h3>
              <span className='description contributors__item--description'>
                Consider donating or staking with our stake pool to support
                ongoing development and maintenance.
              </span>
            </div>
            <div className='contributors__item--btn'>
              <Link to='/donate' className='btn btn--primary'>
                Donate
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-arrow-right'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </Link>
            </div>
          </div>
          <div className='contributors__item'>
            <div className='contributors__item--title'>
              <span className='flex items-center gap-1'>
                <Twitter size={24} />
                <h3>X (former Twitter)</h3>
              </span>
              <span className='description contributors__item--description'>
                Stay in touch with latest updates around Cexplorer and Cardano.
              </span>
            </div>
            <div className='contributors__item--btn'>
              <a
                href='https://x.com/cexplorer_io'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='btn btn--primary'
              >
                Join
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-arrow-right'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </a>
            </div>
          </div>
          <div className='contributors__item'>
            <div className='contributors__item--title'>
              <span className='flex items-center gap-1'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9.88806 10.0679C9.20406 10.0679 8.66406 10.6679 8.66406 11.3999C8.66406 12.1319 9.21606 12.7319 9.88806 12.7319C10.5721 12.7319 11.1121 12.1319 11.1121 11.3999C11.1241 10.6679 10.5721 10.0679 9.88806 10.0679ZM14.2681 10.0679C13.5841 10.0679 13.0441 10.6679 13.0441 11.3999C13.0441 12.1319 13.5961 12.7319 14.2681 12.7319C14.9521 12.7319 15.4921 12.1319 15.4921 11.3999C15.4921 10.6679 14.9521 10.0679 14.2681 10.0679Z'
                    fill={colors.text}
                  />
                  <path
                    d='M20.1001 0H4.02006C2.66406 0 1.56006 1.104 1.56006 2.472V18.696C1.56006 20.064 2.66406 21.168 4.02006 21.168H17.6281L16.9921 18.948L18.5281 20.376L19.9801 21.72L22.5601 24V2.472C22.5601 1.104 21.4561 0 20.1001 0ZM15.4681 15.672C15.4681 15.672 15.0361 15.156 14.6761 14.7C16.2481 14.256 16.8481 13.272 16.8481 13.272C16.3561 13.596 15.8881 13.824 15.4681 13.98C14.8681 14.232 14.2921 14.4 13.7281 14.496C12.5761 14.712 11.5201 14.652 10.6201 14.484C9.93606 14.352 9.34806 14.16 8.85606 13.968C8.58006 13.86 8.28006 13.728 7.98006 13.56C7.94406 13.536 7.90806 13.524 7.87206 13.5C7.84806 13.488 7.83606 13.476 7.82406 13.464C7.60806 13.344 7.48806 13.26 7.48806 13.26C7.48806 13.26 8.06406 14.22 9.58806 14.676C9.22806 15.132 8.78406 15.672 8.78406 15.672C6.13206 15.588 5.12406 13.848 5.12406 13.848C5.12406 9.984 6.85206 6.852 6.85206 6.852C8.58006 5.556 10.2241 5.592 10.2241 5.592L10.3441 5.736C8.18406 6.36 7.18806 7.308 7.18806 7.308C7.18806 7.308 7.45206 7.164 7.89606 6.96C9.18006 6.396 10.2001 6.24 10.6201 6.204C10.6921 6.192 10.7521 6.18 10.8241 6.18C11.5561 6.084 12.3841 6.06 13.2481 6.156C14.3881 6.288 15.6121 6.624 16.8601 7.308C16.8601 7.308 15.9121 6.408 13.8721 5.784L14.0401 5.592C14.0401 5.592 15.6841 5.556 17.4121 6.852C17.4121 6.852 19.1401 9.984 19.1401 13.848C19.1401 13.848 18.1201 15.588 15.4681 15.672Z'
                    fill={colors.text}
                  />
                </svg>
                <h3>Discord</h3>
              </span>
              <span className='description contributors__item--description'>
                Join the conversation, or raise a support ticker - we’re here
                for you.
              </span>
            </div>
            <div className='contributors__item--btn'>
              <a
                href='https://discord.gg/PGCmmQC3dj'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='btn btn--primary'
              >
                Join
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-arrow-right'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </a>
            </div>
          </div>
          <div className='contributors__item'>
            <div className='contributors__item--title'>
              <span className='flex items-center gap-1'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clip-path='url(#clip0_4140_12472)'>
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2628 9.3444 8.93014 10.3492 5.43189 11.8733C4.86383 12.0992 4.56626 12.3202 4.53917 12.5363C4.49339 12.9015 4.95071 13.0453 5.57348 13.2411C5.65819 13.2678 5.74596 13.2954 5.83594 13.3246C6.44864 13.5238 7.27283 13.7568 7.70129 13.766C8.08994 13.7744 8.52373 13.6142 9.00264 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.139 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.376 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5033 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78391 14.6448 10.8036 15.3168C11.2936 15.6397 11.6857 15.9067 12.0769 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2077 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8307 18.0694 15.3826 18.0186C15.7032 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6631 17.3816 10.0585 17.5622 8.16097C17.578 7.99473 17.5581 7.78197 17.5422 7.68857C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0056 7.22234 16.9064 7.22408C16.455 7.23203 15.7626 7.47282 12.43 8.85893Z'
                      fill={colors.text}
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_4140_12472'>
                      <rect width='24' height='24' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
                <h3>Telegram</h3>
              </span>
              <span className='description contributors__item--description'>
                Join the Cexplorer community on our Telegram.
              </span>
            </div>
            <div className='contributors__item--btn'>
              <a
                href='https://t.me/cexplorer'
                target='_blank'
                rel='noreferrer noopener nofollow'
                className='btn btn--primary'
              >
                Join
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-arrow-right'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </a>
            </div>
          </div>
          <div className='contributors__item'>
            <div className='contributors__item--title'>
              <span className='flex items-center gap-1'>
                <Mail size={24} />
                <h3>E-mail</h3>
              </span>
              <span className='description contributors__item--description'>
                Reach out to us with business or custom API inquires.
              </span>
            </div>
            <div className='contributors__item--btn'>
              <button
                className='btn btn--secondary'
                onClick={() => {
                  setIsCopied(true);
                  navigator.clipboard.writeText(email);
                }}
              >
                {email}
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </section>
        <section className='flex max-w-[800px] flex-wrap gap-2 pt-8'>
          <InfoCard
            icon={<Zap size={18} color={colors.darkBlue} />}
            heading='Request a feature'
            description='Let us know, what you’re like to see on Cexplorer next!'
            button={
              <Button
                size='md'
                variant='tertiary'
                href='/'
                label='Request a feature'
                rightIcon={<ArrowRight size={16} />}
                className='ml-auto mt-auto'
              />
            }
          />
          <InfoCard
            icon={<Heart size={18} color={colors.darkBlue} />}
            heading='Donate'
            description='Support our mission and keep the Cexplorer rolling'
            button={
              <Button
                size='md'
                variant='tertiary'
                href='/donate'
                label='Donate page'
                rightIcon={<ArrowRight size={16} />}
                className='ml-auto mt-auto'
              />
            }
          />
        </section>
      </main>
    </>
  );
};

const InfoCard = ({ icon, heading, description, button }: InfoCardProps) => {
  return (
    <section className='flex grow basis-[350px] flex-col rounded-xl border border-border p-2'>
      <div className='flex items-center gap-1.5'>
        <div className='relative z-20 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/90 p-1/2 outline outline-[6px] outline-blue-100/50'>
          {icon}
        </div>
        <h3>{heading}</h3>{" "}
      </div>
      <p className='pl-[45px] text-sm text-grayTextPrimary'>{description}</p>
      {button}
    </section>
  );
};
