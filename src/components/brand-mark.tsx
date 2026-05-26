export function BrandMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="brand-accent" x1="90" y1="86" x2="424" y2="426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C8FF4D" />
          <stop offset="0.48" stopColor="#20DDB1" />
          <stop offset="1" stopColor="#6E8BFF" />
        </linearGradient>
        <radialGradient
          id="brand-soft"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(252 238) rotate(90) scale(235)"
        >
          <stop stopColor="#18332D" />
          <stop offset="1" stopColor="#05070A" />
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#brand-soft)" />
      <rect x="35" y="35" width="442" height="442" rx="94" stroke="url(#brand-accent)" strokeWidth="10" opacity="0.95" />
      <path d="M116 252h280" stroke="#F7FFF7" strokeWidth="34" strokeLinecap="round" />
      <path d="M100 200v104" stroke="url(#brand-accent)" strokeWidth="38" strokeLinecap="round" />
      <path d="M150 180v144" stroke="#F7FFF7" strokeWidth="34" strokeLinecap="round" />
      <path d="M362 180v144" stroke="#F7FFF7" strokeWidth="34" strokeLinecap="round" />
      <path d="M412 200v104" stroke="url(#brand-accent)" strokeWidth="38" strokeLinecap="round" />
      <path
        d="M206 334h42l27-64 35 112 28-48h52"
        stroke="url(#brand-accent)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M224 158l32-34 32 34" stroke="#F7FFF7" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
