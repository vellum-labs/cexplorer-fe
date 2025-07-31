import { GraphMessageTypes } from "@/constants/worker";
import GraphWorker from "@/workers/graphs/graphWorker?worker";

import { useFetchPoolBlocks } from "@/services/pools";
import { useEffect, useRef, useState } from "react";

interface EstimatedGraphMessage {
  type: GraphMessageTypes.ESTIMATED_BLOCKS;
  calculation: {
    blockCounts: number[];
    probabilities: number[];
  };
}

interface MintedGraphMessage {
  type: GraphMessageTypes.MINTED_BLOCKS;
  calculation: {
    mintedBlocks: number[];
    txCount: number[];
    dates: string[];
  };
}

interface PoolBlocksGraphs {
  blockCounts: number[];
  probabilities: number[];
  mintedBlocks: number[];
  txCount: number[];
  dates: string[];
}

export const usePoolBlocksGraphs = (
  estimatedBlocks: number,
  id: string,
): PoolBlocksGraphs => {
  const [blockCounts, setBlockCounts] = useState<number[]>([]);
  const [probabilities, setProbabilities] = useState<number[]>([]);
  const [mintedBlocks, setMintedBlocks] = useState<number[]>([]);
  const [txCount, setTxCount] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  const blocksQuery = useFetchPoolBlocks(id);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new GraphWorker();

      workerRef.current.onmessage = ({
        data,
      }: MessageEvent<EstimatedGraphMessage | MintedGraphMessage>) => {
        switch (data.type) {
          case GraphMessageTypes.ESTIMATED_BLOCKS:
            setBlockCounts(data.calculation.blockCounts);
            setProbabilities(data.calculation.probabilities);
            break;
          case GraphMessageTypes.MINTED_BLOCKS:
            setMintedBlocks(data.calculation.mintedBlocks);
            setTxCount(data.calculation.txCount);
            setDates(data.calculation.dates);
            break;
        }
      };
    }

    if (estimatedBlocks) {
      workerRef.current.postMessage({
        type: GraphMessageTypes.ESTIMATED_BLOCKS,
        estimatedBlocks,
      });
    }

    if (blocksQuery.data?.data) {
      workerRef.current.postMessage({
        type: GraphMessageTypes.MINTED_BLOCKS,
        data: blocksQuery.data.data,
      });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [estimatedBlocks, blocksQuery.data]);

  return {
    blockCounts,
    mintedBlocks,
    probabilities,
    txCount,
    dates,
  };
};
