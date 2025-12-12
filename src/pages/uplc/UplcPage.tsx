import type { FC } from "react";
import {
  predictLanguage,
  type DetectedLanguage,
  type LanguagePrediction,
} from "@/utils/uplc/languageDetection";
import {
  detectSourceKind,
  encodeProgram,
  parseCborHex,
  parseTextSource,
  versionToString,
  type SourceKind,
} from "@/utils/uplc/uplc";

import { PageBase } from "@/components/global/pages/PageBase";
import { Button, Switch, Copy } from "@vellumlabs/cexplorer-sdk";

import { useId, useMemo, useState } from "react";

const LANGUAGE_LABELS: Record<DetectedLanguage, string> = {
  aiken: "Aiken",
  helios: "Helios",
  "plu-ts": "Plu-ts",
  "plutus-tx": "Plutus Tx",
  plutarch: "Plutarch",
  opshin: "OpShin",
  marlowe: "Marlowe",
};

function describeLanguageEvidence(prediction: LanguagePrediction): string {
  if (prediction.evidence.kind === "marker") {
    const { totalMatches, markers } = prediction.evidence;
    const sample = markers.join(", ");
    if (totalMatches > markers.length) {
      return `Matched ${totalMatches} known marker snippets (e.g. ${sample}).`;
    }
    return `Matched marker snippets: ${sample}.`;
  }

  return prediction.evidence.detail;
}

function buildLastActionMessage(base: string): string {
  return base;
}

interface ViewerResult {
  kind: SourceKind;
  version: string;
  pretty: string;
  compact: string;
  flatHex: string;
  flatLength: number;
  cborHex: string;
  cborLength: number;
  languagePrediction: LanguagePrediction | null;
}

const EMPTY_RESULT: ViewerResult | null = null;

