import { ReactNode } from "react";
import { cn } from "@/utils/utils";
import { useTheme } from "@/contexts/ThemeContext";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient:
    | "purple"
    | "orange"
    | "blue"
    | "purple-dark"
    | "green"
    | "red"
    | "teal"
    | "pink";
  className?: string;
  extras?: ReactNode;
}

export function DashboardCard({
  title,
  value,
  icon,
  gradient,
  className,
  extras,
}: DashboardCardProps) {
  const { theme } = useTheme();
  const gradientClasses = {
    purple:
      "bg-[radial-gradient(at_bottom_right,_#0B0033_30%,_#11013A_45%,_#35024C_65%,_#9F0558_100%)]",
    orange:
      "bg-[radial-gradient(at_bottom_right,_#0F022A_30%,_#2E0A27_55%,_#521523_70%,_#C53414_100%)]",
    blue: "bg-[radial-gradient(at_bottom_right,_#04063D_55%,_#04296D_100%)]",
    "purple-dark":
      "p-[1px] rounded-2xl bg-[conic-gradient(#b10170,#51025d_45deg,#8f0946_90deg,#971385_135deg,#2d016f_180deg,#1a026a_225deg,#850d9e_270deg,#fb0aa3_315deg,#b10170_360deg)]",
    green:
      "bg-[radial-gradient(at_bottom_right,_#022A16_30%,_#0A2E1A_55%,_#155223_70%,_#14C56A_100%)]",
    red: "bg-[radial-gradient(at_bottom_right,_#2A0202_30%,_#2E0A0A_55%,_#521515_70%,_#C51414_100%)]",
    teal: "bg-[radial-gradient(at_bottom_right,_#022A29_30%,_#0A2E2D_55%,_#155251_70%,_#14C5C2_100%)]",
    pink: "bg-[radial-gradient(at_bottom_right,_#2A0225_30%,_#2E0A2A_55%,_#52154B_70%,_#C514B3_100%)]",
  };

  const borderClasses = {
    purple:
      "p-[1px] rounded-2xl bg-[conic-gradient(#b10170,#51025d_45deg,#8f0946_90deg,#971385_135deg,#2d016f_180deg,#1a026a_225deg,#850d9e_270deg,#fb0aa3_315deg,#b10170_360deg)]",
    /*----------------*/
    orange:
      "p-[1px] rounded-2xl bg-[conic-gradient(#d44317,#731d21_45deg,#be2d14_90deg,#be3816_135deg,#91231a_180deg,#712327_225deg,#f3480a_270deg,#ffa715_315deg,#d44317_360deg)]",
    /*----------------*/
    blue: "p-[1px] rounded-2xl bg-[conic-gradient(#072f93,#03115e_45deg,#031b78_90deg,#0f42c1_135deg,#021a70_180deg,#031a63_225deg,#0a70d2_270deg,#0e82ea_315deg,#072f93_360deg)]",
    // Add the missing key, reusing the purple border for now
    "purple-dark":
      "p-[1px] rounded-2xl bg-[conic-gradient(#b10170,#51025d_45deg,#8f0946_90deg,#971385_135deg,#2d016f_180deg,#1a026a_225deg,#850d9e_270deg,#fb0aa3_315deg,#b10170_360deg)]",
    green:
      "p-[1px] rounded-2xl bg-[conic-gradient(#14C56A,#155223_45deg,#0A2E1A_90deg,#022A16_135deg,#155223_180deg,#0A2E1A_225deg,#14C56A_270deg,#155223_315deg,#14C56A_360deg)]",
    red: "p-[1px] rounded-2xl bg-[conic-gradient(#C51414,#521515_45deg,#2E0A0A_90deg,#2A0202_135deg,#521515_180deg,#2E0A0A_225deg,#C51414_270deg,#521515_315deg,#C51414_360deg)]",
    teal: "p-[1px] rounded-2xl bg-[conic-gradient(#14C5C2,#155251_45deg,#0A2E2D_90deg,#022A29_135deg,#155251_180deg,#0A2E2D_225deg,#14C5C2_270deg,#155251_315deg,#14C5C2_360deg)]",
    pink: "p-[1px] rounded-2xl bg-[conic-gradient(#C514B3,#52154B_45deg,#2E0A2A_90deg,#2A0225_135deg,#52154B_180deg,#2E0A2A_225deg,#C514B3_270deg,#52154B_315deg,#C514B3_360deg)]",
  };

  return (
    <div
      className={cn(
        theme === 'dark' ? borderClasses[gradient] : 'bg-card border rounded-2xl',
        "grid",
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-7 relative overflow-hidden flex flex-col min-h-[170px] shadow-lg",
          theme === 'dark' ? gradientClasses[gradient] : 'bg-card',
          className,
        )}
      >
        <div className={cn(
          "absolute top-7 right-7 w-11 h-11 flex items-center justify-center rounded-xl backdrop-blur-sm shadow-inner",
          theme === 'dark' ? 'bg-white/20' : 'bg-primary/10'
        )}>
          {icon}
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="mb-auto pt-12">{extras && <div>{extras}</div>}</div>

          <div>
            <h2 className={cn(
              "text-[42px] font-bold leading-tight tracking-tight",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              {value}
            </h2>
            <p className={cn(
              "mt-1 font-medium text-sm",
              theme === 'dark' ? 'text-white/80' : 'text-muted-foreground'
            )}>{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
