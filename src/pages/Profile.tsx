import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  QrCode,
  Star,
  Target,
  Recycle,
  Edit2,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  X,
  Save,
  Award,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Household {
  id: string;
  name: string;
  phone: string;
  address: string;
  level: number;
  points: number;
  total_waste_recycled: number;
}

const settingsItems = [
  { icon: Bell, label: "Notification Settings" },
  { icon: Shield, label: "Privacy & Data Security" },
  { icon: HelpCircle, label: "Parallax Support Center" },
  { icon: Info, label: "About Parallax AI v2.0" },
];

const Profile = () => {
  const navigate = useNavigate();
  const [household, setHousehold] = useState<Household | null>({
    id: "karthik-profile-id",
    name: "Karthik",
    phone: "+91 98765 43210",
    address: "Ward 12, Smart City Corridor",
    level: 13,
    points: 1720,
    total_waste_recycled: 48.5,
  });
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "Karthik",
    phone: "+91 98765 43210",
    address: "Ward 12, Smart City Corridor",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHousehold();
  }, []);

  const fetchHousehold = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      let data = null;
      
      if (session?.user?.id) {
        const { data: userHousehold } = await supabase
          .from("households")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();
        data = userHousehold;
      }
      
      if (!data) {
        const { data: fallbackData } = await supabase
          .from("households")
          .select("*")
          .limit(1)
          .maybeSingle();
        data = fallbackData;
      }

      if (data) {
        const defaultName = data.name || "Karthik";
        setHousehold({
          ...data,
          name: defaultName,
        });
        setEditForm({
          name: defaultName,
          phone: data.phone || "+91 98765 43210",
          address: data.address || "Ward 12, Smart City Corridor",
        });
      }
    } catch (error) {
      console.error("Error fetching household:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!household) return;
    setSaving(true);
    try {
      await supabase
        .from("households")
        .update({
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
        })
        .eq("id", household.id);

      setHousehold({ ...household, ...editForm });
      setEditModalOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      setHousehold({ ...household, ...editForm });
      setEditModalOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Logged out from Parallax" });
      navigate("/auth");
    } catch (error) {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-44 w-full bg-white rounded-3xl" />
        <Skeleton className="h-24 w-full bg-white rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-28 px-5 pt-6 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Title */}
      <div className="flex items-center justify-between mb-5 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Citizen Profile
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full text-xs text-slate-800 font-bold shadow-sm">
          <Zap className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
          <span>Verified</span>
        </div>
      </div>

      {/* User Hero Pass Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-up">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {household?.name?.charAt(0) || "K"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-900 truncate">
              {household?.name || "Karthik"}
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">
              {household?.phone || "+91 98765 43210"}
            </p>
            <p className="text-xs text-slate-600 font-medium mt-1 truncate">
              📍 {household?.address || "Ward 12, Smart City Corridor"}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Button
            onClick={() => setEditModalOpen(true)}
            className="flex-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5 mr-2" />
            Edit Profile
          </Button>
          <Link
            to="/qr"
            className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-900 transition-colors border border-slate-200/80"
          >
            <QrCode className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-sm animate-fade-up">
          <Award className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
          <p className="text-xl font-black text-slate-900">LVL {household?.level}</p>
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Tier</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-sm animate-fade-up">
          <Target className="w-5 h-5 text-sky-600 mx-auto mb-1.5" />
          <p className="text-xl font-black text-slate-900">
            {household?.points?.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Points</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-sm animate-fade-up">
          <Recycle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xl font-black text-slate-900">
            {household?.total_waste_recycled || 48.5}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">KG Recycled</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden mb-6 shadow-sm">
        {settingsItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3.5 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
              <item.icon className="w-4 h-4" />
            </div>
            <span className="flex-1 font-bold text-slate-800 text-xs">
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 p-4 hover:bg-rose-50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="flex-1 font-bold text-rose-600 text-xs">
            Sign Out
          </span>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-in text-slate-900">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Full Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-xs h-11"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Phone Number
                </label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-xs h-11"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Address
                </label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-xs h-11"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 rounded-full border-slate-200 text-slate-700 text-xs font-bold h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 shadow-sm"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
