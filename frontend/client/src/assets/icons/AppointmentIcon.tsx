import React from 'react';

interface AppointmentIconProps {
  className?: string;
}

const AppointmentIcon: React.FC<AppointmentIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Background */}
    <rect width="64" height="64" fill="#ffffff" />

    {/* Calendar Body */}
    <rect x="8" y="12" width="48" height="40" rx="4" ry="4" fill="#50E3C2" />

    {/* Header */}
    <rect x="8" y="12" width="48" height="10" fill="#4A90E2" />

    {/* Calendar Rings */}
    <circle cx="20" cy="10" r="2" fill="#ffffff" />
    <circle cx="44" cy="10" r="2" fill="#ffffff" />

    {/* Clock */}
    <circle cx="32" cy="36" r="10" fill="#F8E71C" stroke="#333" strokeWidth="2" />
    <line x1="32" y1="36" x2="32" y2="30" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="36" x2="36" y2="36" stroke="#333" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default AppointmentIcon;
