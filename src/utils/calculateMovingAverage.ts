export const calculateMovingAverage = (
  dataArray: any[],
  windowSize: number,
) => {
  const result: number[] = [];
  for (let i = 0; i < dataArray.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subArray = dataArray.slice(start, i + 1);
    const sum = subArray.reduce((acc, val) => acc + val, 0);
    const avg = sum / subArray.length;
    result.push(avg);
  }
  return result;
};
