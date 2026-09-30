import { useState } from "react";
import { AlertCircle, ChevronRight, X, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const complaintCategories = [
  { id: "bin_issue", label: "Bin Sensor / Overflow" },
  { id: "truck_issue", label: "Collection Vehicle" },
  { id: "missed_pickup", label: "Missed Pickup" },
  { id: "other", label: "General Feedback" },
];

interface ComplaintCardProps {
  householdId: string;
}

export const ComplaintCard = ({ householdId }: ComplaintCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Select an issue category and provide details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("complaints").insert({
        household_id: householdId,
        category: selectedCategory,
        description: description.trim(),
      });

      if (error) throw error;

      toast({
        title: "Ticket Submitted Successfully",
        description: "Parallax Municipal Team has logged your issue.",
      });
      setIsModalOpen(false);
      setDescription("");
      setSelectedCategory(null);
    } catch (error) {
      toast({
        title: "Failed to submit report",
        description: "Please check your network connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Report Bin Issue</h3>
              <p className="text-xs text-slate-500">Direct Municipal Dispatch</p>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold px-5 h-10 shadow-md shadow-blue-600/20"
          >
            File Ticket
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-in text-slate-900">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Report Issue</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Select Category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {complaintCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all border text-left ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </p>
              <Textarea
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[110px] rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 resize-none text-xs"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/20"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
