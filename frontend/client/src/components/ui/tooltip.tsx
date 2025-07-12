import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const tooltipClass = `
    absolute z-50 px-3 py-1.5 text-sm font-medium rounded-md shadow-lg
    transition-opacity duration-300 pointer-events-none
    ${isVisible ? 'opacity-100' : 'opacity-0'}
    ${theme === 'dark' ? 'bg-popover text-popover-foreground' : 'bg-popover text-popover-foreground'}
    ${positionClasses[position]}
  `;

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={tooltipClass} role="tooltip">
          {content}
          <div
            className={`absolute w-2 h-2 transform rotate-45 ${theme === 'dark' ? 'bg-popover' : 'bg-popover'}`}
            style={{
              ...(position === 'top' ? { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' } : {}),
              ...(position === 'bottom' ? { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' } : {}),
              ...(position === 'left' ? { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' } : {}),
              ...(position === 'right' ? { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' } : {}),
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 