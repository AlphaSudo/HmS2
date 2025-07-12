import React from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  onClick: () => void;
  label: string; // For aria-label
  tooltip: string;
  children: React.ReactNode; // For the SVG icon
  className?: string; // Allow custom styling overrides/additions
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  tooltip,
  children,
  className,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const baseStyle = "relative p-2 rounded-lg transition-colors border group disabled:opacity-50 disabled:cursor-not-allowed";
  const tooltipStyle = "absolute invisible group-hover:visible bg-[hsl(var(--primary))] text-white text-xs px-2 py-1 rounded-lg -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50";

  const defaultClasses = theme === "dark"
    ? "bg-[#05002E] text-[#94A3B8] hover:bg-[#0A004A]/20 border-[#5D0A72]/10"
    : "bg-[hsl(var(--table-header-bg))] text-[hsl(var(--table-text))] hover:bg-[hsl(var(--table-row-even))] border-[hsl(var(--table-border))]";

  const combinedClasses = cn(baseStyle, className ? className : defaultClasses);

  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      aria-label={label}
      disabled={disabled}
    >
      <span className={tooltipStyle}>{tooltip}</span>
      {children}
    </button>
  );
};

export default ActionButton;