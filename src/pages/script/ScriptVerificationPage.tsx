import { AddressInspectorRow } from "@/components/address/AddressInspectorRow";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  fetchUplcScript,
  type UplcScriptResponse,
} from "@/services/uplc";
import { Badge, Copy, JsonDisplay, TableSearchInput, useDebounce } from "@vellumlabs/cexplorer-sdk";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type FC } from "react";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "verified"; data: UplcScriptResponse }
  | { kind: "unknown" };

const LS_KEY = "scriptVerificationHash";

export const ScriptVerificationPage: FC = () => {
  const { t } = useAppTranslation();
  const { hash } = useSearch({
    from: "/script/verification",
  });

  const navigate = useNavigate();

  const initial = hash || localStorage.getItem(LS_KEY) || "";
  const [search, setSearch] = useState<string>(initial);
  const [state, setState] = useState<State>({ kind: "idle" });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const trimmed = debouncedSearch?.trim();
    if (!trimmed) {
      setState({ kind: "idle" });
      localStorage.removeItem(LS_KEY);
      navigate({
        to: "/script/verification",
        search: {},
        replace: true,
      });
      return;
    }

    localStorage.setItem(LS_KEY, trimmed);
    navigate({
      to: "/script/verification",
      search: { hash: trimmed },
      replace: true,
    });

    let cancelled = false;
    setState({ kind: "loading" });

    fetchUplcScript(trimmed).then(data => {
      if (cancelled) return;
      if (data && data.status === "VERIFIED") {
        setState({ kind: "verified", data });
      } else {
        setState({ kind: "unknown" });
      }
    }).catch(() => {
      if (!cancelled) setState({ kind: "unknown" });
    });

    return () => { cancelled = true; };
  }, [debouncedSearch]);

  const currentHash = debouncedSearch?.trim() || "";
  const script =
    state.kind === "verified" ? state.data.scripts?.[0] : undefined;
  const data = state.kind === "verified" ? state.data : undefined;

  const compilerLabel =
    data?.compilerType
      ? `${data.compilerType} ${data.compilerVersion}`
      : data?.compilerVersion ?? "";

  const rows =
    state.kind === "verified" && data
      ? [
          {
            title: t("scriptVerification.rows.status"),
            darker: true,
            value: (
              <span className='font-medium text-greenText'>
                {t("scriptVerification.sourceVerified")} ✓
              </span>
            ),
          },
          {
            title: t("scriptVerification.rows.plutusVersion"),
            darker: false,
            value: script?.plutusVersion ? (
              <Badge color='gray'>{script.plutusVersion}</Badge>
            ) : (
              "-"
            ),
          },
          {
            title: t("scriptVerification.rows.compiler"),
            darker: true,
            value: compilerLabel ? <Badge color='gray'>{compilerLabel}</Badge> : "-",
          },
          {
            title: t("scriptVerification.rows.sourceUrl"),
            darker: false,
            value: data.sourceUrl ? (
              <a
                href={data.sourceUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary no-underline'
              >
                {data.sourceUrl}
              </a>
            ) : (
              "-"
            ),
          },
          {
            title: t("scriptVerification.rows.commitHash"),
            darker: true,
            value: data.commitHash ? (
              data.sourceUrl ? (
                <a
                  href={`${data.sourceUrl}/commit/${data.commitHash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary no-underline'
                >
                  {data.commitHash}
                </a>
              ) : (
                data.commitHash
              )
            ) : (
              "-"
            ),
          },
          {
            title: t("scriptVerification.rows.scriptName"),
            darker: false,
            titleStart: true,
            value: (
              <div className='flex flex-col gap-1/2 py-1.5'>
                <span>
                  <span className='text-grayTextPrimary'>
                    {t("scriptVerification.rows.scriptName")}:{" "}
                  </span>
                  {script?.scriptName || "-"}
                </span>
                <span>
                  <span className='text-grayTextPrimary'>
                    {t("scriptVerification.rows.moduleName")}:{" "}
                  </span>
                  {script?.moduleName || "-"}
                </span>
                <span>
                  <span className='text-grayTextPrimary'>
                    {t("scriptVerification.rows.validatorName")}:{" "}
                  </span>
                  {script?.validatorName || "-"}
                </span>
              </div>
            ),
          },
          {
            title: t("scriptVerification.rows.purposes"),
            darker: true,
            value: script?.purposes?.length
              ? script.purposes.join(", ")
              : "-",
          },
          {
            title: t("scriptVerification.rows.rawHash"),
            darker: false,
            titleStart: true,
            value: (
              <div className='flex flex-col gap-1/2 py-1.5'>
                <div className='flex items-center gap-1'>
                  <span className='text-grayTextPrimary'>
                    {t("scriptVerification.rows.rawHash")}:{" "}
                  </span>
                  <span className='break-all'>{script?.rawHash || "-"}</span>
                  {script?.rawHash && (
                    <Copy
                      copyText={script.rawHash}
                      className='translate-y-[2px]'
                    />
                  )}
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-grayTextPrimary'>
                    {t("scriptVerification.rows.finalHash")}:{" "}
                  </span>
                  <span className='break-all'>{script?.finalHash || "-"}</span>
                  {script?.finalHash && (
                    <Copy
                      copyText={script.finalHash}
                      className='translate-y-[2px]'
                    />
                  )}
                </div>
              </div>
            ),
          },
          {
            title: t("scriptVerification.rows.parametrizationStatus"),
            darker: true,
            value: (() => {
              const status = script?.parameterizationStatus;
              if (!status) return "-";
              if (
                status.toLowerCase() === "complete" ||
                status.toLowerCase() === "completed" ||
                status.toLowerCase() === "done"
              ) {
                return (
                  <span className='font-medium text-greenText'>
                    {status} ✓
                  </span>
                );
              }
              return status;
            })(),
          },
          {
            title: t("scriptVerification.rows.rawResponse"),
            darker: false,
            titleStart: true,
            value: (
              <div className='w-full py-1.5'>
                <JsonDisplay data={data} isLoading={false} isError={false} />
              </div>
            ),
          },
        ]
      : state.kind === "unknown"
        ? [
            {
              title: t("scriptVerification.rows.status"),
              darker: true,
              value: (
                <span className='font-medium' style={{ color: "#E67E22" }}>
                  {t("scriptVerification.sourceUnknown")}
                </span>
              ),
            },
          ]
        : [];

  const isLoading = state.kind === "loading";
  const hasSearched = state.kind !== "idle";

  return (
    <PageBase
      metadataTitle='scriptVerification'
      title={t("scriptVerification.title")}
      breadcrumbItems={[
        {
          label: t("scriptVerification.breadcrumbs.developers"),
          link: "/dev",
        },
        { label: t("scriptVerification.breadcrumbs.scriptVerification") },
      ]}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col items-end gap-2 p-mobile md:p-desktop'>
          <div className='flex w-full'>
            <TableSearchInput
              value={search}
              onchange={val => setSearch(val)}
              placeholder={t("scriptVerification.placeholder")}
              showSearchIcon
              wrapperClassName='w-full'
              showPrefixPopup={false}
            />
          </div>

          {hasSearched && currentHash && (
            <div className='flex w-full items-center justify-between'>
              <Link
                to='/script/$hash'
                params={{ hash: currentHash }}
                className='flex items-center gap-1/2'
              >
                <span className='text-text-sm font-semibold text-primary'>
                  {t("scriptVerification.scriptDetail")}
                </span>
                <ArrowRight className='text-primary' size={15} />
              </Link>
              <span className='text-text-xs text-grayTextPrimary'>
                {t("scriptVerification.dataFrom")}{" "}
                <a
                  href='https://uplc.link'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary'
                >
                  UPLC.link
                </a>
              </span>
            </div>
          )}

          {hasSearched && (
            <div
              className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-m border border-border'
              style={{ transform: "rotateX(180deg)" }}
            >
              <div
                className='w-full min-w-[1300px]'
                style={{ transform: "rotateX(180deg)" }}
              >
                {rows.map((item, index) => (
                  <AddressInspectorRow
                    key={item.title + index}
                    title={item.title}
                    darker={item.darker}
                    value={item.value}
                    isLoading={isLoading}
                    titleStart={"titleStart" in item ? item.titleStart : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageBase>
  );
};
