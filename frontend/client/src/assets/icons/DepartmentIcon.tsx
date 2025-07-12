import React from 'react';

interface DepartmentIconProps {
  className?: string;
}

const DepartmentIcon: React.FC<DepartmentIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <rect width="64" height="64" fill="#ffffff" />
    <rect x="8" y="8" width="48" height="48" rx="4" ry="4" fill="#4A90E2" />
    <rect x="16" y="16" width="8" height="8" fill="#ffffff" />
    <rect x="28" y="16" width="8" height="8" fill="#ffffff" />
    <rect x="40" y="16" width="8" height="8" fill="#ffffff" />
    <rect x="16" y="28" width="8" height="8" fill="#ffffff" />
    <rect x="28" y="28" width="8" height="8" fill="#ffffff" />
    <rect x="40" y="28" width="8" height="8" fill="#ffffff" />
    <rect x="24" y="40" width="16" height="12" fill="#F5A623" />
  </svg>
);

export default DepartmentIcon;
