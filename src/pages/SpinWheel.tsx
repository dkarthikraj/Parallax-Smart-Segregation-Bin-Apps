import { useEffect, useState } from "react";
import { ArrowLeft, RotateCw, Sparkles, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  title: string;
  icon: string;
  reward_type: string;
  reward_value: number;
}

const SPIN_COOLDOWN_KEY = "parallax_last_spin";
const FREE_SPINS_KEY = "parallax_free_spins";
const COOLDOWN_HOURS = 6;

const defaultSpinRewards: Reward[] = [
  { id: "r1", title: "50 PTS", icon: "⭐", reward_type: "points", reward_value: 50 },
  { id: "r2", title: "100 PTS", icon: "💎", reward_type: "points", reward_value: 100 },
  { id: "r3", title: "Eco Voucher", icon: "🎟️", reward_type: "coupon", reward_value: 1 },
  { id: "r4", title: "200 PTS", icon: "🚀", reward_type: "points", reward_value: 200 },
  { id: "r5", title: "+1 Level", icon: "🏆", reward_type: "level", reward_value: 1 },
  { id: "r6", title: "500 PTS", icon: "🌟", reward_type: "points", reward_value: 500 },
];

const SpinWheel = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<Reward | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [freeSpins, setFreeSpins] = useState(2);

  useEffect(() => {
    fetchRewards();
    checkSpinAvailability();
    loadFreeSpins();

    const interval = setInterval(() => {
      checkSpinAvailability();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadFreeSpins = () => {
    const stored = localStorage.getItem(FREE_SPINS_KEY) || localStorage.getItem("recylo_free_spins");
    if (stored) {
      setFreeSpins(parseInt(stored, 10));
    } else {
      setFreeSpins(2);
    }
  };

  const checkSpinAvailability = () => {
    const lastSpin = localStorage.getItem(SPIN_COOLDOWN_KEY) || localStorage.getItem("recylo_last_spin");
    const storedFreeSpins = parseInt(localStorage.getItem(FREE_SPINS_KEY) || localStorage.getItem("recylo_free_spins") || "2", 10);
    
    if (storedFreeSpins > 0) {
      setCanSpin(true);
      setTimeLeft("");
      return;
    }

    if (!lastSpin) {
      setCanSpin(true);
      setTimeLeft("");
      return;
    }

    const lastSpinTime = new Date(lastSpin).getTime();
    const now = Date.now();
    const diff = now - lastSpinTime;
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;

    if (diff >= cooldownMs) {
      setCanSpin(true);
      setTimeLeft("");
    } else {
      setCanSpin(false);
      const remaining = cooldownMs - diff;
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data } = await supabase.from("spinwheel_rewards").select("*");
      if (data && data.length > 0) {
        setRewards(data);
      } else {
        setRewards(defaultSpinRewards);
      }
    } catch (error) {
      setRewards(defaultSpinRewards);
    } finally {
      setLoading(false);
    }
  };

  const spin = async () => {
    if (spinning || rewards.length === 0 || (!canSpin && freeSpins === 0)) return;

    setSpinning(true);
    setShowResult(false);

    if (freeSpins > 0) {
      const newFreeSpins = freeSpins - 1;
      setFreeSpins(newFreeSpins);
      localStorage.setItem(FREE_SPINS_KEY, newFreeSpins.toString());
    } else {
      localStorage.setItem(SPIN_COOLDOWN_KEY, new Date().toISOString());
      setCanSpin(false);
    }

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const selectedReward = rewards[randomIndex];

    const segmentAngle = 360 / rewards.length;
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (rewards.length - randomIndex - 0.5) * segmentAngle;
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(async () => {
      setWonReward(selectedReward);
      setShowResult(true);
      setSpinning(false);

      try {
        const { data: householdData } = await supabase
          .from("households")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (householdData) {
          if (selectedReward.reward_type === "points") {
            await supabase
              .from("households")
              .update({ points: householdData.points + selectedReward.reward_value })
              .eq("id", householdData.id);
          } else if (selectedReward.reward_type === "level") {
            await supabase
              .from("households")
              .update({ level: householdData.level + selectedReward.reward_value })
              .eq("id", householdData.id);
          }
        }
      } catch (e) {
        console.error("Error saving reward:", e);
      }

      toast({
        title: `Won ${selectedReward.title}! 🎉`,
        description: "Your points balance has been updated.",
      });
    }, 4500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-64 w-64 bg-white rounded-full mx-auto" />
      </div>
    );
  }

  const segmentAngle = 360 / (rewards.length || 6);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-6 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <Link
          to="/rewards"
          className="w-10 h-10 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-blue-600 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900">Spin & Win PTS</h1>
        </div>
      </div>

      {/* Available Spins Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 mb-6 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-700">Available Spins</span>
        </div>
        <span className="font-mono font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {freeSpins > 0 ? `${freeSpins} Free Spins` : canSpin ? "1 Daily Spin" : timeLeft}
        </span>
      </div>

      {/* Wheel Canvas Container */}
      <div className="relative my-8 flex justify-center items-center">
        {/* Pointer */}
        <div className="absolute -top-4 z-20 w-8 h-8 flex justify-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-blue-600 drop-shadow-md" />
        </div>

        {/* Outer Ring */}
        <div className="w-72 h-72 rounded-full border-8 border-white bg-slate-100 shadow-[0_8px_30px_rgba(37,99,235,0.1)] flex items-center justify-center p-2 relative overflow-hidden">
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {rewards.map((reward, index) => {
              const rotate = index * segmentAngle;
              const colors = [
                "bg-blue-600 text-white",
                "bg-blue-100 text-blue-900",
                "bg-sky-600 text-white",
                "bg-slate-200 text-slate-900",
                "bg-indigo-600 text-white",
                "bg-blue-50 text-blue-900",
              ];
              const bgClass = colors[index % colors.length];

              return (
                <div
                  key={reward.id || index}
                  className="absolute w-full h-full top-0 left-0"
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <div
                    className={`w-1/2 h-full absolute right-0 top-0 origin-left ${bgClass} border-r border-white/30 flex items-center justify-center`}
                    style={{
                      clipPath: `polygon(0 50%, 100% 0, 100% ${Math.tan((segmentAngle * Math.PI) / 180) * 100}%)`,
                    }}
                  />
                  <div
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-center text-xs font-bold pointer-events-none drop-shadow-sm"
                    style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                  >
                    <span className="text-base block">{reward.icon || "🎁"}</span>
                    <span className="text-[10px] font-mono tracking-tight font-extrabold">{reward.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute z-10 w-16 h-16 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-md">
            <Award className="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Spin CTA Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={spin}
          disabled={spinning || (!canSpin && freeSpins === 0)}
          className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wider shadow-md shadow-blue-600/20 uppercase"
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin" />
              Spinning Wheel...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <RotateCw className="w-5 h-5" />
              Spin Now
            </span>
          )}
        </Button>
      </div>

      {/* Won Result Modal */}
      {showResult && wonReward && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-scale-in text-slate-900">
            <div className="text-5xl mb-3">{wonReward.icon || "🎉"}</div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Congratulations!</h3>
            <p className="text-xs text-slate-600 mb-4">
              You won <strong className="text-blue-600">{wonReward.title}</strong>
            </p>
            <Button
              onClick={() => setShowResult(false)}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 shadow-md shadow-blue-600/20"
            >
              Claim Reward
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
