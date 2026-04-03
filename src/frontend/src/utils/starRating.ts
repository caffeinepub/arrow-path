const STORAGE_KEY = "waymark_stars";

export type StarCount = 1 | 2 | 3;

export function calcStars(arrowsUsed: number, totalArrows: number): StarCount {
  if (totalArrows === 0) return 1;
  const ratio = arrowsUsed / totalArrows;
  if (ratio <= 0.5) return 3;
  if (ratio <= 0.8) return 2;
  return 1;
}

export function loadStars(): Record<string, StarCount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StarCount>;
  } catch {
    return {};
  }
}

export function saveStar(levelId: string, stars: StarCount): void {
  const existing = loadStars();
  const prev = existing[levelId] ?? 0;
  if (stars > prev) {
    existing[levelId] = stars;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}
