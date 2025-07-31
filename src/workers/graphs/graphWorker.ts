import { GraphMessageTypes } from "@/constants/worker";
import { calculateBlockProbabilities } from "@/utils/calculateBlockProbabilities";
import { format } from "date-fns";

/* SonarQube: we do not verify origin because this worker is used only within trusted context */
self.addEventListener("message", event => {
  const data = event.data;

  switch (data.type) {
    case GraphMessageTypes.ESTIMATED_BLOCKS: {
      const estimatedBlocks = data.estimatedBlocks;
      const { blockProbabilities } =
        calculateBlockProbabilities(estimatedBlocks);

      const blockCounts = blockProbabilities.map(item => item.blockCount);
      const probabilities = blockProbabilities.map(
        item => item.probabilityPercentage,
      );

      self.postMessage({
        type: GraphMessageTypes.ESTIMATED_BLOCKS,
        calculation: {
          blockCounts,
          probabilities,
        },
      });
      break;
    }

    case GraphMessageTypes.MINTED_BLOCKS: {
      const mintedBlocksData = data.data;
      const mintedBlocks = mintedBlocksData?.map(reward => reward.block?.count);
      const txCount = mintedBlocksData?.map(reward =>
        reward.block?.avg_tx_count?.toFixed(2),
      );
      const dates = mintedBlocksData?.map(day =>
        format(new Date(day.date), "dd.MM.yyyy"),
      );

      self.postMessage({
        type: GraphMessageTypes.MINTED_BLOCKS,
        calculation: {
          mintedBlocks,
          txCount,
          dates,
        },
      });
      break;
    }

    case GraphMessageTypes.PERFOMANCE: {
      const detailData = data.data.detailData;
      const epochElapsed = data.data.epochElapsed;

      const proratedLuck = detailData?.epochs[0].data.block
        ? (() => {
            const percent =
              ((detailData?.blocks?.epoch ?? 0) /
                detailData?.epochs[0]?.data?.block?.estimated /
                epochElapsed) *
              100;

            return Number.isNaN(percent) ? "-" : percent;
          })()
        : "-";

      const detailDataEpochs = [
        {
          no: detailData?.epochs[0]?.no + 1,
          data: {
            delegators: detailData?.delegators,
            epoch_stake: detailData?.live_stake,
            block: {
              luck: proratedLuck,
              minted: detailData?.blocks?.epoch,
            },
            reward: {
              member_pct: 0,
            },
            pledged: detailData?.pledged,
          },
        },
        ...(detailData?.epochs as any[]),
      ];

      const delegators = detailDataEpochs?.map(epoch => epoch.data.delegators);
      const luck = detailDataEpochs?.map((epoch, index) =>
        index > 0
          ? (epoch.data.block.luck * 100).toFixed(2)
          : epoch.data.block.luck.toFixed(2),
      );
      const blocks = detailDataEpochs.map(epoch => epoch.data.block.minted);
      const activeStake = detailDataEpochs?.map(
        epoch => epoch?.data?.epoch_stake ?? 0,
      );
      const roa = detailDataEpochs.map(epoch => epoch.data.reward.member_pct);
      const pledged = detailDataEpochs?.map(
        reward => reward?.data?.pledged ?? 0,
      );
      const epochs = detailDataEpochs?.map(epoch => epoch.no);

      self.postMessage({
        type: GraphMessageTypes.PERFOMANCE,
        calculation: {
          delegators,
          luck,
          blocks,
          activeStake,
          roa,
          pledged,
          epochs,
        },
      });
      break;
    }

    case GraphMessageTypes.POOL_REWARDS: {
      const rewardData = data.data.data;
      const currentEpoch = data.data.miscConst?.no;

      const filteredData = rewardData?.filter(
        (epoch, i) =>
          epoch.reward?.leader_lovelace !== null &&
          epoch.reward?.leader_pct !== null &&
          epoch.reward?.member_lovelace !== null &&
          epoch.no !== currentEpoch &&
          i !== 0 &&
          i !== 1,
      );

      const leaderLovelace = filteredData?.map(reward =>
        ((reward.reward?.leader_lovelace ?? 1) / 1000000).toFixed(2),
      );
      const memberPct = filteredData?.map(reward =>
        reward.reward?.member_pct?.toFixed(2),
      );
      const memberLovelace = filteredData?.map(reward =>
        ((reward.reward?.member_lovelace ?? 1) / 1000000).toFixed(2),
      );
      const operatorPct = filteredData?.map(reward =>
        reward.reward?.leader_pct?.toFixed(2),
      );

      const epochs = filteredData?.map(epoch => epoch.no);

      self.postMessage({
        type: GraphMessageTypes.POOL_REWARDS,
        calculation: {
          epochs,
          leaderLovelace,
          memberLovelace,
          memberPct,
          operatorPct,
        },
      });
      break;
    }
  }
});
