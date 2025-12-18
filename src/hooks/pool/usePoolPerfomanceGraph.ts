import { useFetchPoolDetail } from "@/services/pools";
import { useEffect, useRef, useState } from "react";

import GraphWorker from "@/workers/graphs/graphWorker?worker";
import { GraphMessageTypes } from "@/constants/worker";
import { useElapsedEpochNumber } from "../useElapsedEpochNumber";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "../useMiscConst";

interface PoolPerfomanceGraph {
  epochs: number[];
  delegators: number[];
  luck: number[];
  blocks: number[];
  activeStake: number[];
  pledged: number[];
  roa: number[];
}

interface PerfomanceGraphMessage {
  type: GraphMessageTypes.PERFOMANCE;
  calculation: {
    delegators: number[];
    luck: number[];
    blocks: number[];
    activeStake: number[];
    roa: number[];
    pledged: number[];
    epochs: number[];
  };
}

export const usePoolPerfomanceGraph = (id: string): PoolPerfomanceGraph => {
  const [epochs, setEpochs] = useState<number[]>([]);
  const [delegators, setDelegators] = useState<number[]>([]);
  const [luck, setLuck] = useState<number[]>([]);
  const [blocks, setBlocks] = useState<number[]>([]);
  const [activeStake, setActiveStake] = useState<number[]>([]);
  const [pledged, setPledged] = useState<number[]>([]);
  const [roa, setRoa] = useState<number[]>([]);

  const detailQuery = useFetchPoolDetail(
    id.startsWith("pool1") ? id : undefined,
    id.startsWith("pool1") ? undefined : id,
  );

  const workerRef = useRef<Worker | null>(null);

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);
  const epochElapsed = useElapsedEpochNumber(miscConst);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new GraphWorker();

      workerRef.current.onmessage = ({
        data,
      }: MessageEvent<PerfomanceGraphMessage>) => {
        switch (data.type) {
          case GraphMessageTypes.PERFOMANCE:
            setEpochs(data.calculation.epochs);
            setDelegators(data.calculation.delegators);
            setLuck(data.calculation.luck);
            setBlocks(data.calculation.blocks);
            setActiveStake(data.calculation.activeStake);
            setPledged(data.calculation.pledged);
            setRoa(data.calculation.roa);

            break;
        }
      };
    }

    const detailData = detailQuery.data?.data;

    if (detailData) {
      workerRef.current.postMessage({
        type: GraphMessageTypes.PERFOMANCE,
        data: {
          detailData,
          epochElapsed,
        },
      });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [detailQuery.data]);

  return {
    activeStake,
    blocks,
    delegators,
    epochs,
    luck,
    pledged,
    roa,
  };
};
