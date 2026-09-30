import { useEffect, useState } from "react";
import { User, MapPin, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface Household {
  id: string;
  name: string;
  address: string;
  qr_code: string;
}

const QRPage = () => {
  const [household, setHousehold] = useState<Household | null>({
    id: "karthik-qr-id",
    name: "Karthik",
    address: "Ward 12, Smart City Corridor",
    qr_code: "PARALLAX-KARTHIK-9876",
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const { data } = await supabase
          .from("households")
          .select("id, name, address, qr_code")
          .limit(1)
          .maybeSingle();

        if (data) {
          setHousehold({
            ...data,
            name: data.name || "Karthik",
            qr_code: data.qr_code || "PARALLAX-KARTHIK-9876",
          });
        }
      } catch (error) {
        console.error("Error fetching household:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, []);

  const copyToClipboard = () => {
    if (household?.qr_code) {
      navigator.clipboard.writeText(household.qr_code);
      setCopied(true);
      toast({ title: "QR Code Hash Copied!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-64 w-64 mx-auto bg-white rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-6 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="text-center mb-6 animate-fade-up">
        <h1 className="text-xl font-black text-slate-900">Collection QR Pass</h1>
        <p className="text-xs text-slate-500 font-medium">
          Show this QR code to the municipal collector vehicle
        </p>
      </div>

      {/* QR Code Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 mb-6 shadow-sm animate-fade-up">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-200 shadow-inner">
            <QRCode
              value={household?.qr_code || "PARALLAX-KARTHIK-9876"}
              size={180}
              level="H"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* QR Code Hash string */}
        <button
          onClick={copyToClipboard}
          className="w-full bg-slate-50 border border-slate-200/90 rounded-full p-3 flex items-center justify-between mb-5 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
        >
          <span className="font-mono text-xs text-blue-600 font-black">
            {household?.qr_code || "PARALLAX-KARTHIK-9876"}
          </span>
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          )}
        </button>

        {/* User Card info */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Citizen Name</p>
              <p className="text-xs font-black text-slate-900">{household?.name || "Karthik"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Smart Bin Address</p>
              <p className="text-xs font-black text-slate-900">
                {household?.address || "Ward 12, Smart City Corridor"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center space-y-1 animate-fade-up">
        <p className="text-[11px] font-mono text-slate-500 font-bold">
          Powered by <strong className="text-blue-600">Parallax AI System</strong>
        </p>
        <p className="text-[9px] text-slate-400 font-mono uppercase">
          Edge Computing & Waste Classification
        </p>
      </div>
    </div>
  );
};

export default QRPage;
