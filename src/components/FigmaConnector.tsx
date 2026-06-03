"use client";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function FigmaConnector({ value, onChange }: Props) {
  return (
    <input
      type="url"
      className="new-project__input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://www.figma.com/design/…"
      autoComplete="off"
    />
  );
}
