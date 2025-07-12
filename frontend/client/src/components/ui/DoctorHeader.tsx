import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Bell, Mail, Maximize2, Menu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DoctorHeaderProps {
  onMenuClick?: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DoctorHeader({
  onMenuClick,
  title,
  subtitle,
  icon,
  actions,
}: DoctorHeaderProps) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <header
      className={cn(
        "bg-transparent p-6 flex items-center justify-between",
        theme === "dark"
          ? "border-b border-teal-500/20"
          : "border-b border-gray-200"
      )}
    >
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className={cn(
              "md:hidden transition-colors",
              theme === "dark" 
                ? "text-gray-300 hover:text-white" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                theme === "dark"
                  ? "bg-teal-500/20 border border-teal-500/30"
                  : "bg-primary/10"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h1 className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-gray-300" : "text-gray-500"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <ThemeToggle />
        <LanguageToggle />
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            theme === "dark" 
              ? "text-gray-300 hover:text-white hover:bg-white/10" 
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            theme === "dark" 
              ? "text-gray-300 hover:text-white hover:bg-white/10" 
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Mail className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            theme === "dark" 
              ? "text-gray-300 hover:text-white hover:bg-white/10" 
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
} 