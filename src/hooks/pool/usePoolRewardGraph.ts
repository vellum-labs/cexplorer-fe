import type { MiscConstResponseData } from "@/types/miscTypes";

import { useFetchPoolReward } from "@/services/pools";
import { useEffect, useRef, useState } from "react";

import GraphWorker from "@/workers/graphs/graphWorker?worker";
import { GraphMessageTypes } from "@/constants/worker";

interface PoolRewardGraph {
  epochs: number[];
  leaderLovelace: number[];
  membetPct: number[];
  memberLovelace: number[];
  operatorPct: number[];
}

interface PoolRewardsMessage {
  type: GraphMessageTypes.POOL_REWARDS;
  calculation: {
    epochs: number[];
    leaderLovelace: number[];
    membetPct: number[];
    memberLovelace: number[];
    operatorPct: number[];
  };
}

export const usePoolRewardGraph = (
  id: string,
  miscConst: MiscConstResponseData | undefined,
): PoolRewardGraph => {
  const [epochs, setEpochs] = useState<number[]>([]);
  const [leaderLovelace, setLeaderLovalace] = useState<number[]>([]);
  const [membetPct, setMemberPct] = useState<number[]>([]);
  const [memberLovelace, setMemberLovelace] = useState<number[]>([]);
  const [operatorPct, setOperatorPct] = useState<number[]>([]);

  const rewardQuery = useFetchPoolReward(id, 20, 0);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new GraphWorker();

      workerRef.current.onmessage = ({
        data,
      }: MessageEvent<PoolRewardsMessage>) => {
        switch (data.type) {
          case GraphMessageTypes.POOL_REWARDS:
            setEpochs(data.calculation.epochs);
            setLeaderLovalace(data.calculation.leaderLovelace);
            setMemberPct(data.calculation.membetPct);
            setMemberLovelace(data.calculation.memberLovelace);
            setOperatorPct(data.calculation.operatorPct);
            break;
        }
      };
    }

    if (rewardQuery.data) {
      workerRef.current.postMessage({
        type: GraphMessageTypes.POOL_REWARDS,
        data: {
          miscConst,
          data: rewardQuery.data?.pages[0].data.data,
        },
      });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [rewardQuery.data]);

  return {
    epochs,
    leaderLovelace,
    memberLovelace,
    membetPct,
    operatorPct,
  };
};
