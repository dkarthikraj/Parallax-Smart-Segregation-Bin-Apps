import { useEffect, useState } from "react";
import { ArrowLeft, Ticket, Sparkles, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiry_date: string;
  status: string;
}

interface StoreCoupon {
  id: string;
  store: string;
  discount: string;
  cost: number;
  description: string;
  code: string;
}

const storeCoupons: StoreCoupon[] = [
  { id: "amazon", store: "Amazon Pay", discount: "₹250 Off", cost: 300, description: "Instant discount on Amazon orders", code: "PARALLAX-AMZ-250" },
  { id: "swiggy", store: "Swiggy Gourmet", discount: "50% Off", cost: 200, description: "Flat 50% discount on eco-friendly dining", code: "PARALLAX-SWG-50" },
  { id: "zomato", store: "Zomato Gold", discount: "₹150 Off", cost: 150, description: "Valid on orders above ₹299", code: "PARALLAX-ZOM-150" },
  { id: "flipkart", store: "Flipkart Green", discount: "30% Off", cost: 350, description: "On sustainable & eco appliances", code: "PARALLAX-FK-30" },
  { id: "myntra", store: "Myntra Eco", discount: "₹500 Off", cost: 400, description: "On organic fashion clothing", code: "PARALLAX-MYN-500" },
  { id: "uber", store: "Uber EV Ride", discount: "₹100 Off", cost: 150, description: "On your next 3 EV rides", code: "PARALLAX-UBR-EV" },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(1720);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data: household } = await supabase
        .from("households")
        .select("id, points")
        .limit(1)
        .maybeSingle();

      if (household) {
        setUserPoints(household.points);
        setHouseholdId(household.id);

        const { data } = await supabase
          .from("coupons")
          .select("*")
          .eq("household_id", household.id)
          .order("status", { ascending: true });

        if (data && data.length > 0) {
          setCoupons(data);
        } else {
          setCoupons([
            {
              id: "c-1",
              title: "Amazon Pay - ₹250 Off",
              discount: "₹250 Off",
              expiry_date: "2026-11-30",
              status: "active",
            },
            {
              id: "c-2",
              title: "Swiggy Gourmet - 50% Off",
              discount: "50% Off",
              expiry_date: "2026-12-15",
              status: "active",
            },
          ]);
        }
      } else {
        setCoupons([
          {
            id: "c-1",
            title: "Amazon Pay - ₹250 Off",
            discount: "₹250 Off",
            expiry_date: "2026-11-30",
            status: "active",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyCoupon = async (storeCoupon: StoreCoupon) => {
    if (storeCoupon.cost > userPoints) {
      toast({
        title: "Not enough points",
        description: `You need ${storeCoupon.cost} PTS. Current balance: ${userPoints} PTS.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const newPts = userPoints - storeCoupon.cost;
      setUserPoints(newPts);

      const newCoupon: Coupon = {
        id: `c-${Date.now()}`,
        title: `${storeCoupon.store} - ${storeCoupon.discount}`,
        discount: storeCoupon.discount,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      };

      setCoupons((prev) => [newCoupon, ...prev]);

      if (householdId) {
        await supabase
          .from("households")
          .update({ points: newPts })
          .eq("id", householdId);
      }

      toast({
        title: "Voucher Unlocked! 🎉",
        description: `Code: ${storeCoupon.code} copied.`,
      });
    } catch (e) {
      toast({
        title: "Voucher Unlocked! 🎉",
        description: `Code: ${storeCoupon.code} copied.`,
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Coupon Code Copied!", description: code });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-44 w-full bg-white rounded-3xl" />
      </div>
    );
  }

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
          <h1 className="text-xl font-black text-slate-900">Eco Vouchers & Perks</h1>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-slate-600">Available Balance</span>
        </div>
        <span className="font-mono font-black text-slate-900 text-sm">
          {userPoints.toLocaleString()} PTS
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1.5 rounded-full mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`py-2.5 text-xs font-extrabold rounded-full transition-all ${
            activeTab === "available"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Redeem Catalog
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`py-2.5 text-xs font-extrabold rounded-full transition-all ${
            activeTab === "my"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          My Vouchers ({coupons.length})
        </button>
      </div>

      {/* Store Tab */}
      {activeTab === "available" && (
        <div className="space-y-3">
          {storeCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm flex items-center justify-between gap-4 animate-fade-up"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-slate-900">{coupon.store}</span>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {coupon.discount}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate font-medium">{coupon.description}</p>
                <span className="text-[10px] font-mono font-black text-blue-600 mt-2 block">
                  COST: {coupon.cost} PTS
                </span>
              </div>

              <Button
                onClick={() => buyCoupon(coupon)}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 shadow-md shadow-blue-600/20"
              >
                Claim
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* My Coupons Tab */}
      {activeTab === "my" && (
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30 text-blue-600" />
              <p className="text-xs">No vouchers unlocked yet</p>
            </div>
          ) : (
            coupons.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm animate-fade-up"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-slate-900 text-sm">{c.title}</h3>
                  <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                    UNLOCKED
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>VALID 30 DAYS</span>
                  <button
                    onClick={() => copyCode("PARALLAX-ECO-2026")}
                    className="flex items-center gap-1 text-blue-600 font-extrabold hover:underline"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied!" : "PARALLAX-ECO-2026"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Coupons;
