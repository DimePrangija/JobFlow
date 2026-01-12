export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      width="220" 
      height="60" 
      viewBox="0 0 220 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#A855F7" }} />
          <stop offset="50%" style={{ stopColor: "#3B82F6" }} />
          <stop offset="100%" style={{ stopColor: "#22C55E" }} />
        </linearGradient>
      </defs>

      <text 
        x="0" 
        y="45" 
        fontFamily="Arial, Helvetica, sans-serif" 
        fontWeight="bold" 
        fontSize="42" 
        fill="url(#logoGradient)" 
        letterSpacing="-1"
      >
        JobFlow
      </text>

      <g transform="translate(170, 10)">
        <circle cx="0" cy="20" r="4" fill="#22C55E" />
        <circle cx="15" cy="5" r="4" fill="#22C55E" />
        <circle cx="25" cy="25" r="4" fill="#22C55E" />
        
        <line x1="0" y1="20" x2="15" y2="5" stroke="#22C55E" strokeWidth="2.5" />
        <line x1="15" y1="5" x2="25" y2="25" stroke="#22C55E" strokeWidth="2.5" />
        <line x1="0" y1="20" x2="25" y2="25" stroke="#22C55E" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
