const logAddExp = (logA: number, logB: number): number => {
  if (logA === -Infinity) return logB;
  if (logB === -Infinity) return logA;
  if (logA > logB) {
    return logA + Math.log(1 + Math.exp(logB - logA));
  } else {
    return logB + Math.log(1 + Math.exp(logA - logB));
  }
};

const binomialCoefficientLog = (
  totalTrials: number,
  successTrials: number,
): number => {
  if (successTrials > totalTrials) return -Infinity;
  successTrials = Math.min(successTrials, totalTrials - successTrials);
  let logCoefficient = 0;
  for (let i = 0; i < successTrials; i++) {
    logCoefficient += Math.log(totalTrials - i) - Math.log(i + 1);
  }
  return logCoefficient;
};

const processResults = (
  probabilityData: { blockCount: number; logProbability: number }[],
  totalProbabilityLog: number,
) => {
  const blockProbabilities: {
    blockCount: number;
    probabilityPercentage: number;
    cappedCumulative: number;
  }[] = [];
  const cumulativeProbabilities: {
    blockCount: number;
    cappedCumulative: number;
  }[] = [];

  if (totalProbabilityLog === -Infinity)
    return { blockProbabilities, cumulativeProbabilities };

  let cumulativeProbability = 0;
  const threshold = 0.0002;

  probabilityData.sort((a, b) => a.blockCount - b.blockCount);

  for (const { blockCount, logProbability } of probabilityData) {
    const probabilityPercentage =
      Math.exp(logProbability - totalProbabilityLog) * 100;
    if (probabilityPercentage < threshold) continue;
    cumulativeProbability += probabilityPercentage;
    const cappedCumulative = cumulativeProbability;

    blockProbabilities.push({
      blockCount,
      probabilityPercentage: Number(probabilityPercentage.toFixed(2)),
      cappedCumulative: Number(cappedCumulative.toFixed(2)),
    });
    cumulativeProbabilities.push({
      blockCount,
      cappedCumulative: Number(cappedCumulative.toFixed(2)),
    });
  }

  return { blockProbabilities, cumulativeProbabilities };
};

export const calculateBlockProbabilities = (
  estimatedBlocks: number,
): {
  blockProbabilities: {
    blockCount: number;
    probabilityPercentage: number;
    cappedCumulative: number;
  }[];
  cumulativeProbabilities: { blockCount: number; cappedCumulative: number }[];
} => {
  const totalBlocks = estimatedBlocks * 2;
  let totalProbabilityLog = -Infinity;
  const probabilityData: { blockCount: number; logProbability: number }[] = [];

  for (let blockCount = 0; blockCount <= totalBlocks; blockCount++) {
    const logBinomCoeff = binomialCoefficientLog(totalBlocks, blockCount);
    probabilityData.push({ blockCount, logProbability: logBinomCoeff });
    totalProbabilityLog = logAddExp(totalProbabilityLog, logBinomCoeff);
  }

  if (estimatedBlocks >= 2) {
    return processResults(probabilityData, totalProbabilityLog);
  }

  const exactValue = Number(estimatedBlocks.toFixed(2));
  if (
    Number.isInteger(exactValue) &&
    probabilityData.some(p => p.blockCount === exactValue)
  ) {
    return processResults(probabilityData, totalProbabilityLog);
  }

  const poissonProb = Math.exp(
    -estimatedBlocks +
      exactValue * Math.log(estimatedBlocks) -
      logFactorial(exactValue),
  );
  const logPoissonProb = Math.log(poissonProb);

  probabilityData.push({
    blockCount: exactValue,
    logProbability: logPoissonProb,
  });
  totalProbabilityLog = logAddExp(totalProbabilityLog, logPoissonProb);

  return processResults(probabilityData, totalProbabilityLog);
};

const logFactorial = (n: number): number => {
  if (n <= 1) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result += Math.log(i);
  }
  return result;
};
