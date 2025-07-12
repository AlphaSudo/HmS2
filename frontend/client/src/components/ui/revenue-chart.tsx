import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart } from './bar-chart';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface RevenueChartProps {
  percentage: number;
  barData: number[];
}

export function RevenueChart({ percentage, barData }: RevenueChartProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const pieData = [
    { name: 'Revenue', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  return (
    <div className={cn(
      "rounded-2xl p-7 h-full",
      theme === 'dark'
        ? "bg-[#05002E] card-glow border border-[#5D0A72]/10"
        : "bg-card border shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-8">
        <h3 className={cn(
          "font-bold text-xl tracking-tight",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>{t('dashboard.charts.revenue')}</h3>
        <span className={cn(
          "text-xl font-bold",
          theme === 'dark' ? 'text-gradient-blue' : 'text-primary'
        )}>{percentage}%</span>
      </div>
      
      <div className="flex flex-col gap-7">
        {/* Donut Chart */}
        <div className="flex justify-center items-center">
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={67}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  <Cell fill={theme === 'dark' ? "url(#blueLineGradient)" : 'hsl(var(--primary))'} />
                  <Cell fill={theme === 'dark' ? "#0F0827" : 'hsl(var(--muted))'} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={cn("text-sm mb-1", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}>{t('dashboard.charts.totalEarnings')}</p>
                <p className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>{/* earnings value dynamic?*/'$12,875'}</p>
                <p className={cn("text-xs", theme === 'dark' ? 'text-[#94A3B8]/60' : 'text-muted-foreground/60')}>{t('dashboard.charts.lastMonth')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="mt-2">
          <BarChart data={barData} />
        </div>
      </div>
    </div>
  );
}
