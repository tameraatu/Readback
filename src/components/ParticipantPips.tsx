type Props = {
  count: number;
  maxVisible?: number;
  size?: "sm" | "md";
};

const PIP_COLORS = [
  "var(--blue-400)",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#d97706",
  "var(--green)",
];

export function ParticipantPips({
  count,
  maxVisible = 4,
  size = "md",
}: Props) {
  const visible = Math.min(count, maxVisible);
  const overflow = count - visible;

  if (count === 0) return null;

  return (
    <div
      className={`participant-pips participant-pips--${size}`}
      aria-label={`${count} participant${count === 1 ? "" : "s"}`}
    >
      <div className="participant-pips__avatars">
        {Array.from({ length: visible }, (_, i) => (
          <span
            key={i}
            className="participant-pips__pip"
            style={{ background: PIP_COLORS[i % PIP_COLORS.length] }}
            aria-hidden
          />
        ))}
      </div>
      <span className="participant-pips__count">
        {count} participant{count === 1 ? "" : "s"}
      </span>
      {overflow > 0 && (
        <span className="participant-pips__overflow">+{overflow}</span>
      )}
    </div>
  );
}
