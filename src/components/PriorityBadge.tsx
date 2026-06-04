import type { Recommendation } from "@/types";

type Props = {
  priority: Recommendation["priority"];
  className?: string;
};

const CLASS: Record<Recommendation["priority"], string> = {
  high: "priority-badge--high",
  medium: "priority-badge--medium",
  low: "priority-badge--low",
};

export function PriorityBadge({ priority, className = "" }: Props) {
  return (
    <span className={`priority-badge ${CLASS[priority]} ${className}`.trim()}>
      {priority} priority
    </span>
  );
}
