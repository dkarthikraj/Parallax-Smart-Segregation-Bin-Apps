import { NavLink } from "react-router-dom";
import { Home, Search, User } from "lucide-react";

const navItems = [
  { to: "/driver", icon: Home, label: "Home" },
  { to: "/driver/search", icon: Search, label: "Search" },
  { to: "/driver/profile", icon: User, label: "Profile" },
];

export const DriverBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2.5 max-w-md mx-auto shadow-lg z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/driver"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? "text-blue-600 font-bold bg-blue-50/80"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] font-extrabold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};