import { useEffect, useState } from "react";
import { X, Bell, CheckCircle, Info, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  householdId?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "info" | "warning" | "level";
}

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case "level":
      return <TrendingUp className="w-5 h-5 text-blue-600" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

export const NotificationSheet = ({ isOpen, onClose, householdId }: NotificationSheetProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && householdId) {
      fetchNotifications();
    }
  }, [isOpen, householdId]);

  const fetchNotifications = async () => {
    if (!householdId) return;
    
    setLoading(true);
    try {
      const { data: collections } = await supabase
        .from("collection_logs")
        .select("*")
        .eq("household_id", householdId)
        .order("collected_at", { ascending: false })
        .limit(10);

      const { data: taskCompletions } = await supabase
        .from("task_completions")
        .select("*, rewards_tasks(title)")
        .eq("household_id", householdId)
        .order("completed_at", { ascending: false })
        .limit(5);

      const notifs: Notification[] = [];

      if (collections) {
        collections.forEach((col) => {
          if (col.segregation_status === "pass") {
            notifs.push({
              id: `col-${col.id}`,
              title: "Segregation Reward!",
              message: "Parallax AI validated proper waste segregation. +10 PTS awarded!",
              time: formatDistanceToNow(new Date(col.collected_at), { addSuffix: true }),
              type: "success",
            });
          } else {
            notifs.push({
              id: `col-${col.id}`,
              title: "Collection Alert",
              message: "Waste collection logged. Ensure hazardous items are separated.",
              time: formatDistanceToNow(new Date(col.collected_at), { addSuffix: true }),
              type: "warning",
            });
          }
        });
      }

      if (taskCompletions) {
        taskCompletions.forEach((tc: any) => {
          notifs.push({
            id: `task-${tc.id}`,
            title: "Task Accomplished!",
            message: `Earned ${tc.points_awarded} points for "${tc.rewards_tasks?.title || 'task'}"`,
            time: formatDistanceToNow(new Date(tc.completed_at), { addSuffix: true }),
            type: "level",
          });
        });
      }

      setNotifications(notifs.slice(0, 15));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] animate-fade-up">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Notifications</h2>
              <p className="text-[10px] font-mono text-slate-500">Live Eco Activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30 text-blue-600" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};