import type { ArrowDir } from "../../types/game";

interface ArrowIconProps {
  direction: ArrowDir;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ArrowIcon({
  direction,
  size = 24,
  className = "",
  style,
}: ArrowIconProps) {
  const paths: Record<ArrowDir, string> = {
    up: "M12 4l-8 8h5v8h6v-8h5z",
    down: "M12 20l8-8h-5V4H9v8H4z",
    left: "M4 12l8-8v5h8v6h-8v5z",
    right: "M20 12l-8 8v-5H4V9h8V4z",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={paths[direction]} />
    </svg>
  );
}
