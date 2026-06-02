import type { Theme } from "@/types";

type Props = {
  theme: Theme;
};

export function ThemeTag({ theme }: Props) {
  return (
    <span>
      {theme.label}
    </span>
  );
}
