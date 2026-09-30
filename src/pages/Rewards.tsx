import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Gift, Lock, Check, Ticket, RotateCw, QrCode, Sparkles, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import TaskQRModal from "@/components/rewards/TaskQRModal";

interface Task {
  id: string;
  title: string;
  description: string;
  points_reward: number;
  level_reward: number;
  icon: string;
}

interface Household {
  id: string;
  points: number;
  level: number;
}

interface ActiveTask {
  id: string;
  startedAt: number;
}

interface CompletedTask {
  taskId: string;
  pointsAwarded: number;
  levelAwarded: number;
}

const ACTIVE_TASKS_KEY = "parallax_active_tasks";

const specialRewards: Record<number, { type: string; label: string }> = {
  2: { type: "spin", label: "Free Spin" },
  4: { type: "coupon", label: "Eco Voucher" },
  6: { type: "draw", label: "Parallax Raffle" },
  8: { type: "spin", label: "Free Spin" },
  10: { type: "coupon", label: "Eco Voucher" },
  12: { type: "draw", label: "Parallax Raffle" },
  14: { type: "spin", label: "2x Spins" },
  16: { type: "coupon", label: "Premium Voucher" },
  18: { type: "draw", label: "Parallax Raffle" },
  20: { type: "spin", label: "3x Spins" },
  22: { type: "coupon", label: "Super Voucher" },
  24: { type: "draw", label: "Parallax Raffle" },
  26: { type: "spin", label: "5x Spins" },
  28: { type: "coupon", label: "Mega Voucher" },
  30: { type: "draw", label: "Grand Raffle" },
};

const defaultTasksList: Task[] = [
  {
    id: "task-1",
    title: "Daily Segregation Streak",
    description: "Scan wet & dry waste bins today via Parallax AI camera.",
    points_reward: 100,
    level_reward: 1,
    icon: "Recycle",
  },
  {
    id: "task-2",
    title: "Plastic Reduction Challenge",
    description: "Recycle 5 single-use plastic bottles in Recyclable bin.",
    points_reward: 150,
    level_reward: 1,
    icon: "Leaf",
  },
  {
    id: "task-3",
    title: "E-Waste Safety Scout",
    description: "Deposit hazardous batteries or e-waste safely.",
    points_reward: 200,
    level_reward: 2,
    icon: "AlertTriangle",
  },
];

