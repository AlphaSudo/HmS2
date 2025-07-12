import { cn } from "@/utils/utils";

interface BarChartProps {
  data: number[];
}

export function BarChart({ data }: BarChartProps) {
  // Find the maximum value to calculate relative heights
  const maxValue = Math.max(...data);
  
  return (
    <div className="flex items-end justify-between h-28 gap-3 mt-1">
      {data.map((value, index) => {
        // Calculate height percentage based on the maximum value
        const heightPercentage = (value / maxValue) * 100;
        
        return (
          <div 
            key={index}
            className="relative group"
            style={{ width: 'calc(20% - 10px)' }}
          >
            <div 
              className={cn(
                "w-full rounded-t-xl shadow-lg",
                "transition-all duration-500 ease-in-out"
              )}
              style={{
                height: `${heightPercentage}%`,
                background: "linear-gradient(180deg, #3DB9FF 0%, #0A004A 100%)"
              }}
            />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0A004A] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
