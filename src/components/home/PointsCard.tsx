import { Star, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface PointsCardProps {
  points: number;
  level: number;
}

export const PointsCard = ({ points, level }: PointsCardProps) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-slate-500">
            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Points Balance
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {points.toLocaleString()}
            </h2>
            <span className="text-xs font-extrabold text-blue-600">PTS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-extrabold text-blue-700">
            Level {level}
          </span>
        </div>
      </div>

      <Link
        to="/rewards"
        className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-5 py-3.5 text-white font-bold text-xs tracking-wide group shadow-md shadow-blue-600/20"
      >
        <span>Redeem Eco Rewards</span>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </div>
      </Link>
    </div>
  );
};