const Rewards = () => {
  const [household, setHousehold] = useState<Household | null>({
    id: "karthik-rewards-id",
    points: 1720,
    level: 13,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pendingCompleteTask, setPendingCompleteTask] = useState<Task | null>(null);
  const [completedTaskInfo, setCompletedTaskInfo] = useState<CompletedTask | null>(null);

  useEffect(() => {
    fetchData();
    loadActiveTasks();
  }, []);

  const loadActiveTasks = () => {
    const stored = localStorage.getItem(ACTIVE_TASKS_KEY) || localStorage.getItem("recylo_active_tasks");
    if (stored) {
      try {
        setActiveTasks(JSON.parse(stored));
      } catch (e) {
        setActiveTasks([]);
      }
    }
  };

  const saveActiveTasks = (tasks: ActiveTask[]) => {
    localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(tasks));
    setActiveTasks(tasks);
  };

  const fetchData = async () => {
    try {
      const { data: householdData } = await supabase
        .from("households")
        .select("id, points, level")
        .limit(1)
        .maybeSingle();

      if (householdData) {
        setHousehold(householdData);
      } else {
        setHousehold({
          id: "karthik-rewards-id",
          points: 1720,
          level: 13,
        });
      }

      const { data: tasksData } = await supabase
        .from("rewards_tasks")
        .select("*");

      if (tasksData && tasksData.length > 0) {
        setTasks(tasksData);
      } else {
        setTasks(defaultTasksList);
      }
    } catch (error) {
      setTasks(defaultTasksList);
    } finally {
      setLoading(false);
    }
  };

  const isTaskActive = (taskId: string) => {
    return activeTasks.some((t) => t.id === taskId);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    if (isTaskActive(task.id)) {
      setPendingCompleteTask(task);
      setShowQRModal(true);
    } else {
      const updated = [...activeTasks, { id: task.id, startedAt: Date.now() }];
      saveActiveTasks(updated);
      toast({
        title: "Task Started!",
        description: `Task "${task.title}" is now active. Scan QR to complete!`,
      });
    }
  };

  const handleQRComplete = async () => {
    if (!pendingCompleteTask || !household) return;

    const task = pendingCompleteTask;
    setShowQRModal(false);

    try {
      const newPoints = household.points + task.points_reward;
      const newLevel = household.level + task.level_reward;

      await supabase
        .from("households")
        .update({ points: newPoints, level: newLevel })
        .eq("id", household.id);

      setHousehold({ ...household, points: newPoints, level: newLevel });

      const updated = activeTasks.filter((t) => t.id !== task.id);
      saveActiveTasks(updated);

      setCompletedTaskInfo({
        taskId: task.id,
        pointsAwarded: task.points_reward,
        levelAwarded: task.level_reward,
      });

      setShowCongrats(true);
    } catch (error) {
      const newPoints = household.points + task.points_reward;
      const newLevel = household.level + task.level_reward;
      setHousehold({ ...household, points: newPoints, level: newLevel });

      const updated = activeTasks.filter((t) => t.id !== task.id);
      saveActiveTasks(updated);

      setCompletedTaskInfo({
        taskId: task.id,
        pointsAwarded: task.points_reward,
        levelAwarded: task.level_reward,
      });

      setShowCongrats(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-8 space-y-4">
        <Skeleton className="h-10 w-48 bg-white rounded-xl" />
        <Skeleton className="h-44 w-full bg-white rounded-3xl" />
      </div>
    );
  }

  const currentLevel = household?.level || 13;

  return (
    <div className="min-h-screen bg-slate-50 pb-28 px-5 pt-6 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Eco Rewards Hub
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-4 py-1.5 rounded-full text-xs font-black text-slate-900 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{household?.points?.toLocaleString() || 1720} PTS</span>
        </div>
      </div>

      {/* Quick Games Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up">
        <Link
          to="/spinwheel"
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 text-center transition-all shadow-sm group"
        >
          <RotateCw className="w-6 h-6 text-blue-600 mx-auto mb-1.5 group-hover:rotate-180 transition-transform duration-500" />
          <p className="text-xs font-black text-slate-900">Spin Wheel</p>
          <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1 inline-block">Win PTS</span>
        </Link>

        <Link
          to="/luckydraw"
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 text-center transition-all shadow-sm group"
        >
          <Ticket className="w-6 h-6 text-blue-600 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-slate-900">Raffles</p>
          <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1 inline-block">Jackpots</span>
        </Link>

        <Link
          to="/coupons"
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 text-center transition-all shadow-sm group"
        >
          <Gift className="w-6 h-6 text-blue-600 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-slate-900">Vouchers</p>
          <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1 inline-block">Redeem</span>
        </Link>
      </div>

      {/* Level Milestones Horizontal Scroll */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 mb-6 shadow-sm animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Level Roadmap</h3>
          </div>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            LVL {currentLevel} Active
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {[...Array(15)].map((_, i) => {
            const lvl = i + 1;
            const isUnlocked = lvl <= currentLevel;
            const reward = specialRewards[lvl];

            return (
              <div
                key={lvl}
                className={`flex-shrink-0 w-24 p-3.5 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? "bg-blue-50/60 border-blue-200 text-slate-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 opacity-40"
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 mb-1">
                  LVL {lvl}
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 text-blue-600 font-black text-xs shadow-sm">
                  {isUnlocked ? <Check className="w-4 h-4 text-blue-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  {reward ? reward.label : "+50 PTS"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <h3 className="font-extrabold text-slate-900 text-sm mb-3.5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
          Available Eco Tasks
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => {
            const active = isTaskActive(task.id);
            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all cursor-pointer shadow-sm flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-extrabold text-slate-900 text-xs">{task.title}</h4>
                    {active && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{task.description}</p>

                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      +{task.points_reward} PTS
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      +{task.level_reward} LVL
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="rounded-full text-xs font-bold px-4 h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                >
                  {active ? <QrCode className="w-3.5 h-3.5 mr-1" /> : null}
                  {active ? "Scan QR" : "Start"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal for Task Completion */}
      {showQRModal && pendingCompleteTask && (
        <TaskQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          onComplete={handleQRComplete}
          taskTitle={pendingCompleteTask.title}
        />
      )}

      {/* Congrats Modal */}
      {showCongrats && completedTaskInfo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-scale-in text-slate-900">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Task Completed! 🎉</h3>
            <p className="text-xs text-slate-500 mb-4">
              Parallax AI validated your eco action!
            </p>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-5">
              <p className="text-2xl font-black text-blue-600 mb-0.5">
                +{completedTaskInfo.pointsAwarded} PTS
              </p>
              <p className="text-xs font-bold text-slate-600">
                +{completedTaskInfo.levelAwarded} LEVEL UP
              </p>
            </div>
            <Button
              onClick={() => setShowCongrats(false)}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-12 shadow-md shadow-blue-600/20"
            >
              Collect Rewards
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
