import { useLocation, useNavigate } from "react-router-dom";

export const TopAppSwitcher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDemo = location.pathname === "/demo" || location.pathname === "/sih2026";
  const isMunicipal = location.pathname.startsWith("/municipal");
  const isDriver = location.pathname.startsWith("/driver");
  const isCitizen = !isDemo && !isMunicipal && !isDriver;

  return (
    <div className="bg-white text-slate-900 py-2 px-4 sticky top-0 z-[100] border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-center flex-wrap gap-2">
        <button
          onClick={() => navigate("/")}
          className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase transition-all duration-200 border ${
            isCitizen
              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          CITIZEN APP
        </button>

        <button
          onClick={() => navigate("/driver")}
          className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase transition-all duration-200 border ${
            isDriver
              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          DRIVER APP
        </button>

        <button
          onClick={() => navigate("/municipal")}
          className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase transition-all duration-200 border ${
            isMunicipal
              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          MUNICIPAL ADMIN
        </button>

        <button
          onClick={() => navigate("/demo")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full uppercase transition-all duration-200 border ${
            isDemo
              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white"
          }`}
        >
          SIH 2026 DOCS & DEMO
        </button>
      </div>
    </div>
  );
};
