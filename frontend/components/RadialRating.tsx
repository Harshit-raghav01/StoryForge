'use client';

/** RadialRating — compact arc meter for ratings (1-10), anti-clone vs plain bar list */
export function RadialRating({
  rating,
  count,
  size = 88,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  const pct = rating / 10;
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Arc from 135° to 45° (270° sweep)
  const startAngle = 135;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle * pct;

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const start = polarToXY(startAngle, r);
  const end = polarToXY(endAngle, r);
  const largeArc = sweepAngle * pct > 180 ? 1 : 0;

  const trackStart = polarToXY(startAngle, r);
  const trackEnd = polarToXY(startAngle + sweepAngle, r);

  return (
    <div className="flex flex-col items-center gap-1" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0 && (
          <path
            d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={size > 70 ? "18" : "14"}
          fontWeight="700"
          fill="var(--text-primary)"
        >
          {rating.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontFamily="var(--font-body)"
          fontSize="9"
          fill="var(--text-secondary)"
        >
          / 10
        </text>
      </svg>
      {count !== undefined && (
        <span className="text-xs font-mono text-text-secondary tabular-nums">{count.toLocaleString()} ratings</span>
      )}
    </div>
  );
}
