import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, className, iconClassName }: StatCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 hover:border-blue-300 transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-bold flex items-center gap-1 mt-1",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              <span>{trend.isPositive ? "▲" : "▼"}</span>
              <span>{Math.abs(trend.value)}% from yesterday</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs",
            iconClassName || "bg-blue-50 border-blue-100 text-blue-600"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
