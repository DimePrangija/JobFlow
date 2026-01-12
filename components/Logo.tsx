"use client";

import { useId } from "react";

export default function Logo({ className }: { className?: string }) {
  const gradientId = useId();
  
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
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#A855F7" }} />
          <stop offset="50%" style={{ stopColor: "#3B82F6" }} />
          <stop offset="100%" style={{ stopColor: "#22C55E" }} />
        </linearGradient>
      </defs>

      <text 
        x="5" 
        y="42" 
        fontFamily="Arial, Helvetica, sans-serif" 
        fontWeight="bold" 
        fontSize="38" 
        fill={`url(#${gradientId})`}
        letterSpacing="-0.5"
      >
        JobFlow
      </text>

      <g transform="translate(165, 8)">
        <circle cx="0" cy="20" r="3.5" fill="#22C55E" />
        <circle cx="14" cy="5" r="3.5" fill="#22C55E" />
        <circle cx="24" cy="24" r="3.5" fill="#22C55E" />
        
        <line x1="0" y1="20" x2="14" y2="5" stroke="#22C55E" strokeWidth="2" />
        <line x1="14" y1="5" x2="24" y2="24" stroke="#22C55E" strokeWidth="2" />
        <line x1="0" y1="20" x2="24" y2="24" stroke="#22C55E" strokeWidth="2" />
      </g>
    </svg>
  );
}
