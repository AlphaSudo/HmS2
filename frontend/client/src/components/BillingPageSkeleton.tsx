import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export const BillingPageSkeleton = () => {
  const { theme } = useTheme();

  const SkeletonBox = ({ className = "" }: { className?: string }) => (
    <div className={cn(
      "animate-pulse rounded-lg",
      theme === 'dark' ? 'bg-white/10' : 'bg-gray-200',
      className
    )} />
  );

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonBox className="h-28" />
        <SkeletonBox className="h-28" />
        <SkeletonBox className="h-28" />
        <SkeletonBox className="h-28" />
      </div>

      {/* Search/Filter Bar */}
      <SkeletonBox className="h-20" />

      {/* Table */}
      <div className={cn('rounded-2xl border overflow-hidden', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
        {/* Table Header */}
        <div className="flex justify-between p-4 border-b border-inherit">
          <SkeletonBox className="h-6 w-1/4" />
          <SkeletonBox className="h-6 w-1/6" />
          <SkeletonBox className="h-6 w-1/6" />
          <SkeletonBox className="h-6 w-1/6" />
        </div>
        {/* Table Rows */}
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}; 