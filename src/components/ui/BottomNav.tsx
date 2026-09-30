import { Home, Trophy, QrCode, Recycle, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/rewards", icon: Trophy, label: "Rewards" },
  { to: "/qr", icon: QrCode, label: "QR Pass", isCenter: true },
  { to: "/bins", icon: Recycle, label: "Bins" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md px-4">
      <div className="bg-white border border-slate-200/90 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-3 transition-all duration-200 relative group",
              item.isCenter && "-mt-5"
            )}
            activeClassName="text-blue-600"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                {item.isCenter ? (
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md border-2 border-white",
                      isActive
                        ? "bg-blue-600 text-white scale-105 shadow-blue-500/30"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <item.icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                ) : (
                  <>
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive
                          ? "text-blue-600 scale-110"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] tracking-tight transition-colors duration-200",
                        isActive ? "text-blue-600 font-extrabold" : "text-slate-400 font-medium group-hover:text-slate-600"
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
