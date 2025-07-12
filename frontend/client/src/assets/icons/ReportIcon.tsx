import React from 'react';

interface SvgIconProps {
  className?: string;
}

const ReportIcon: React.FC<SvgIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="19"
      height="24"
      className={className}
    >
      <path
        style={{
          opacity: 0.97,
          fill: '#104667',
          fillOpacity: 1,
          fillRule: 'nonzero',
          stroke: 'none',
        }}
        d="M 0,0 0,24 19,24 19,5.03125 13.96875,0 0,0 z M 1.96875,1.96875 12,1.96875 12,7 l 4.96875,0 0,15.03125 -15,0 0,-20.0625 z M 4,11 l 0,1 11,0 0,-1 -11,0 z m -0.03125,1.96875 0,1 11.03125,0 0,-1 -11.03125,0 z m 0,2.03125 0,1 L 15,16 15,15 3.96875,15 z m 0,2 0,0.96875 11.03125,0 L 15,17 3.96875,17 z m 0,1.96875 0,1 11.03125,0 0,-1 -11.03125,0 z"
        id="rect3027"
      />
    </svg>
  );
};

export default ReportIcon;
