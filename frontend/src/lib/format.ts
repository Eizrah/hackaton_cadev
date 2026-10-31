export function compactStars(value: number) {
  if (value >= 1e6) return `${Number((value / 1e6).toFixed(1))}m`;
  if (value >= 1000) return `${Number((value / 1000).toFixed(1))}k`;
  return String(value);
}
export function createLocalId() {
  return Date.now();
}
