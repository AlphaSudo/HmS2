import { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/utils/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import  DoctorWhiteCoatIcon  from '@/assets/icons/DoctorWhiteCoatIcon.tsx';
import AppointmentsIcon from '@/assets/icons/AppointmentIcon.tsx';
import ReportIcon from '@/assets/icons/ReportIcon.tsx';
import PatientIcon from '@/assets/icons/PatientIcon.tsx';
import ChartIcon from '@/assets/icons/ChartIcon.tsx';
import {AppWindowIcon, LogOut}  from "lucide-react";
import PrescriptionIcon from '@/assets/icons/PrescriptionIcon.tsx';
import BillingIcon from '@/assets/icons/BillingIcon.tsx';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  subItems?: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  

  // Define a compact width for icons-only mode
  const sidebarWidth = isOpen ? 'w-[250px]' : 'w-[70px]';
  const [location] = useLocation();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  const navigationItems: NavigationItem[] = [
    
    {
      name: t('navigation.dashboard'),
      path: "/admin/dashboard",
      icon: (
       <ChartIcon/>
      ),
    },
    {
      name: t('navigation.appointments'),
      path: "/admin/appointments",
      icon: (
        <AppointmentsIcon className="h-8 w-8"/>
      ),
    },
    {
      name: t('navigation.doctors'),
      path: "/admin/doctors",
      icon: (
       <DoctorWhiteCoatIcon         className="h-8 w-8"  />
      ),
    },
    {
      name: t('navigation.patients'),
      path: "/admin/patients",
      icon: (
        <PatientIcon className="h-8 w-8"/>
      ),
    },
    {
      name: t('navigation.prescriptions'),
      path: "/admin/prescriptions",
      icon: (
        <PrescriptionIcon className="h-8 w-8"/>
      ),
    },
    {
      name: t('navigation.billing'),
      path: "/admin/billing",
      icon: (
        <BillingIcon className="h-8 w-8"/>
      ),
    },


  ];

  return (
    <div
      className={cn(
        `${sidebarWidth} flex-shrink-0 flex flex-col h-full relative transition-all duration-300 overflow-hidden`,
        theme === 'dark' ? '' : 'bg-card'
      )}
      style={
        theme === 'dark'
          ? {
              background: [
                `linear-gradient(to ${isRTL ? 'left' : 'right'}, #040223 0%, #040223 75%, #060E40 100%)`,
                `linear-gradient(to ${isRTL ? 'left' : 'right'}, transparent 0%, transparent 192px, rgba(10, 31, 118, 1) 194px, rgba(10, 31, 118, 1) 200px)`,
              ].join(', '),
              backgroundClip: 'padding-box',
              backgroundOrigin: 'padding-box',
              borderImage: 'linear-gradient(to bottom, #490791, #0B1B69) 1',
              ...(isRTL ? { borderLeft: '1px solid' } : { borderRight: '1px solid' }),
            }
          : isRTL
            ? { borderLeft: '1px solid hsl(var(--border))' }
            : { borderRight: '1px solid hsl(var(--border))' }
      }
    >
      {/* Logo - Full Version */}
      {isOpen && (
        <div className="pt-8 pb-6 px-6 flex items-center transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <div className={cn(
              "rounded-md p-1.5 w-9 h-9 flex items-center justify-center shadow-lg",
              theme === 'dark' ? 'gradient-bg-purple' : 'bg-primary'
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className={cn(
              "text-xl font-bold tracking-tight",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              {t('landing.brandName')}
            </span>
          </div>
        </div>
      )}
      
      {/* Logo - Icon Only Version */}
      {!isOpen && (
        <div className="pt-8 pb-6 flex justify-center items-center transition-opacity duration-300">
          <div className={cn(
            "rounded-md p-1.5 w-9 h-9 flex items-center justify-center shadow-lg",
            theme === 'dark' ? 'gradient-bg-purple' : 'bg-primary'
          )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className={`px-6 py-4 flex flex-col items-center mb-8 ${!isOpen ? 'opacity-0 overflow-hidden' : 'opacity-100'} transition-opacity duration-300`}>
        <div className={cn(
          "w-[90px] h-[90px] rounded-full overflow-hidden mb-3 border-2 shadow-xl",
          theme === 'dark' ? 'border-[#5D0A72]/30' : 'border-primary/30'
        )}>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className={cn("text-lg font-semibold mt-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>Sarah Smith</h3>
        <p className={cn("text-sm", theme === 'dark' ? 'text-[#94A3B8]/80' : 'text-muted-foreground')}>
          {t('sidebar.role.admin')}
        </p>
      </div>

      {/* Navigation - Full Version */}
      {isOpen && (
        <div className="flex-1 flex flex-col gap-2 px-5 transition-opacity duration-300 overflow-y-scroll ">
          <style>
            {`
              div::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}
          </style>
          {navigationItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <span
                  onClick={() => setOpenItem(openItem === item.name ? null : item.name)}
                  className={cn(
                    "py-3.5 px-4 flex items-center gap-3.5 rounded-xl transition cursor-pointer",
                    theme === 'dark' 
                      ? "hover:bg-[#5D0A72]/20"
                      : "hover:bg-muted",
                    openItem === item.name && (theme === 'dark' ? "active-nav" : ""),
                  )}
                >
                  <span
                    className={cn(
                      theme === 'dark' 
                        ? (openItem === item.name ? "text-[#FF8AFF]" : "text-gray-300")
                        : (openItem === item.name ? "text-primary" : "text-muted-foreground"),
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "font-medium text-sm",
                       theme === 'dark' 
                        ? (openItem === item.name ? "text-[#FF8AFF]" : "text-[#FDFEFB]")
                        : (openItem === item.name ? "text-primary" : "text-foreground")
                    )}
                  >
                    {item.name}
                  </span>
                </span>
              ) : (
                <Link href={item.path}>
                  <span
                     className={cn(
                      "py-3.5 px-4 flex items-center gap-3.5 rounded-xl transition cursor-pointer",
                      theme === 'dark' 
                        ? "hover:bg-[#5D0A72]/20"
                        : "hover:bg-muted",
                      location === item.path && (theme === 'dark' ? "active-nav" : "bg-primary text-primary-foreground hover:bg-primary/90"),
                    )}
                  >
                    <span
                      className={cn(
                        theme === 'dark'
                          ? (location === item.path ? "text-[#FF8AFF]" : "text-gray-300")
                          : (location === item.path ? "text-primary-foreground" : "text-muted-foreground")
                      )}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={cn(
                        "font-medium text-sm",
                        theme === 'dark'
                          ? (location === item.path ? "text-[#FF8AFF]" : "text-[#FDFEFB]")
                          : (location === item.path ? "text-primary-foreground" : "text-foreground")
                      )}
                    >
                      {item.name}
                    </span>
                  </span>
                </Link>
              )}
              {item.subItems && openItem === item.name && (
                <div className={cn("pl-8", isRTL && "pl-0 pr-8")}>
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.name} href={subItem.path}>
                      <span
                        className={cn(
                          "py-3.5 px-4 flex items-center gap-3.5 rounded-xl transition cursor-pointer",
                          theme === 'dark' 
                            ? "hover:bg-[#5D0A72]/20"
                            : "hover:bg-muted",
                          location === subItem.path && (theme === 'dark' ? "active-nav" : "bg-primary text-primary-foreground hover:bg-primary/90")
                        )}
                      >
                        <span
                          className={cn(
                            "font-medium text-sm",
                            theme === 'dark'
                              ? (location === subItem.path ? "text-[#FF8AFF]" : "text-[#FDFEFB]")
                              : (location === subItem.path ? "text-primary-foreground" : "text-foreground")
                          )}
                        >
                          {subItem.name}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
  
          
        </div>
      )}
      
      {/* Navigation - Icons Only Version */}
      {!isOpen && (
        <div className="flex-1 flex flex-col gap-4 items-center pt-8 transition-opacity duration-300">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <span
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl transition cursor-pointer",
                   theme === 'dark' 
                    ? "hover:bg-[#5D0A72]/20"
                    : "hover:bg-muted",
                   location === item.path && (theme === 'dark' ? "active-nav-icon" : "bg-primary text-primary-foreground hover:bg-primary/90"),
                )}
              >
                <span
                  className={cn(
                    theme === 'dark'
                      ? (location === item.path ? "text-[#5D0A72]" : "text-gray-300")
                      : (location === item.path ? "text-primary-foreground" : "text-muted-foreground")
                  )}
                >
                  {item.icon}
                </span>
              </span>
            </Link>
          ))}
  
          <div 
            className={cn(
              "mt-auto mb-8 w-12 h-12 flex items-center justify-center rounded-xl transition cursor-pointer",
              theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-500/10'
            )}
            onClick={handleLogout}
          >
             <LogOut className={cn("h-5 w-5", theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600')} />
          </div>
        </div>
      )}

      {/* Logout Section - Full Version */}
      {isOpen && (
        <div className="px-5 py-4 border-t border-[#5D0A72]/20">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full py-3.5 px-4 flex items-center gap-3.5 rounded-xl transition cursor-pointer",
              isRTL && "flex-row-reverse",
              theme === 'dark' 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
            )}
          >
            <LogOut className={cn("h-6 w-6", isRTL ? 'ml-3' : 'mr-3')} />
            {isOpen && <span className="font-semibold text-lg">{t('sidebar.logout')}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
