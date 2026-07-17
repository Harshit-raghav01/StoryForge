'use client';

/** WaxSealIcon — The signature StoryForge motif: a wax seal with "S" monogram.
 *  Used on coin/wallet icons, unlock buttons, and as a brand mark. */
export function WaxSealIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="StoryForge wax seal"
    >
      {/* Outer seal shape — irregular wax blob */}
      <path
        d="M32 2C36.5 2 40.8 4.2 43.5 6.8C46.2 4.8 50.5 4 54 6C57.5 8 59 12.5 58.5 16C61.5 18 63 22 62 26C63.2 30 62.5 34 60 37C62 40.5 61.5 45 59 48C56.5 51 53 52.5 50 52C48.5 55.5 45.5 58 42 59.5C38.5 61 35 61 32 62C29 61 25.5 61 22 59.5C18.5 58 15.5 55.5 14 52C11 52.5 7.5 51 5 48C2.5 45 2 40.5 4 37C1.5 34 0.8 30 2 26C1 22 2.5 18 5.5 16C5 12.5 6.5 8 10 6C13.5 4 17.8 4.8 20.5 6.8C23.2 4.2 27.5 2 32 2Z"
        fill="var(--color-accent)"
        stroke="var(--color-accent)"
        strokeWidth="0.5"
      />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* "I" monogram */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="28"
        fontWeight="600"
        fill="white"
        style={{ letterSpacing: '1px' }}
      >
        I
      </text>
    </svg>
  );
}

/** Smaller coin variant for inline use */
export function CoinIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Coin"
    >
      <circle cx="12" cy="12" r="11" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fontWeight="600" fill="white">I</text>
    </svg>
  );
}
