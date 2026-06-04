export type ThemeColor = {
  bar: string;
  bg: string;
  tag: string;
  tagText: string;
};

export const THEME_PALETTE: ThemeColor[] = [
  {
    bar: "var(--blue-500)",
    bg: "var(--blue-50)",
    tag: "var(--blue-100)",
    tagText: "var(--blue-600)",
  },
  {
    bar: "#7c3aed",
    bg: "#f5f3ff",
    tag: "#ede9fe",
    tagText: "#6d28d9",
  },
  {
    bar: "#0891b2",
    bg: "#ecfeff",
    tag: "#cffafe",
    tagText: "#0e7490",
  },
  {
    bar: "#db2777",
    bg: "#fdf2f8",
    tag: "#fce7f3",
    tagText: "#be185d",
  },
  {
    bar: "#d97706",
    bg: "#fffbeb",
    tag: "#fef3c7",
    tagText: "#b45309",
  },
  {
    bar: "var(--green)",
    bg: "var(--green-bg)",
    tag: "#dcfce7",
    tagText: "#15803d",
  },
];

export function getThemeColor(index: number): ThemeColor {
  return THEME_PALETTE[index % THEME_PALETTE.length];
}

export function getThemeColorMap(themeIds: string[]): Record<string, ThemeColor> {
  return Object.fromEntries(
    themeIds.map((id, index) => [id, getThemeColor(index)])
  );
}
