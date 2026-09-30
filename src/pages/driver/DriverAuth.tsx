import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const DriverAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    driverId: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        toast({ title: "Welcome back, Driver!" });
        navigate("/driver");
      } else {
        if (!formData.driverId.trim()) {
          throw new Error("Driver ID is required");
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/driver`
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("drivers")
            .insert({
              user_id: authData.user.id,
              name: formData.name,
              phone: formData.phone,
              driver_id: formData.driverId
            });

          if (profileError) throw profileError;
        }

        toast({ title: "Account created!", description: "Welcome to Parallax Driver App" });
        navigate("/driver");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-12 text-slate-900 selection:bg-blue-600 selection:text-white">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mb-5 shadow-sm text-blue-600">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Parallax Driver</h1>
        <p className="text-xs font-semibold text-slate-500 mb-8">Smart Waste Collection Portal</p>

        {/* Toggle */}
        <div className="flex bg-slate-200/60 rounded-2xl p-1 mb-6 w-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-11 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Driver ID (e.g., DRV001)"
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value.toUpperCase() })}
                  className="pl-11 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-11 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-11 pr-11 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all mt-2"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="text-center pt-6 text-xs text-slate-400 font-medium">
          Powered by Parallax · Smart India Hackathon 2026
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;