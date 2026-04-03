export interface ChapterTheme {
  id: number;
  name: string;
  label: string;
  bg: string;
  accent: string;
  bgVar: string;
  accentVar: string;
  levelStart: number;
  levelEnd: number;
}

export const CHAPTER_THEMES: ChapterTheme[] = [
  {
    id: 1,
    name: "Arctic",
    label: "Chapter 1 · Arctic",
    bg: "oklch(0.18 0.02 255)",
    accent: "oklch(0.76 0.07 210)",
    bgVar: "0.18 0.02 255",
    accentVar: "0.76 0.07 210",
    levelStart: 1,
    levelEnd: 10,
  },
  {
    id: 2,
    name: "Ember",
    label: "Chapter 2 · Ember",
    bg: "oklch(0.16 0.03 30)",
    accent: "oklch(0.75 0.14 35)",
    bgVar: "0.16 0.03 30",
    accentVar: "0.75 0.14 35",
    levelStart: 11,
    levelEnd: 20,
  },
  {
    id: 3,
    name: "Forest",
    label: "Chapter 3 · Forest",
    bg: "oklch(0.15 0.04 150)",
    accent: "oklch(0.72 0.13 145)",
    bgVar: "0.15 0.04 150",
    accentVar: "0.72 0.13 145",
    levelStart: 21,
    levelEnd: 30,
  },
  {
    id: 4,
    name: "Dusk",
    label: "Chapter 4 · Dusk",
    bg: "oklch(0.15 0.04 290)",
    accent: "oklch(0.72 0.14 285)",
    bgVar: "0.15 0.04 290",
    accentVar: "0.72 0.14 285",
    levelStart: 31,
    levelEnd: 40,
  },
  {
    id: 5,
    name: "Crimson",
    label: "Chapter 5 · Crimson",
    bg: "oklch(0.15 0.04 10)",
    accent: "oklch(0.72 0.16 8)",
    bgVar: "0.15 0.04 10",
    accentVar: "0.72 0.16 8",
    levelStart: 41,
    levelEnd: 50,
  },
];

export function getChapterForLevel(levelIndex: number): ChapterTheme {
  const levelNumber = levelIndex + 1;
  return (
    CHAPTER_THEMES.find(
      (c) => levelNumber >= c.levelStart && levelNumber <= c.levelEnd,
    ) ?? CHAPTER_THEMES[0]
  );
}
