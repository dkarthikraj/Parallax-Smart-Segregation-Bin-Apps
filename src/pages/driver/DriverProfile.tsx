import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Truck, Phone, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DriverData {
  name: string;
  phone: string | null;
  driver_id: string;
}

const DriverProfile = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/driver/auth");
      return;
    }

    const { data, error } = await supabase
      .from("drivers")
      .select("name, phone, driver_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error loading profile",
        variant: "destructive"
      });
    } else if (data) {
      setDriver(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/driver/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-6 border-b border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Driver Profile</h1>
        <p className="text-xs font-semibold text-slate-500">Parallax Fleet Operator Details</p>
      </div>

      {/* Profile Card */}
      <div className="px-5 pt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-xs">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900">{driver?.name || "Karthik Driver"}</h2>
            <p className="text-xs font-semibold text-slate-500">Parallax Smart Segregation Fleet</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <IdCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Driver ID</p>
                <p className="text-sm font-black text-slate-900 font-mono">{driver?.driver_id || "DRV001"}</p>
              </div>
            </div>

            {driver?.phone && (
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                  <p className="text-sm font-black text-slate-900">{driver.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Unit</p>
                <p className="text-sm font-black text-slate-900">Parallax Auto-Sorting Collector #4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 mt-5 text-xs font-bold shadow-xs"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out from Fleet Account
        </Button>
      </div>
    </div>
  );
};

export default DriverProfile;