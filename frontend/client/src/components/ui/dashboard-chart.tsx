import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface HospitalSurveyData {
  month: string;
  newPatients: number;
  allPatients: number;
}

export interface HospitalSurveyChartProps {
  data: HospitalSurveyData[];
}

export function HospitalSurveyChart({ data }: HospitalSurveyChartProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const tickColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#2A2040' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? 'rgba(10, 0, 74, 0.9)' : 'hsl(var(--background))';
  const tooltipBorder = theme === 'dark' ? '#5D0A72' : 'hsl(var(--border))';

  return (
    <div className={cn(
      "rounded-2xl p-7 h-full",
      theme === 'dark'
        ? "bg-[#05002E] card-glow border border-[#5D0A72]/10"
        : "bg-card border shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={cn(
          "font-bold text-xl tracking-tight",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>{t('dashboard.charts.hospitalSurvey')}</h3>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5757]"></div>
            <span className={cn("text-sm", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}>{t('dashboard.charts.newPatients')}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#9747FF]"></div>
            <span className={cn("text-sm", theme === 'dark' ? 'text-[#94A3B8]' : 'text-muted-foreground')}>{t('dashboard.charts.allPatients')}</span>
          </div>
        </div>
      </div>
      
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 12 }}
              tickFormatter={(value) => t(`calendar.months.${value}`)}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 12 }}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                padding: '10px 14px',
                borderWidth: '1px'
              }}
              itemStyle={{ 
                color: theme === 'dark' ? '#fff' : 'hsl(var(--foreground))', 
                fontSize: '13px', 
                padding: '3px 0' 
              }}
              labelStyle={{ 
                color: theme === 'dark' ? '#94A3B8' : 'hsl(var(--muted-foreground))', 
                fontWeight: 'bold', 
                marginBottom: '5px' 
              }}
              cursor={{ stroke: '#9747FF', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <defs>
              <linearGradient id="chartOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5757" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF5757" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="chartPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9747FF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9747FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="newPatients" 
              stroke="#FF5757" 
              strokeWidth={3}
              fill="url(#chartOrangeGradient)"
              fillOpacity={1}
              activeDot={{ r: 6, fill: '#FF5757', stroke: theme === 'dark' ? '#FFFFFF' : 'hsl(var(--card))', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="allPatients" 
              stroke="#9747FF" 
              strokeWidth={3}
              fill="url(#chartPurpleGradient)"
              fillOpacity={1}
              activeDot={{ r: 6, fill: '#9747FF', stroke: theme === 'dark' ? '#FFFFFF' : 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
