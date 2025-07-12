
import React from 'react';

const ScalpelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0-2.1 10 4 4 0 0 1-6 3.9 21.3 21.3 0 0 0-6.6-8.1A6 6 0 0 1 8.7 3z" />
    <path d="m15 8 2 2" />
    <path d="M12 10.8 9 14" />
  </svg>
);

export default ScalpelIcon;
