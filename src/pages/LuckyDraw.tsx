import { useState, useEffect } from "react";
import { ArrowLeft, Ticket, Plus, Minus, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Draw {
  id: string;
  title: string;
  prize: string;
  ticketCost: number;
  endDate: string;
  totalTickets: number;
  userTickets: number;
}

const initialDraws: Draw[] = [
  {
    id: "1",
    title: "Eco Solar Power Bank",
    prize: "20,000mAh Rugged Solar Charging Pack",
    ticketCost: 150,
    endDate: "2026-10-15",
    totalTickets: 2547,
    userTickets: 0,
  },
  {
    id: "2",
    title: "Electric Smart Scooter",
    prize: "Ather Energy / Ola S1 Pro Smart EV Voucher",
    ticketCost: 500,
    endDate: "2026-11-01",
    totalTickets: 892,
    userTickets: 0,
  },
  {
    id: "3",
    title: "Smart Garden Kit",
    prize: "Automated Indoor Hydroponic Herb Kit",
    ticketCost: 200,
    endDate: "2026-10-20",
    totalTickets: 1421,
    userTickets: 0,
  },
  {
    id: "4",
    title: "Wireless Eco Earbuds",
    prize: "Noise Cancelling Recycled Polymer Earbuds",
    ticketCost: 100,
    endDate: "2026-10-10",
    totalTickets: 3678,
    userTickets: 0,
  },
];

const LuckyDraw = () => {
  const [userDraws, setUserDraws] = useState<Draw[]>(initialDraws);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [userPoints, setUserPoints] = useState(1720);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: household } = await supabase
      .from("households")
      .select("id, points")
      .limit(1)
      .maybeSingle();

    if (household) {
      setUserPoints(household.points);
      setHouseholdId(household.id);
    }
  };

  const updateTicketCount = (drawId: string, delta: number) => {
    setTicketCounts((prev) => ({
      ...prev,
      [drawId]: Math.max(0, (prev[drawId] || 0) + delta),
    }));
  };

  const buyTickets = async (draw: Draw) => {
    const count = ticketCounts[draw.id] || 0;
    if (count === 0) return;

    const totalCost = count * draw.ticketCost;
    if (userPoints < totalCost) {
      toast({
        title: "Not enough points",
        description: `You need ${totalCost} PTS. Balance: ${userPoints} PTS.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - totalCost;
    setUserPoints(newPoints);

    setUserDraws((prev) =>
      prev.map((d) =>
        d.id === draw.id
          ? {
              ...d,
              userTickets: d.userTickets + count,
              totalTickets: d.totalTickets + count,
            }
          : d
      )
    );

    setTicketCounts((prev) => ({ ...prev, [draw.id]: 0 }));

    if (householdId) {
      await supabase
        .from("households")
        .update({ points: newPoints })
        .eq("id", householdId);
    }

    toast({
      title: `${count} Entry Tickets Purchased! 🎉`,
      description: `Entered into "${draw.title}" raffle. Good luck Karthik!`,
    });
  };

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
          <h1 className="text-xl font-black text-slate-900">Weekly Eco Raffle</h1>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-600">Your PTS Balance</span>
        </div>
        <span className="font-mono font-black text-slate-900 text-sm">
          {userPoints.toLocaleString()} PTS
        </span>
      </div>

      {/* Draw List */}
      <div className="space-y-4">
        {userDraws.map((draw) => {
          const count = ticketCounts[draw.id] || 0;
          const totalCost = count * draw.ticketCost;

          return (
            <div
              key={draw.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm animate-fade-up"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{draw.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{draw.prize}</p>
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
                  {draw.ticketCost} PTS
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 my-3 pt-2 border-t border-slate-100">
                <span>Total Entries: {draw.totalTickets}</span>
                <span className="text-blue-600 font-extrabold">My Tickets: {draw.userTickets}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 border border-slate-200/90 rounded-full p-1">
                  <button
                    onClick={() => updateTicketCount(draw.id, -1)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                    {count}
                  </span>
                  <button
                    onClick={() => updateTicketCount(draw.id, 1)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={() => buyTickets(draw)}
                  disabled={count === 0}
                  className="flex-1 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                >
                  <Ticket className="w-4 h-4 mr-1.5" />
                  Buy Entries ({totalCost} PTS)
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LuckyDraw;
