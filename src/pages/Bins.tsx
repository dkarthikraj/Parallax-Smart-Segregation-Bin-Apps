import { useEffect, useState } from "react";
import { ArrowLeftRight, X, Check, Leaf, Recycle, Trash2, AlertTriangle, Cpu, Layers, Plus, ChevronDown } from "lucide-react";
import { DonutChart } from "@/components/ui/DonutChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { defaultSmartBins, SmartBin } from "@/components/home/BinOverview";

export interface CategoryOption {
  key: string;
  label: string;
  color: string;
  icon: any;
  bgColor: string;
}

export const wasteCategories: CategoryOption[] = [
  { key: "organic", label: "Organic Waste", color: "#10b981", icon: Leaf, bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { key: "recyclable", label: "Recyclable Packaging", color: "#2563eb", icon: Recycle, bgColor: "bg-blue-50 border-blue-200 text-blue-800" },
  { key: "non_recyclable", label: "Non-Recyclable Trash", color: "#64748b", icon: Trash2, bgColor: "bg-slate-100 border-slate-200 text-slate-800" },
  { key: "hazardous", label: "Hazardous / Bio-Medical", color: "#e11d48", icon: AlertTriangle, bgColor: "bg-rose-50 border-rose-200 text-rose-800" },
  { key: "e_waste", label: "E-Waste & Batteries", color: "#9333ea", icon: Cpu, bgColor: "bg-purple-50 border-purple-200 text-purple-800" },
  { key: "glass_metal", label: "Glass & Metals", color: "#d97706", icon: Layers, bgColor: "bg-amber-50 border-amber-200 text-amber-800" },
];

const Bins = () => {
  const [smartBins, setSmartBins] = useState<SmartBin[]>(defaultSmartBins);
  const [activeBinId, setActiveBinId] = useState<string>("bin-kitchen");
  const [loading, setLoading] = useState(false);

  // Modal states for Slot Reassignment
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showAddBinModal, setShowAddBinModal] = useState(false);

  // Form state for adding new bin
  const [newBinForm, setNewBinForm] = useState({ name: "", location: "" });

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

  const saveSmartBins = (updatedBins: SmartBin[]) => {
    setSmartBins(updatedBins);
    localStorage.setItem("parallax_registered_smart_bins", JSON.stringify(updatedBins));
  };

  const handleSwitchBin = (id: string) => {
    setActiveBinId(id);
    localStorage.setItem("parallax_active_bin_id", id);
  };

  const activeBin = smartBins.find((b) => b.id === activeBinId) || smartBins[0];

  // Handle re-assigning a physical slot to a new waste category
  const handleReassignSlotCategory = (targetCategoryKey: string) => {
    if (selectedSlotNumber === null) return;

    const categoryObj = wasteCategories.find((c) => c.key === targetCategoryKey);
    if (!categoryObj) return;

    const updatedBins = smartBins.map((bin) => {
      if (bin.id === activeBin.id) {
        const updatedSlots = bin.slots.map((slot) => {
          if (slot.slotNumber === selectedSlotNumber) {
            return {
              ...slot,
              categoryKey: categoryObj.key,
              label: categoryObj.label,
              color: categoryObj.color,
            };
          }
          return slot;
        });
        return { ...bin, slots: updatedSlots };
      }
      return bin;
    });

    saveSmartBins(updatedBins);
    setShowSwapModal(false);
    setSelectedSlotNumber(null);

    toast({
      title: "Software-Defined Slot Updated! ⚙️",
      description: `Slot ${selectedSlotNumber} is now mapped to ${categoryObj.label} for ${activeBin.name}. Edge AI Pan-Tilt chute lookup table synced!`,
    });
  };

  // Add new bin
  const handleRegisterNewBin = () => {
    if (!newBinForm.name.trim()) return;

    const newId = `bin-${Date.now()}`;
    const newBin: SmartBin = {
      id: newId,
      name: newBinForm.name.trim(),
      location: newBinForm.location.trim() || "Home",
      slots: [
        { slotNumber: 1, categoryKey: "organic", label: "Organic Waste", color: "#10b981", percentage: 0 },
        { slotNumber: 2, categoryKey: "recyclable", label: "Recyclable Packaging", color: "#2563eb", percentage: 0 },
        { slotNumber: 3, categoryKey: "non_recyclable", label: "Non-Recyclable Trash", color: "#64748b", percentage: 0 },
        { slotNumber: 4, categoryKey: "hazardous", label: "Hazardous / Bio-Medical", color: "#e11d48", percentage: 0 },
      ],
    };

    const updated = [...smartBins, newBin];
    saveSmartBins(updated);
    setActiveBinId(newId);
    setShowAddBinModal(false);
    setNewBinForm({ name: "", location: "" });

    toast({
      title: "New Smart Bin Registered!",
      description: `"${newBin.name}" added to Karthik's Parallax network.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-6 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Smart Bin Management
          </h1>
        </div>
        <Button
          onClick={() => setShowAddBinModal(true)}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-3.5 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Bin
        </Button>
      </div>

      {/* Multi-Bin Selector Dock */}
      <div className="mb-6 animate-fade-up">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Select Active Smart Bin
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {smartBins.map((bin) => {
            const isActive = bin.id === activeBinId;
            return (
              <button
                key={bin.id}
                onClick={() => handleSwitchBin(bin.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-105"
                    : "bg-white text-slate-700 border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Cpu className={`w-3.5 h-3.5 ${isActive ? "text-blue-100" : "text-blue-600"}`} />
                  <span>{bin.name}</span>
                </div>
                <span className={`text-[10px] block font-mono font-medium mt-0.5 ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                  {bin.location}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Bin Summary Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 mb-6 shadow-sm animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-0.5 rounded-full">
              4 PHYSICAL SLOTS
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">{activeBin.name}</h2>
            <p className="text-xs text-slate-500">Location: {activeBin.location} · Dynamic Remapping Active</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600 font-mono">
              {Math.round(activeBin.slots.reduce((sum, s) => sum + s.percentage, 0) / 4)}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">AVG FILL</span>
          </div>
        </div>
      </div>

      {/* Physical Chute Slot Remapping Matrix */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            Software-Defined Chute Slots
          </h3>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Tap Slot to Interchange
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {activeBin.slots.map((slot) => {
            const catObj = wasteCategories.find((c) => c.key === slot.categoryKey);
            const Icon = catObj?.icon || Leaf;

            return (
              <div
                key={slot.slotNumber}
                className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm relative flex flex-col justify-between"
              >
                {/* Slot Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                    Slot {slot.slotNumber}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-slate-900">
                    {slot.percentage}%
                  </span>
                </div>

                {/* Donut Gauge Ring - Clean Center text with zero overlap */}
                <div className="my-2 flex justify-center">
                  <DonutChart
                    percentage={slot.percentage}
                    color={slot.color}
                    label=""
                    size={80}
                    strokeWidth={6}
                  />
                </div>

                {/* Assigned Category Label & Icon */}
                <div className="text-center my-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80">
                    <Icon className="w-3.5 h-3.5" style={{ color: slot.color }} />
                    <span className="text-xs font-black text-slate-900 truncate max-w-[110px]">
                      {slot.label}
                    </span>
                  </div>
                </div>

                {/* Interchange Button */}
                <Button
                  onClick={() => {
                    setSelectedSlotNumber(slot.slotNumber);
                    setShowSwapModal(true);
                  }}
                  className="w-full mt-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] h-9 shadow-sm shadow-blue-600/20"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
                  Interchange Slot
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Interchange Category Selection Modal */}
      {showSwapModal && selectedSlotNumber !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-end justify-center">
          <div className="bg-white border-t border-slate-200 w-full max-w-lg rounded-t-3xl p-6 shadow-2xl animate-slide-up text-slate-900">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Interchange Slot {selectedSlotNumber} Category
                </h3>
                <p className="text-xs text-slate-500">
                  Select waste category to route into physical Slot {selectedSlotNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSwapModal(false);
                  setSelectedSlotNumber(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              {wasteCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isCurrent =
                  activeBin.slots.find((s) => s.slotNumber === selectedSlotNumber)?.categoryKey === cat.key;

                return (
                  <button
                    key={cat.key}
                    onClick={() => handleReassignSlotCategory(cat.key)}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isCurrent
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-slate-50 text-slate-900 border-slate-200/90 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isCurrent ? "bg-white/20 text-white" : "bg-white text-slate-900 border border-slate-200"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: isCurrent ? "#ffffff" : cat.color }} />
                    </div>
                    <div>
                      <span className="text-xs font-black block leading-tight">{cat.label}</span>
                      {isCurrent && <span className="text-[9px] font-bold text-blue-100">Currently Mapped</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add New Smart Bin Modal */}
      {showAddBinModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in text-slate-900">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Register New Smart Bin</h3>
              <button
                onClick={() => setShowAddBinModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Bin Identifier Name
                </label>
                <Input
                  value={newBinForm.name}
                  onChange={(e) => setNewBinForm({ ...newBinForm, name: e.target.value })}
                  placeholder="e.g. Outdoor Yard Bin"
                  className="rounded-2xl bg-slate-50 border-slate-200 text-xs h-11"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Household Location
                </label>
                <Input
                  value={newBinForm.location}
                  onChange={(e) => setNewBinForm({ ...newBinForm, location: e.target.value })}
                  placeholder="e.g. Backyard / Patio"
                  className="rounded-2xl bg-slate-50 border-slate-200 text-xs h-11"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddBinModal(false)}
                className="flex-1 rounded-full border-slate-200 text-xs font-bold h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRegisterNewBin}
                className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Register Bin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bins;
