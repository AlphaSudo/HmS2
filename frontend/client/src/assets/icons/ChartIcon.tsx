import React from 'react';

const ChartIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 64 64"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient1" x1="9" y1="29" x2="75" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f243c3" />
        <stop offset="1" stopColor="#e02209" />
      </linearGradient>
      <linearGradient id="gradient2" x1="9" y1="24" x2="80" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0b0080" />
        <stop offset="1" stopColor="#0b001b" />
      </linearGradient>
      <filter id="dropshadow" x="-.25" y="-.25" width="1.5" height="1.5">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feColorMatrix
          result="bluralpha"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.5 0"
        />
        <feOffset in="bluralpha" dx="4" dy="4" result="offsetBlur" />
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g transform="translate(0,-988.36218)">
      {/* Axes */}
      <path d="M5,992.36218 V1047.3622 H60" stroke="#bfbfbf" strokeWidth="1" />
      {/* Axis Arrows */}
      <path d="M55,1044.3622 l5,3" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M55,1050.3622 l5,-3" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M2,997.36218 l3,-5" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M8,997.36218 l-3,-5" stroke="#bfbfbf" strokeWidth="1" />

      {/* Tick Marks */}
      <path d="M2,1037.3622 h3" stroke="#bfbfbf" strokeWidth="1" />
      {[15, 25, 35, 45].map((x, i) => (
        <path key={i} d={`M${x},1047.3627 V1050.3622`} stroke="#bfbfbf" strokeWidth="1" />
      ))}

      {/* Horizontal Grid Lines */}
      <g filter="url(#dropshadow)">
        {[1007, 1017, 1027].map((y, i) => (
          <path key={i} d={`M2,${y}.3622 h3`} stroke="#bfbfbf" strokeWidth="1" />
        ))}

        {/* Chart Lines */}
        <path
          d="M10,1012.3622 l10,10 10,-15 15,5 15,-15"
          stroke="url(#gradient1)"
          fill="none"
          strokeWidth="2"
        />
        <path
          d="M10,1027.3622 l20,5 10,-10 10,5 10,-5"
          stroke="url(#gradient2)"
          fill="none"
          strokeWidth="2"
        />
      </g>
    </g>
  </svg>
);

export default ChartIcon;
