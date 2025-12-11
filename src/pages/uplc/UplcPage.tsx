import type { ChangeEvent, FC } from "react";
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
  TEST_CASE_EXAMPLES,
  versionToString,
  type SourceKind,
} from "@/utils/uplc/uplc";

import { PageBase } from "@/components/global/pages/PageBase";
import { Button } from "@vellumlabs/cexplorer-sdk";

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
  const [selectedExampleId, setSelectedExampleId] = useState<string>("");

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
    setSelectedExampleId("");
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

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setLastAction("Copied value to clipboard.");
    } catch {
      setLastAction("Copy failed—please copy manually.");
    }
  };

  const handleExampleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!value) {
      return;
    }

    const example = TEST_CASE_EXAMPLES.find(item => item.id === value);
    setSelectedExampleId("");

    if (!example) {
      return;
    }

    setInput(example.hex);
    setResult(EMPTY_RESULT);
    setError(null);
    setPrettyMode(false);
    setLastAction(`Loaded ${example.label} from tests.`);
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
      <section className='flex w-full max-w-desktop flex-col px-mobile py-1 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <h3>Input</h3>
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
              label='Clear'
              variant='secondary'
              size='md'
              onClick={handleClear}
              disabled={!hasContent && !result}
            />
            <select
              value={selectedExampleId}
              onChange={handleExampleSelect}
              aria-label='Load example program'
              className='h-[40px] rounded-s border border-border bg-cardBg px-3 text-text-sm shadow-md outline-none'
            >
              <option value=''>Load example</option>
              {TEST_CASE_EXAMPLES.map(example => (
                <option key={example.id} value={example.id}>
                  {example.label}
                </option>
              ))}
            </select>
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
        </div>

        {result && (
          <div className='mt-4 flex w-full flex-col gap-4'>
            <div className='flex flex-wrap items-center gap-2 text-text-sm'>
              <span className='rounded-s bg-cardBg px-2 py-1 text-text-xs font-medium shadow-sm'>
                {result.kind === "text" ? "UPLC text" : "CBOR hex"}
              </span>
              <span className='text-text-sm'>Version: {result.version}</span>
              <span className='text-text-sm text-grayTextPrimary'>
                Flat bytes: {result.flatLength.toLocaleString()} · CBOR bytes:{" "}
                {result.cborLength.toLocaleString()}
              </span>
              {languageBadgeLabel && languageEvidence && (
                <div className='group relative'>
                  <span
                    className='cursor-help rounded-s bg-primary/10 px-2 py-1 text-text-xs font-medium text-primary shadow-sm'
                    tabIndex={0}
                    aria-describedby={languageTooltipId}
                  >
                    Likely {languageBadgeLabel} ⓘ
                  </span>
                  <div
                    className='absolute left-0 top-full z-10 mt-1 hidden w-64 rounded-m border border-border bg-cardBg p-2 text-text-xs shadow-lg group-hover:block group-focus:block'
                    role='tooltip'
                    id={languageTooltipId}
                  >
                    {languageEvidence}
                  </div>
                </div>
              )}
              {!languageBadgeLabel && (
                <div className='group relative'>
                  <span
                    className='cursor-help text-text-sm text-grayTextPrimary'
                    tabIndex={0}
                    aria-describedby={languageTooltipId}
                  >
                    Language unknown ⓘ
                  </span>
                  <div
                    className='absolute left-0 top-full z-10 mt-1 hidden w-64 rounded-m border border-border bg-cardBg p-2 text-text-xs shadow-lg group-hover:block group-focus:block'
                    role='tooltip'
                    id={languageTooltipId}
                  >
                    Could not identify the smart contract language based on
                    unique markers
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex items-center justify-between'>
                <h3>Flat Encoding (hex)</h3>
                <Button
                  label='Copy'
                  variant='secondary'
                  size='sm'
                  onClick={() => handleCopy(result.flatHex)}
                />
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
                <h3>CBOR-wrapped (hex)</h3>
                <Button
                  label='Copy'
                  variant='secondary'
                  size='sm'
                  onClick={() => handleCopy(result.cborHex)}
                />
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
                <h3>UPLC</h3>
                <div className='flex items-center gap-2'>
                  <label className='flex items-center gap-1.5 text-text-sm'>
                    <input
                      type='checkbox'
                      checked={prettyMode}
                      onChange={event => setPrettyMode(event.target.checked)}
                      className='h-4 w-4 rounded-xs border-border shadow-md'
                    />
                    <span>Pretty-print</span>
                  </label>
                  <Button
                    label='Copy'
                    variant='secondary'
                    size='sm'
                    onClick={() =>
                      handleCopy(prettyMode ? result.pretty : result.compact)
                    }
                  />
                </div>
              </div>
              <pre className='h-[300px] w-full overflow-auto rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md'>
                {prettyMode ? result.pretty : result.compact}
              </pre>
            </div>
          </div>
        )}
      </section>
    </PageBase>
  );
};
