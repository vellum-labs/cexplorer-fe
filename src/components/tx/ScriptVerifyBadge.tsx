import { useState, type FC } from "react";
import { ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { fetchUplcScript, type UplcScriptResponse } from "@/services/uplc";
import { useAppTranslation } from "@/hooks/useAppTranslation";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "verified"; data: UplcScriptResponse }
  | { kind: "unknown" };

interface ScriptVerifyBadgeProps {
  scriptHash: string;
}

export const ScriptVerifyBadge: FC<ScriptVerifyBadgeProps> = ({
  scriptHash,
}) => {
  const { t } = useAppTranslation("common");
  const [state, setState] = useState<State>({ kind: "idle" });

  const handleVerify = async () => {
    setState({ kind: "loading" });
    try {
      const data = await fetchUplcScript(scriptHash);
      if (data && data.status === "VERIFIED") {
        setState({ kind: "verified", data });
      } else {
        setState({ kind: "unknown" });
      }
    } catch {
      setState({ kind: "unknown" });
    }
  };

  if (state.kind === "idle") {
    return (
      <button
        onClick={handleVerify}
        className='flex h-[25px] cursor-pointer items-center gap-1 rounded-max border border-border px-1 text-text-xs font-medium hover:bg-secondaryBg'
      >
        {t("tx.verifySource")}
      </button>
    );
  }

  if (state.kind === "loading") {
    return (
      <span className='flex h-[25px] w-fit items-center gap-1 rounded-max border border-border px-1 text-text-xs font-medium'>
        <PulseDot />
        {t("tx.verifySource")}...
      </span>
    );
  }

  if (state.kind === "unknown") {
    return (
      <span className='flex h-[25px] items-center gap-1 rounded-max border border-border px-1 text-text-xs font-medium'>
        <PulseDot color='#E67E22' animate={false} />
        <span style={{ color: "#E67E22" }}>{t("tx.sourceUnknown")}</span>
      </span>
    );
  }

  const { data } = state;
  const script = data.scripts?.[0];
  const compilerLabel = data.compilerType
    ? `${data.compilerType} ${data.compilerVersion}`
    : data.compilerVersion;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className='flex h-[25px] cursor-pointer items-center gap-1 rounded-max border border-border px-1 text-text-xs font-medium'>
          <PulseDot color='bg-greenText' animate={false} />
          <span className='text-greenText'>{t("tx.sourceVerified")}</span>
          {" "}- {compilerLabel}
          <ChevronDown size={12} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className='z-50 w-80 rounded-m border border-border bg-cardBg p-3 text-text-xs shadow-md'
          sideOffset={5}
          align='start'
        >
          <div className='flex flex-col gap-1.5'>
            {data.compilerType && (
              <Row label={t("tx.compiler")} value={compilerLabel} />
            )}
            {script?.plutusVersion && (
              <Row label={t("tx.plutusVersion")} value={script.plutusVersion} />
            )}
            {script?.moduleName && (
              <Row label={t("tx.module")} value={script.moduleName} />
            )}
            {script?.purposes?.length > 0 && (
              <Row
                label={t("tx.purposes")}
                value={script.purposes.join(", ")}
              />
            )}
            {script?.parameterizationStatus && (
              <Row
                label={t("tx.parametrization")}
                value={script.parameterizationStatus}
              />
            )}
            {data.commitHash && (
              <Row
                label={t("tx.commit")}
                value={
                  data.sourceUrl ? (
                    <a
                      href={`${data.sourceUrl}/commit/${data.commitHash}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary'
                    >
                      {data.commitHash.slice(0, 7)}
                    </a>
                  ) : (
                    data.commitHash.slice(0, 7)
                  )
                }
              />
            )}
            {data.sourceUrl && (
              <Row
                label={t("tx.repository")}
                value={
                  <a
                    href={data.sourceUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='truncate text-primary'
                  >
                    {data.sourceUrl.replace("https://github.com/", "")}
                  </a>
                }
              />
            )}
            <div className='mt-1 border-t border-border pt-1 text-text-2xs text-muted'>
              {t("tx.dataFrom")}{" "}
              <a
                href='https://uplc.link'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary'
              >
                UPLC.link
              </a>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='flex justify-between gap-2'>
      <span className='text-muted'>{label}</span>
      <span className='truncate text-right'>{value}</span>
    </div>
  );
}
