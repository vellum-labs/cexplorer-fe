import type { FC } from "react";
import type {
  EMBED_CONFIG_GRAPH,
  EMBED_CONFIG_SIMPLE_LINK,
} from "@/constants/embed";
import { EMBED_TYPES } from "@/constants/embed";
import type { EMBED_CONFIG_BANNERS } from "@/constants/embed";

import {
  EMBED_CONFIG_EXTRA_FORMAT,
  EMBED_CONFIG_EXTRA_NETWORK,
  EMBED_CONFIG_EXTRA_THEME,
} from "@/constants/embed";

import {
  Button,
  Dropdown,
  TableSettingsDropdown,
  useLocaleStore,
  useThemeStore,
} from "@vellumlabs/cexplorer-sdk";

import { useEffect, useState } from "react";

import { configJSON } from "@/constants/conf";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Check, ChevronDown, Copy, X } from "lucide-react";
import { toast } from "sonner";

type EmbedConfig = (
  | EMBED_CONFIG_BANNERS
  | EMBED_CONFIG_GRAPH
  | EMBED_CONFIG_SIMPLE_LINK
)[];

interface EmbedEntityProps {
  entityType: "pools" | "dreps" | "tokens";
  entityId: string;
  embedType: EMBED_TYPES;
  config: EmbedConfig;
}

export const EmbedEntity: FC<EmbedEntityProps> = ({
  entityId,
  entityType,
  config: configRaw,
  embedType,
}) => {
  const { t } = useAppTranslation("common");
  const { theme: defaultTheme } = useThemeStore();
  const { locale } = useLocaleStore();

  const [theme, setTheme] = useState<EMBED_CONFIG_EXTRA_THEME>(
    defaultTheme as EMBED_CONFIG_EXTRA_THEME,
  );
  const [network, setNetwork] = useState<EMBED_CONFIG_EXTRA_NETWORK>(
    configJSON.network as EMBED_CONFIG_EXTRA_NETWORK,
  );
  const [format, setFormat] = useState<EMBED_CONFIG_EXTRA_FORMAT>(
    EMBED_CONFIG_EXTRA_FORMAT.JSX,
  );

  const [config, setConfig] = useState<EmbedConfig>([]);

  const [copied, setCopied] = useState<boolean>(false);

  const DIVIDER = config.length ? "," : "";

  const embedUrl = `https://embed.cexplorer.io/?type=${embedType}&data=${entityType.slice(0, entityType.length - 1)}:${entityId}&config=${theme},${network},${format}${DIVIDER}${config.join(",")}`;

  const iframeWidth = embedType === EMBED_TYPES.GRAPH ? 800 : 550;

  const iframeHeight = embedType === EMBED_TYPES.GRAPH ? 700 : 400;

  const embedCode = `<iframe src="${embedUrl}" width="${iframeWidth}" height="${iframeHeight}" />`;

  const mode = [
    {
      label: t("embed.lightMode"),
      onClick: () => setTheme(EMBED_CONFIG_EXTRA_THEME.LIGHT),
    },
    {
      label: t("embed.darkMode"),
      onClick: () => setTheme(EMBED_CONFIG_EXTRA_THEME.DARK),
    },
  ];

  const networks = [
    {
      label: "Preprod",
      onClick: () => setNetwork(EMBED_CONFIG_EXTRA_NETWORK.PREPROD),
    },
    {
      label: "Preview",
      onClick: () => setNetwork(EMBED_CONFIG_EXTRA_NETWORK.PREVIEW),
    },
    {
      label: "Mainnet",
      onClick: () => setNetwork(EMBED_CONFIG_EXTRA_NETWORK.MAINNET),
    },
  ];

  const formats = [
    {
      label: "JSX",
      onClick: () => setFormat(EMBED_CONFIG_EXTRA_FORMAT.JSX),
    },
    {
      label: "PNG",
      onClick: () => setFormat(EMBED_CONFIG_EXTRA_FORMAT.PNG),
    },
  ];

  const configOptions = configRaw.reduce<
    {
      label: string;
      isVisible: boolean;
      onClick: () => void;
    }[]
  >((acc, curr) => {
    acc.push({
      label: curr[0].toUpperCase() + curr.slice(1),
      isVisible: config.includes(curr),
      onClick: () =>
        setConfig(prev => {
          const next = [...prev];
          const currIndex = prev.indexOf(curr);

          if (currIndex !== -1) {
            next.splice(currIndex, 1);
            return next;
          }

          next.push(curr);
          return next;
        }),
    });

    return acc;
  }, []);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(embedUrl || "");
      setCopied(true);

      toast(t("embed.successCopied"), {
        action: {
          label: <X size={15} className='stroke-text' />,
          onClick: () => undefined,
        },
        id: "copy-toast",
      });

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch {
      toast(t("embed.copyFailed"), {
        action: {
          label: <X size={15} className='stroke-text' />,
          onClick: () => undefined,
        },
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const iframe = document.querySelector("iframe");
      const doc = iframe?.contentDocument || iframe?.contentWindow?.document;

      const img = doc?.querySelector('[alt="rendered"]');
      console.log(img);
    }, 1500);
  }, [format]);

  return (
    <div className='flex flex-col gap-4 py-2 md:gap-6 xl:flex-row'>
      <div className='flex w-full flex-col gap-3'>
        <span className='text-text-sm font-medium'>{t("embed.code")}</span>
        <pre className='overflow-x-auto whitespace-pre-wrap break-all rounded-m border border-border bg-darker p-3 text-text-sm text-grayTextPrimary'>
          {embedCode}
        </pre>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-1'>
            <Dropdown
              id='mode'
              width='150px'
              label={t("embed.mode")}
              options={mode}
              triggerClassName='font-medium px-1.5 py-1 border border-border rounded-s'
              closeOnSelect
              forceHorizontalPosition='right'
            />
            <Dropdown
              id='network'
              width='150px'
              label={t("embed.network")}
              options={networks}
              triggerClassName='font-medium px-1.5 py-1 border border-border rounded-s'
              closeOnSelect
              forceHorizontalPosition='right'
            />
            <Dropdown
              id='format'
              width='150px'
              label={t("embed.format")}
              options={formats}
              triggerClassName='font-medium px-1.5 py-1 border border-border rounded-s'
              closeOnSelect
              forceHorizontalPosition='right'
            />
            <div
              className={`box-border ${locale === "en" ? "max-w-[100px]" : "max-w-[135px]"}`}
            >
              <TableSettingsDropdown
                columnsOptions={configOptions}
                visibleRows={false}
                rows={0}
                setRows={() => undefined}
                customContent={
                  <div className='flex items-center gap-1 rounded-s border border-border px-1.5 py-1 font-medium'>
                    <span>{t("embed.config")}</span>
                    <ChevronDown size={18} />
                  </div>
                }
              />
            </div>
          </div>
          <div className='flex items-center gap-1'>
            {/* {format.includes(EMBED_CONFIG_EXTRA_FORMAT.PNG) && (
              <Button
                size='md'
                variant='tertiary'
                label='Download PNG'
                rightIcon={<Download size={15} />}
              />
            )} */}
            <Button
              size='md'
              variant='primary'
              label={t("embed.copyCode")}
              rightIcon={copied ? <Check size={15} /> : <Copy size={15} />}
              onClick={handleCopy}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <span className='pl-1 text-text-sm font-medium'>
          {t("embed.preview")}
        </span>
        <div className='overflow-x-auto'>
          <iframe src={embedUrl} width={iframeWidth} height={iframeHeight} />
        </div>
      </div>
    </div>
  );
};
