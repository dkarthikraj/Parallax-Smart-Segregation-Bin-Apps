import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Home,
  AlertTriangle,
  Truck,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Shield,
  Recycle,
  MapPin,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/municipal" },
  { icon: Home, label: "Households", path: "/municipal/households" },
  { icon: AlertTriangle, label: "Complaints", path: "/municipal/complaints" },
  { icon: Truck, label: "Collections", path: "/municipal/collections" },
  { icon: Users, label: "Drivers", path: "/municipal/drivers" },
  { icon: ClipboardList, label: "Tasks", path: "/municipal/tasks" },
  { icon: Shield, label: "Hazards", path: "/municipal/hazards" },
  { icon: Recycle, label: "Recycling", path: "/municipal/recycling" },
  { icon: MapPin, label: "Pincode", path: "/municipal/pincode" },
  { icon: Settings, label: "Settings", path: "/municipal/settings" },
];

const MunicipalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out from Parallax Admin" });
    navigate("/municipal/auth");
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white text-slate-800 border-r border-slate-200/90 flex flex-col transition-all duration-300 sticky top-0 z-40 shadow-xs",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-black text-base text-slate-900 tracking-tight">PARALLAX</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto hide-scrollbar">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/municipal"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all text-xs font-bold",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/70"
                  )
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-colors w-full text-xs font-bold",
            "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default MunicipalSidebar;
