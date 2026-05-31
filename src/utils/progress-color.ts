export function getProgressColor(percentage: number): string {
  const safe = Number.isFinite(percentage) ? percentage : 0;
  const clamped = Math.min(100, Math.max(0, safe));

  if (clamped >= 100) return "#B5DD54";
  if (clamped >= 80) return "#DDD254";
  if (clamped >= 60) return "#CFDD54";
  if (clamped >= 40) return "#DDA854";
  if (clamped >= 20) return "#DD8B54";
  return "#DD5454";
}
