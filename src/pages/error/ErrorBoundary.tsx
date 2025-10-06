import type { ReactNode } from "react";

import Button from "@/components/global/Button";
import Copy from "@/components/global/Copy";
import { Component } from "react";

import DiscordLogo from "../../resources/images/icons/discordSecondary.svg";
import { ArrowLeft, CircleAlert } from "lucide-react";

import { useThemeStore } from "@/stores/themeStore";
import { SafeNavbar } from "@/components/layouts/safe/SafeNavbar";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <DefaultErrorPage error={this.state.error} />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorPage = ({ error }: { error: Error | null }) => {
  const { theme } = useThemeStore();

  return (
    <>
      <SafeNavbar />
      <section className='flex min-h-minHeight w-full flex-col items-center gap-6 px-2 py-5'>
        <div className='flex w-full flex-col items-center gap-3'>
          <div className='flex h-[56px] w-[56px] items-center justify-center rounded-l border border-border'>
            <CircleAlert size={26} />
          </div>
          <h1 className='text-center text-4xl md:text-start'>
            Something went wrong...
          </h1>
          <p className='text-center text-2xl text-grayTextPrimary md:text-start'>
            Well, this is awkward. The page didn’t load, help us by reporting
            the problem.
          </p>
        </div>
        <div className='flex w-full max-w-[880px] flex-col gap-2 rounded-xl border border-border p-3'>
          <h3>Error mesage</h3>
          <div className='border border-border'></div>
          <div
            className={`rounded-lg border p-2 text-sm font-medium ${theme === "light" ? "border-[#FDA29B] bg-[#FFFBFA]" : "border-[#F97066] bg-[#FEE4E2] text-black"}`}
          >
            {error?.message}
          </div>
          <div className='flex items-center gap-2 rounded-m border border-cardBg bg-darker px-3 py-2'>
            <div className='flex min-h-[32px] min-w-[32px] items-center justify-center gap-2 rounded-[6px] border border-border bg-cardBg'>
              <CircleAlert size={14} className='text-primary' />
            </div>
            <span className='text-sm text-grayTextPrimary'>
              If something isn’t working as expected, please copy your current
              status details and reach out to us on{" "}
              <a
                href='https://x.com/cexplorer_io'
                target='_blank'
                className='text-primary underline underline-offset-2'
              >
                Twitter
              </a>{" "}
              or{" "}
              <a
                href='https://discord.com/invite/zTaSd8wfEV'
                target='_blank'
                className='text-primary underline underline-offset-2'
              >
                Discord
              </a>
              . We're here to help!
            </span>
          </div>
          <div className='flex w-full justify-end'>
            <Copy
              copyText={`${window.location.href}, ${error?.message}`}
              showText='Copy status'
            />
          </div>
        </div>
        <div className='flex w-full max-w-[880px] items-center justify-between gap-1.5 md:justify-center'>
          <Button
            size='md'
            label='Go back'
            variant='tertiary'
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => window.history.back()}
          />
          <Button
            size='md'
            label='Report on Discord'
            variant='discord'
            leftIcon={<img src={DiscordLogo} alt='X' height={15} width={15} />}
            onClick={() =>
              window.open("https://discord.com/invite/zTaSd8wfEV", "_blank")
            }
          />
        </div>
      </section>
    </>
  );
};
