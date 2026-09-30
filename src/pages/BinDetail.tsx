import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Leaf, Recycle, Trash2, AlertTriangle, Scale, Cpu } from "lucide-react";
import { DonutChart } from "@/components/ui/DonutChart";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface BinData {
  organic: number;
  recyclable: number;
  non_recyclable: number;
  hazardous: number;
}

interface BinConversion {
  from: string;
  to: string;
}

const BIN_CONVERSIONS_KEY = "parallax_bin_conversions";

const binTypeConfig = [
  { key: "organic", label: "Organic", color: "#10b981", icon: Leaf, lastDeposit: "1 hour ago" },
  { key: "recyclable", label: "Recyclable", color: "#0284c7", icon: Recycle, lastDeposit: "3 hours ago" },
  { key: "non_recyclable", label: "Non-Recyclable", color: "#64748b", icon: Trash2, lastDeposit: "1 day ago" },
  { key: "hazardous", label: "Hazardous", color: "#e11d48", icon: AlertTriangle, lastDeposit: "2 days ago" },
];

const getWeightFromPercentage = (percentage: number) => {
  const maxCapacity = 10;
  return ((percentage / 100) * maxCapacity).toFixed(1);
};

const BinDetail = () => {
  const { binType } = useParams<{ binType: string }>();
  const navigate = useNavigate();
  const [binData, setBinData] = useState<BinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversions, setConversions] = useState<BinConversion[]>([]);

  useEffect(() => {
    const loadConversions = () => {
      const stored = localStorage.getItem(BIN_CONVERSIONS_KEY) || localStorage.getItem("recylo_bin_conversions");
      if (stored) {
        setConversions(JSON.parse(stored));
      }
    };
    loadConversions();
  }, []);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const { data: householdData } = await supabase
          .from("households")
          .select("id")
          .limit(1)
          .maybeSingle();

        if (householdData) {
          const { data: binsData } = await supabase
            .from("bins")
            .select("*")
            .eq("household_id", householdData.id)
            .maybeSingle();

          if (binsData) {
            setBinData(binsData);
          } else {
            setBinData({
              organic: 30,
              recyclable: 45,
              non_recyclable: 10,
              hazardous: 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching bins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  const getDisplayType = (binKey: string) => {
    const conversion = conversions.find((c) => c.from === binKey);
    if (conversion) {
      return binTypeConfig.find((b) => b.key === conversion.to);
    }
    return binTypeConfig.find((b) => b.key === binKey);
  };

  const currentBinConfig = binTypeConfig.find((b) => b.key === binType);
  const displayType = binType ? getDisplayType(binType) : null;
  
  if (!currentBinConfig || !binType) {
    navigate("/bins");
    return null;
  }

  const percentage = binData ? (binData[binType as keyof BinData] as number) : 30;
  const IconComponent = displayType?.icon || currentBinConfig.icon;
  const isConverted = conversions.some((c) => c.from === binType);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-64 w-full bg-white rounded-3xl" />
      </div>
    );
  }

  const weightKg = getWeightFromPercentage(percentage);

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-28 px-5 pt-6 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <button
          onClick={() => navigate("/bins")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">
            {displayType?.label || currentBinConfig.label} Compartment
          </h1>
        </div>
      </div>

      {/* Main Gauge Hero */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 mb-6 shadow-sm text-center relative overflow-hidden animate-fade-up">
        {isConverted && (
          <span className="absolute top-4 right-4 text-[10px] font-bold bg-slate-100 text-slate-900 px-3 py-1 rounded-full uppercase">
            Swapped Compartment
          </span>
        )}

        <div className="my-4 flex justify-center">
          <DonutChart
            percentage={percentage}
            color={displayType?.color || currentBinConfig.color}
            label={displayType?.label || currentBinConfig.label}
            size={160}
            strokeWidth={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
              <Scale className="w-3.5 h-3.5 text-slate-900" />
              <span>Weight Payload</span>
            </div>
            <p className="text-lg font-black text-slate-900 font-mono">{weightKg} KG</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-900" />
              <span>Last Scan</span>
            </div>
            <p className="text-xs font-extrabold text-slate-900 font-mono">{currentBinConfig.lastDeposit}</p>
          </div>
        </div>
      </div>

      {/* Hardware Details */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 mb-6 shadow-sm animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-slate-900" />
          <h3 className="font-extrabold text-slate-900 text-sm">Hardware Telemetry</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-slate-600 font-medium">Ultrasonic Free Space</span>
            <span className="font-mono font-bold text-slate-900">{100 - percentage}% Capacity Remaining</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-slate-600 font-medium">Load Cell ADC</span>
            <span className="font-mono font-bold text-slate-900">HX711 Active ({weightKg}kg)</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-slate-600 font-medium">Servo Sorting Gate</span>
            <span className="font-mono font-bold text-emerald-600">Locked / Ready</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate("/bins")}
        className="w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
      >
        Back to Bin Diagnostics
      </Button>
    </div>
  );
};

export default BinDetail;