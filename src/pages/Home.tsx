import { useEffect, useState } from "react";
import { Bell, QrCode, Dices, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PointsCard } from "@/components/home/PointsCard";
import { BinOverview } from "@/components/home/BinOverview";
import { EcoFactsCarousel } from "@/components/home/EcoFactsCarousel";
import { ComplaintCard } from "@/components/home/ComplaintCard";
import { NotificationSheet } from "@/components/home/NotificationSheet";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Household {
  id: string;
  name: string;
  points: number;
  level: number;
}

interface BinData {
  organic: number;
  recyclable: number;
  non_recyclable: number;
  hazardous: number;
}

interface EcoFact {
  id: string;
  text: string;
  icon: string;
  category: string;
}

const Home = () => {
  const [household, setHousehold] = useState<Household | null>({
    id: "default-karthik-id",
    name: "Karthik",
    points: 1720,
    level: 13,
  });
  const [binData, setBinData] = useState<BinData | null>(null);
  const [ecoFacts, setEcoFacts] = useState<EcoFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        let householdData = null;
        
        if (session?.user?.id) {
          const { data } = await supabase
            .from("households")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle();
          householdData = data;
        }
        
        if (!householdData) {
          const { data } = await supabase
            .from("households")
            .select("*")
            .limit(1)
            .maybeSingle();
          householdData = data;
        }

        if (householdData) {
          setHousehold({
            ...householdData,
            name: householdData.name || "Karthik",
          });

          const { data: binsData } = await supabase
            .from("bins")
            .select("*")
            .eq("household_id", householdData.id)
            .maybeSingle();

          setBinData(binsData || null);
        }

        const { data: factsData } = await supabase
          .from("ecofacts")
          .select("*");

        if (factsData && factsData.length > 0) {
          setEcoFacts(factsData);
        } else {
          setEcoFacts([
            {
              id: "fact-1",
              text: "Segregating wet and dry waste saves up to 80% of landfill space in smart cities.",
              icon: "Leaf",
              category: "Segregation",
            },
            {
              id: "fact-2",
              text: "Recycling 1 aluminum container saves enough electricity to power a TV for 3 hours!",
              icon: "Recycle",
              category: "Energy",
            },
            {
              id: "fact-3",
              text: "Parallax AI Sort automatically classifies waste into 10 distinct sub-categories.",
              icon: "Cpu",
              category: "Parallax AI",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-44 w-full bg-white rounded-3xl" />
        <Skeleton className="h-64 w-full bg-white rounded-3xl" />
      </div>
    );
  }

  const userName = household?.name?.split(" ")[0] || "Karthik";

  return (
    <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-6 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Hi, {userName} 👋
        </h1>

        <button
          onClick={() => setShowNotifications(true)}
          className="relative w-11 h-11 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center border border-slate-200/90 transition-all shadow-sm group"
        >
          <Bell className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>
      </div>

      {/* Points & Level Card */}
      {household && (
        <div className="mb-5">
          <PointsCard points={household.points} level={household.level} />
        </div>
      )}

      {/* Quick Action Pills */}
      <div className="grid grid-cols-4 gap-2.5 mb-6 animate-fade-up">
        <Link
          to="/qr"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all hover:scale-105 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-900">QR Pass</span>
        </Link>

        <Link
          to="/spinwheel"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all hover:scale-105 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Dices className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-900">Spin Wheel</span>
        </Link>

        <Link
          to="/luckydraw"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all hover:scale-105 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-900">Raffle</span>
        </Link>

        <Link
          to="/coupons"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all hover:scale-105 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-900">Vouchers</span>
        </Link>
      </div>

      {/* Bin Overview */}
      <div className="mb-5">
        <BinOverview binData={binData} />
      </div>

      {/* Eco Facts Carousel */}
      {ecoFacts.length > 0 && (
        <div className="mb-5">
          <EcoFactsCarousel facts={ecoFacts} />
        </div>
      )}

      {/* Complaint Card */}
      {household && <ComplaintCard householdId={household.id} />}

      {/* Notifications Sheet */}
      <NotificationSheet
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        householdId={household?.id}
      />
    </div>
  );
};

export default Home;
