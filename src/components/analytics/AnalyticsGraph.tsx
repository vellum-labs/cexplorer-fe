import type { FC, ReactNode } from "react";

import { Children, cloneElement, isValidElement } from "react";

import { Download } from "lucide-react";
import { FeatureModal } from "../global/modals/FeatureModal";
import ConnectWalletModal from "../wallet/ConnectWalletModal";

import { useFetchUserInfo } from "@/services/user";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useWalletStore } from "@/stores/walletStore";
import { useCallback, useRef, useState } from "react";

import { colors } from "@/constants/colors";
import { type GraphSortData } from "@/types/graphTypes";
import { convertJSONToCSV } from "@/utils/convertJSONToCSV";
import { toPng } from "html-to-image";
import { GraphEpochSort } from "../global/graphs/GraphEpochSort";
import { ExportGraphModal } from "./ExportGraphModal";

interface AnalyticsGraphProps {
  children: ReactNode;
  title?: string;
  description?: string;
  exportButton?: boolean;
  className?: string;
  graphSortData?: never;
  csvJson?: any;
  actions?: ReactNode;
  sortBy?: "epochs" | "days";
}

interface AnalyticsGraphPropsWithSort {
  children: ReactNode;
  title?: string;
  description?: string;
  exportButton?: boolean;
  graphSortData: GraphSortData;
  className?: string;
  csvJson?: any;
  actions?: ReactNode;
  sortBy?: "epochs" | "days";
}

type Props = AnalyticsGraphPropsWithSort | AnalyticsGraphProps;

export const AnalyticsGraph: FC<Props> = ({
  children,
  title,
  description,
  exportButton = false,
  className,
  csvJson,
  graphSortData,
  actions,
  sortBy,
}) => {
  const { address, walletApi } = useWalletStore();
  const userQuery = useFetchUserInfo();
  const nftCount = userQuery.data?.data?.membership.nfts;

  const { theme } = useThemeStore();

  const [showFeatureModal, setShowFeatureModal] = useState<boolean>(false);
  const [showConnectWallet, setShowConnectWallet] = useState<boolean>(false);
  const [showExportGraph, setShowExportGraph] = useState<boolean>(false);
  const [json, setJson] = useState<any>();

  const ref = useRef<HTMLDivElement>(null);

  const modifiedChildren = Children.map(children, child =>
    isValidElement(child)
      ? //@ts-expect-error types
        cloneElement(child, { setJson })
      : child,
  );

  const exportGraphToPng = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, {
      cacheBust: true,
      backgroundColor: theme === "light" ? "#fff" : "#252933",
      skipFonts: false,
      filter: node => {
        return !node.id || node.id !== "graph-functionality";
      },
      fontEmbedCSS: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      * { font-family: 'Inter', sans-serif !important; }
    `,
    }).then(dataUrl => {
      const link = document.createElement("a");

      link.download = "graph.png";
      link.href = dataUrl;
      link.click();
    });
  }, [ref]);

  const exportGraphToCsv = useCallback((json: any) => {
    if (json) {
      const csv: string = convertJSONToCSV(json);
      const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
      const link = document.createElement("a");
      link.href = csvString;
      link.download = "graph.csv";
      link.click();
    }
  }, []);

  const showModals = () => {
    if (
      !address ||
      !walletApi ||
      typeof nftCount === "undefined" ||
      nftCount < 1
    ) {
      setShowFeatureModal(true);
      return;
    }

    setShowExportGraph(true);
  };

  return (
    <>
      {showFeatureModal && (
        <FeatureModal
          onClose={() => setShowFeatureModal(false)}
          setShowConnectWallet={setShowConnectWallet}
        />
      )}
      {showConnectWallet && (
        <ConnectWalletModal onClose={() => setShowConnectWallet(false)} />
      )}
      {showExportGraph && (
        <ExportGraphModal
          onClose={() => setShowExportGraph(false)}
          onPNG={exportGraphToPng}
          onCSV={() => exportGraphToCsv(csvJson ?? json)}
        />
      )}
      <div
        className={`w-full rounded-m border border-border bg-cardBg p-3 ${className ? className : ""}`}
        ref={ref}
      >
        <div
          className={`flex flex-col ${!title && !description ? "justify-end" : "justify-between"} pb-1.5 md:flex-row md:pb-0`}
        >
          {(title || description) && (
            <div
              className={`flex flex-col justify-between gap-1/2 pb-1.5 ${!description || !title ? "justify-center" : ""}`}
            >
              {title && <h2>{title}</h2>}
              {description && (
                <span className='text-text-xs text-grayTextPrimary'>
                  {description}
                </span>
              )}
            </div>
          )}

          <div
            className='flex flex-wrap items-center gap-1'
            id='graph-functionality'
          >
            {actions && (
              <div className='flex items-center gap-1'>{actions}</div>
            )}
            {graphSortData && (
              <GraphEpochSort
                query={graphSortData.query}
                selectedItem={graphSortData.selectedItem}
                setData={graphSortData.setData}
                setSelectedItem={graphSortData.setSelectedItem}
                ignoreFiveDays={graphSortData.ignoreFiveDays}
                sortBy={sortBy}
              />
            )}
            {exportButton && (
              <div
                className='flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center gap-1/2 rounded-s border border-border'
                onClick={showModals}
              >
                <Download
                  size={15}
                  color={colors.text}
                  className='text-text-md'
                />
              </div>
            )}
          </div>
        </div>
        <div>{modifiedChildren}</div>
      </div>
    </>
  );
};
