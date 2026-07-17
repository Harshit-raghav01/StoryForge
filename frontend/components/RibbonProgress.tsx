'use client';

import { motion } from 'framer-motion';

/** RibbonProgress — Signature bookmark ribbon that shows reading progress.
 *  Used on book cards, reader view, and library. */
export function RibbonProgress({
  progress,
  height = 120,
  className = '',
}: {
  progress: number; // 0 to 1
  height?: number;
  className?: string;
}) {
  const fillHeight = height * Math.min(Math.max(progress, 0), 1);
  const pct = Math.round(progress * 100);

  return (
    <div className={`relative ${className}`} style={{ width: 28, height }} aria-label={`${pct}% read`}>
      {/* Ribbon body */}
      <svg width="28" height={height} viewBox={`0 0 28 ${height}`} fill="none">
        {/* Background ribbon */}
        <path
          d={`M4 0 H24 V${height - 12} L14 ${height - 4} L4 ${height - 12} Z`}
          fill="var(--border)"
          opacity="0.5"
        />
        {/* Filled progress */}
        <clipPath id={`ribbon-clip-${pct}`}>
          <path d={`M4 0 H24 V${height - 12} L14 ${height - 4} L4 ${height - 12} Z`} />
        </clipPath>
        <motion.rect
          x="4"
          y={height - fillHeight}
          width="20"
          height={fillHeight}
          fill="var(--color-accent)"
          clipPath={`url(#ribbon-clip-${pct})`}
          initial={{ height: 0, y: height }}
          animate={{ height: fillHeight, y: height - fillHeight }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {/* Percentage label */}
      {progress > 0 && (
        <span
          className="absolute left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-white"
          style={{ top: Math.max(height - fillHeight + 4, 4) }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}
