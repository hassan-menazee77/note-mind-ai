import React from 'react';

interface NoteMindLogoProps {
  className?: string;
  size?: number;
}

export const NoteMindLogo: React.FC<NoteMindLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      {/* Outer Glow / Shadow layer */}
      <defs>
        <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="purpleGradient" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="cyanGradient" x1="38" y1="38" x2="62" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Hexagon wireframe/cube background lines for depth */}
      <g stroke="#6b21a8" strokeWidth="2" strokeOpacity="0.4">
        {/* Diagonals forming the isometric Cube */}
        <line x1="50" y1="50" x2="50" y2="15" />
        <line x1="50" y1="50" x2="80" y2="32.5" />
        <line x1="50" y1="50" x2="80" y2="67.5" />
        <line x1="50" y1="50" x2="50" y2="85" />
        <line x1="50" y1="50" x2="20" y2="67.5" />
        <line x1="50" y1="50" x2="20" y2="32.5" />
      </g>

      {/* Outer Hexagon outline */}
      <polygon 
        points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" 
        stroke="url(#purpleGradient)" 
        strokeWidth="6" 
        strokeLinejoin="round" 
        className="drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
      />

      {/* Futuristic Stylized M Logo Icon */}
      {/* 1. Styled Central Chevron ^ in white */}
      <path 
        d="M 38,47 L 50,38 L 62,47" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 43,45 L 50,40 L 57,45" 
        stroke="#22d3ee" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 2. Left Seriffed Column [ */}
      <path 
        d="M 34,44 L 38,44 M 36,44 L 36,56 M 34,56 L 38,56" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 36,44 L 46,54" 
        stroke="#7c3aed" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeOpacity="0.8"
      />

      {/* 3. Right Seriffed Column ] */}
      <path 
        d="M 62,44 L 66,44 M 64,44 L 64,56 M 62,56 L 66,56" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 64,44 L 54,54" 
        stroke="#7c3aed" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeOpacity="0.8"
      />

      {/* 4. Center Glow Dot and base anchor */}
      <circle cx="50" cy="56" r="3" fill="#22d3ee" className="animate-pulse" />
      <line x1="50" y1="56" x2="50" y2="65" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
