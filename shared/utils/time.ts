export function formatTimeStampDifference(startTimestamp: number, endTimestamp: number): string {
  const totalSeconds = ((endTimestamp - startTimestamp) / 1000) | 0;
  return `${(totalSeconds / 3600) | 0}时${((totalSeconds % 3600) / 60) | 0}分${totalSeconds % 60}秒`;
}
