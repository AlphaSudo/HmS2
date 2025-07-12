import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EgyptFlag from "@/assets/icons/EgyptFlag";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LogOut, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  icon?: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({
  title,
  icon,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define sidebar widths based on the state
  const sidebarWidth = sidebarOpen ? '250px' : '70px';
  const headerHeight = '3rem'; // Corresponds to h-24

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };
  return (
    <header className={cn(
      "h-12 px-8 flex items-center justify-between fixed top-0 z-40 transition-all duration-300 ease-in-out",
      theme === 'dark'
        ? "border-b border-[#5D0A72]/10 bg-[#040223]"
        : "border-b bg-background/80 backdrop-blur-lg"
    )}
    style={{
        [isRTL ? "right" : "left"]: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
        height: headerHeight,
      }}
    >
      {/* Left side: sidebar toggle + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all",
            theme === 'dark' 
              ? 'bg-[#05002E] hover:bg-[#0A004A]/20'
              : 'bg-card hover:bg-muted'
          )}
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg shadow-md",
          theme === 'dark' ? 'bg-[#05002E]' : 'bg-card'
        )}>
          {icon}
        </div>

        <span className={cn(
          "font-semibold text-lg",
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-foreground'
        )}>{title}</span>
      </div>

      {/* Right side: Search, full screen, language toggle, notifications */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative">
          <div className={cn("absolute inset-y-0 flex items-center pointer-events-none", isRTL ? "right-0 pr-4" : "left-0 pl-4")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-5 w-5", theme === 'dark' ? 'text-[#94A3B8]/70' : 'text-muted-foreground')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className={cn(
              "w-72 text-sm py-2.5 rounded-xl focus:outline-none focus:ring-2",
              isRTL ? "pr-12 pl-4" : "pl-12 pr-4",
              theme === 'dark'
                ? 'bg-[#05002E] text-[#94A3B8] placeholder-[#94A3B8]/50 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10'
                : 'bg-card text-foreground placeholder:text-muted-foreground focus:ring-ring border'
            )}
          />
        </div>

        {/* Fullscreen */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className={cn(
            "w-11 h-11 flex items-center justify-center rounded-full border shadow-md transition-colors",
            theme === 'dark'
              ? 'bg-[#05002E] border-[#5D0A72]/10 hover:bg-[#0A004A]/20'
              : 'bg-card border-border hover:bg-muted'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notification */}
        <div className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full border shadow-md",
           theme === 'dark'
            ? 'bg-[#05002E] border-[#5D0A72]/10'
            : 'bg-card border-border'
        )}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>

        {/* Language toggle */}
        <button
          onClick={() => changeLanguage(language === "en" ? "ar" : "en")}
          className={cn(
            "w-11 h-11 flex items-center justify-center rounded-full border shadow-md transition-colors overflow-hidden p-0",
            theme === 'dark'
              ? 'bg-[#05002E] border-[#5D0A72]/10 hover:bg-[#0A004A]/20'
              : 'bg-card border-border hover:bg-muted'
          )}
        >
          {language === "en" ? (
            // UK Flag
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 30"
              className="w-7 h-7"
            >
              <clipPath id="a">
                <path d="M0 0v30h60V0z" />
              </clipPath>
              <clipPath id="b">
                <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
              </clipPath>
              <g clipPath="url(#a)">
                <path d="M0 0v30h60V0z" fill="#012169" />
                <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
                <path
                  d="M0 0l60 30m0-30L0 30"
                  clipPath="url(#b)"
                  stroke="#C8102E"
                  strokeWidth="4"
                />
                <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
                <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
              </g>
            </svg>
          ) : (
            // Egypt Flag
            <EgyptFlag />
          )}
        </button>
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className={cn(
              "flex items-center gap-2 p-1 rounded-xl transition-colors",
              theme === 'dark' ? 'hover:bg-[#05002E]/50' : 'hover:bg-muted'
            )}
          >
            <div className={cn(
              "w-11 h-11 rounded-full overflow-hidden border-2 shadow-xl",
              theme === 'dark' ? 'border-[#5D0A72]/20' : 'border-primary/20'
            )}>
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground', isProfileDropdownOpen ? 'rotate-180' : '')} />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className={cn(
              "absolute mt-2 w-64 rounded-xl shadow-xl border overflow-hidden z-50",
              isRTL ? "left-0" : "right-0",
              theme === 'dark'
                ? 'bg-[#05002E] border-[#5D0A72]/20'
                : 'bg-popover border-border'
            )}>
              {/* User Info Section */}
              <div className={cn("p-4 border-b", theme === 'dark' ? 'border-[#5D0A72]/20' : 'border-border')}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-12 h-12 rounded-full overflow-hidden border-2", theme === 'dark' ? 'border-[#5D0A72]/30' : 'border-primary/30')}>
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="font-semibold">{user?.name || "Sarah Smith"}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('sidebar.role.admin')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  theme === 'dark'
                    ? 'text-[#94A3B8] hover:text-white hover:bg-[#5D0A72]/20'
                    : 'text-popover-foreground hover:bg-accent'
                )}>
                  <User className="w-4 h-4" />
                  <span>{t('navigation.profile')}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    theme === 'dark'
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navigation.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
