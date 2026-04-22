export function stableScore(seed = '') {
  const text = String(seed);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 100);
}

export function stableCount(seed = '', min = 1, max = 20) {
  const span = max - min + 1;
  return min + (stableScore(seed) % span);
}
