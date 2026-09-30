import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DonutChart } from "@/components/ui/DonutChart";
import { Leaf, Recycle, Trash2, AlertTriangle, Cpu, ChevronRight, Layers, ChevronDown, MapPin } from "lucide-react";

interface BinData {
  organic: number;
  recyclable: number;
  non_recyclable: number;
  hazardous: number;
}

interface BinOverviewProps {
  binData: BinData | null;
}

export interface SmartBin {
  id: string;
  name: string;
  location: string;
  slots: {
    slotNumber: number;
    categoryKey: string;
    label: string;
    color: string;
    percentage: number;
  }[];
}

export const defaultSmartBins: SmartBin[] = [
  {
    id: "bin-kitchen",
    name: "Main Kitchen Bin",
    location: "Kitchen",
    slots: [
      { slotNumber: 1, categoryKey: "organic", label: "Organic", color: "#10b981", percentage: 45 },
      { slotNumber: 2, categoryKey: "recyclable", label: "Recyclable", color: "#2563eb", percentage: 70 },
      { slotNumber: 3, categoryKey: "non_recyclable", label: "Non-Recyclable", color: "#64748b", percentage: 20 },
      { slotNumber: 4, categoryKey: "hazardous", label: "Hazardous", color: "#e11d48", percentage: 5 },
    ],
  },
  {
    id: "bin-balcony",
    name: "Balcony & Garden Bin",
    location: "Balcony",
    slots: [
      { slotNumber: 1, categoryKey: "organic", label: "Organic (Compost)", color: "#10b981", percentage: 80 },
      { slotNumber: 2, categoryKey: "recyclable", label: "Recyclable", color: "#2563eb", percentage: 15 },
      { slotNumber: 3, categoryKey: "glass_metal", label: "Glass & Metal", color: "#d97706", percentage: 35 },
      { slotNumber: 4, categoryKey: "e_waste", label: "E-Waste", color: "#9333ea", percentage: 0 },
    ],
  },
  {
    id: "bin-garage",
    name: "Garage / Workshop Bin",
    location: "Garage",
    slots: [
      { slotNumber: 1, categoryKey: "e_waste", label: "E-Waste & Batteries", color: "#9333ea", percentage: 60 },
      { slotNumber: 2, categoryKey: "hazardous", label: "Hazardous / Bio", color: "#e11d48", percentage: 40 },
      { slotNumber: 3, categoryKey: "recyclable", label: "Recyclable", color: "#2563eb", percentage: 25 },
      { slotNumber: 4, categoryKey: "non_recyclable", label: "Non-Recyclable", color: "#64748b", percentage: 10 },
    ],
  },
];

const categoryIcons: Record<string, any> = {
  organic: Leaf,
  recyclable: Recycle,
  non_recyclable: Trash2,
  hazardous: AlertTriangle,
  e_waste: Cpu,
  glass_metal: Layers,
};

export const BinOverview = ({ binData }: BinOverviewProps) => {
  const navigate = useNavigate();
  const [smartBins, setSmartBins] = useState<SmartBin[]>(defaultSmartBins);
  const [activeBinId, setActiveBinId] = useState<string>("bin-kitchen");

  useEffect(() => {
    const storedBins = localStorage.getItem("parallax_registered_smart_bins");
    if (storedBins) {
      try {
        setSmartBins(JSON.parse(storedBins));
      } catch (e) {}
    }
    const storedActive = localStorage.getItem("parallax_active_bin_id");
    if (storedActive) {
      setActiveBinId(storedActive);
    }
  }, []);

  const handleBinChange = (id: string) => {
    setActiveBinId(id);
    localStorage.setItem("parallax_active_bin_id", id);
    window.dispatchEvent(new CustomEvent("parallaxActiveBinChanged"));
  };

  const currentBin = smartBins.find((b) => b.id === activeBinId) || smartBins[0];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-up">
      {/* Top Header Row: Title & Action Button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight truncate">
                Parallax Sort AI
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">Software-Defined Segregation Unit</p>
          </div>
        </div>

        <Link
          to="/bins"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3.5 py-2 rounded-full border border-blue-200/80 transition-all duration-200 whitespace-nowrap shadow-sm flex-shrink-0"
        >
          <span>Manage Slots</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dedicated Active Bin Switcher Bar */}
      <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-2.5 mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 pl-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-600 truncate">Selected Bin:</span>
        </div>

        <div className="relative flex-shrink-0">
          <select
            value={activeBinId}
            onChange={(e) => handleBinChange(e.target.value)}
            className="appearance-none text-xs font-bold text-blue-700 bg-white hover:bg-blue-50/60 border border-blue-200 px-3.5 py-1.5 pr-8 rounded-xl cursor-pointer shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {smartBins.map((bin) => (
              <option key={bin.id} value={bin.id}>
                {bin.name} ({bin.location})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Physical Slots Grid */}
      <div className="grid grid-cols-2 gap-4">
        {currentBin.slots.map((slot) => {
          const Icon = categoryIcons[slot.categoryKey] || Leaf;

          return (
            <button
              key={slot.slotNumber}
              onClick={() => navigate(`/bins`)}
              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">
                Slot {slot.slotNumber}
              </span>

              {/* Donut Chart Ring - Clean center percentage text only */}
              <div className="my-1">
                <DonutChart
                  percentage={slot.percentage}
                  color={slot.color}
                  label=""
                  size={76}
                  strokeWidth={6}
                />
              </div>

              {/* Label & Icon below donut chart without any overlap */}
              <div className="flex items-center gap-1.5 mt-1">
                <Icon className="w-3.5 h-3.5" style={{ color: slot.color }} />
                <span className="text-xs font-extrabold text-slate-900 truncate max-w-[100px]">
                  {slot.label}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {slot.percentage}% Fill Level
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