export const UplcPage: FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ViewerResult | null>(EMPTY_RESULT);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [prettyMode, setPrettyMode] = useState(false);

  const hasContent = input.trim().length > 0;
  const detectedKind = useMemo(() => detectSourceKind(input), [input]);

  const placeholder = useMemo(
    () =>
      `(program 1.1.0
  (lam
    (lam
      [ (builtin ifThenElse)
        (force (force (builtin equalsInteger)))
        (con integer 1)
        (con integer 0)
      ]
    )
  )
)`,
    [],
  );

  const handleClear = () => {
    setInput("");
    setResult(EMPTY_RESULT);
    setError(null);
    setLastAction(null);
    setPrettyMode(false);
  };

  const handleProcess = () => {
    const trimmed = input.trim();
    setResult(EMPTY_RESULT);
    setError(null);
    setLastAction(null);

    if (!trimmed) {
      setError("Paste a UPLC program or its CBOR hex representation to begin.");
      return;
    }

    let textError: string | null = null;

    try {
      const parsed = parseTextSource(trimmed);
      const encoding = encodeProgram(parsed.term, parsed.version);
      const languagePrediction = predictLanguage(parsed.term, parsed.compact);

      setResult({
        kind: "text",
        version: versionToString(parsed.version),
        pretty: parsed.pretty,
        compact: parsed.compact,
        flatHex: encoding.flatHex,
        flatLength: encoding.flatBytes.length,
        cborHex: encoding.cborHex,
        cborLength: encoding.cborBytes.length,
        languagePrediction,
      });
      setLastAction(buildLastActionMessage("Parsed source as plain UPLC."));
      return;
    } catch (err) {
      textError = err instanceof Error ? err.message : String(err);
    }

    try {
      const parsed = parseCborHex(trimmed);
      const languagePrediction = predictLanguage(
        parsed.program.body,
        parsed.compact,
      );
      setResult({
        kind: "cbor",
        version: versionToString(parsed.version),
        pretty: parsed.pretty,
        compact: parsed.compact,
        flatHex: parsed.flatHex,
        flatLength: parsed.flatBytes.length,
        cborHex: parsed.cborHex,
        cborLength: parsed.cborBytes.length,
        languagePrediction,
      });
      setLastAction(
        buildLastActionMessage("Parsed source as CBOR-wrapped script."),
      );
    } catch (err) {
      const cborMessage = err instanceof Error ? err.message : String(err);
      const combined = [
        `Failed to parse as UPLC text: ${textError ?? "unknown error."}`,
        `Failed to parse as CBOR hex: ${cborMessage}`,
      ].join(" ");
      setError(combined);
    }
  };

  const currentLanguagePrediction = result?.languagePrediction ?? null;
  const languageBadgeLabel = currentLanguagePrediction
    ? LANGUAGE_LABELS[currentLanguagePrediction.language]
    : null;
  const languageEvidence = currentLanguagePrediction
    ? describeLanguageEvidence(currentLanguagePrediction)
    : null;
  const languageTooltipId = useId();

  return (
    <PageBase
      metadataTitle='uplcPage'
      title='UPLC Viewer'
      breadcrumbItems={[
        { label: "Developers", link: "/dev" },
        { label: "UPLC Viewer" },
      ]}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-2 p-mobile md:p-desktop'>
          <p className='text-text-sm text-grayTextPrimary'>
            Universal tool for inspecting and formatting Untyped Plutus Core
            (UPLC): native, flat encoded or CBOR-wrapped. Implemented from the
            opensource code built by{" "}
            <a
              href='https://github.com/OpShin/uplc'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              OpShin
            </a>{" "}
            team.
          </p>

          <p className='text-text-sm text-grayTextPrimary'>
            Repository on GitHub:{" "}
            <a
              href='https://github.com/HarmonicLabs/uplc'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              @HarmonicLabs/uplc
            </a>
          </p>

          <div className='flex w-full flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <span className='text-text-sm font-medium'>Input</span>
              <span className='text-text-xs text-grayTextPrimary'>*</span>
              {hasContent && (
                <span className='rounded-s bg-cardBg px-2 py-0.5 text-text-xs font-medium text-primary shadow-sm'>
                  {detectedKind === "text"
                    ? "UPLC text"
                    : detectedKind === "flat"
                      ? "Flat"
                      : "CBOR hex"}
                </span>
              )}
            </div>
            <textarea
              id='uplc-input'
              value={input}
              placeholder={placeholder}
              onChange={evt => setInput(evt.target.value)}
              spellCheck={false}
              className='h-[300px] w-full resize-none rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md outline-none'
            />
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button
              label='Convert'
              variant='primary'
              size='md'
              onClick={handleProcess}
              disabled={!hasContent}
            />
            <Button
              label='Clear Input'
              variant='secondary'
              size='md'
              onClick={handleClear}
              disabled={!hasContent && !result}
            />
          </div>

          {error && (
            <div className='rounded-m border border-red-500 bg-red-50 p-3 text-text-sm text-red-700 dark:bg-red-950 dark:text-red-300'>
              {error}
            </div>
          )}
          {lastAction && !error && (
            <div className='rounded-m border border-blue-500 bg-blue-50 p-3 text-text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300'>
              {lastAction}
            </div>
          )}

        {result && (
          <>
            <div className='mt-4 flex w-full flex-col gap-2'>
              <span className='text-text-sm font-medium'>Output</span>
              <div className='flex flex-wrap items-center gap-2 rounded-m border border-border bg-cardBg p-3'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-text-xs text-grayTextPrimary'>
                    Version:
                  </span>
                  <span className='text-text-sm font-medium'>
                    {result.version}
                  </span>
                </div>
                <div className='h-4 w-px bg-border' />
                <div className='flex items-center gap-1.5'>
                  <span className='text-text-xs text-grayTextPrimary'>
                    Flat bytes:
                  </span>
                  <span className='text-text-sm font-medium'>
                    {result.flatLength.toLocaleString()}
                  </span>
                </div>
                <div className='h-4 w-px bg-border' />
                <div className='flex items-center gap-1.5'>
                  <span className='text-text-xs text-grayTextPrimary'>
                    CBOR bytes:
                  </span>
                  <span className='text-text-sm font-medium'>
                    {result.cborLength.toLocaleString()}
                  </span>
                </div>
                {languageBadgeLabel && languageEvidence && (
                  <>
                    <div className='h-4 w-px bg-border' />
                    <div className='group relative'>
                      <span
                        className='cursor-help rounded-s bg-primary/10 px-2 py-0.5 text-text-xs font-medium text-primary shadow-sm'
                        tabIndex={0}
                        aria-describedby={languageTooltipId}
                      >
                        Likely {languageBadgeLabel} ⓘ
                      </span>
                      <div
                        className='absolute left-0 top-full z-10 mt-1 hidden max-w-[320px] rounded-m border border-border bg-cardBg p-2 text-text-xs shadow-lg group-hover:block group-focus:block'
                        role='tooltip'
                        id={languageTooltipId}
                      >
                        <p className='break-words'>{languageEvidence}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='flex w-full flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-sm font-medium'>
                    Flat Encoding (Hex)
                  </span>
                  <Copy copyText={result.flatHex} />
                </div>
                <textarea
                  value={result.flatHex}
                  readOnly
                  spellCheck={false}
                  className='h-[120px] w-full resize-none rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-sm font-medium'>
                    CBOR-wrapped (Hex)
                  </span>
                  <Copy copyText={result.cborHex} />
                </div>
                <textarea
                  value={result.cborHex}
                  readOnly
                  spellCheck={false}
                  className='h-[120px] w-full resize-none rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-sm font-medium'>UPLC</span>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2 text-text-sm'>
                      <span>Pretty-print</span>
                      <Switch
                        active={prettyMode}
                        onChange={checked => setPrettyMode(checked)}
                      />
                    </div>
                    <Copy
                      copyText={
                        prettyMode ? result.pretty : result.compact
                      }
                    />
                  </div>
                </div>
                <pre className='h-[300px] w-full overflow-auto rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md'>
                  {prettyMode ? result.pretty : result.compact}
                </pre>
              </div>
            </div>
          </>
        )}
        </div>
      </section>
    </PageBase>
  );
};
