import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, User, Lock, Eye, EyeOff, Map, Building, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({ title: "Login successful" });
        navigate("/");
      } else {
        // Validation
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords do not match",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Password must be at least 6 characters",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const redirectUrl = `${window.location.origin}/`;

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              phone: formData.phone,
              address: formData.address,
            },
          },
        });


        // Create household entry with location data and user_id
        if (data.user) {
          await supabase.from("households").insert({
            user_id: data.user.id,
            name: formData.name || "Karthik",
            phone: formData.phone || "+91 98765 43210",
            address: formData.address || "Ward 12, Smart City Corridor",
            state: formData.state || "Odisha",
            district: formData.district || "Khordha",
            pincode: formData.pincode || "751024",
            qr_code: `PARALLAX-${Date.now().toString(36).toUpperCase()}`,
          });
        }

        toast({
          title: "Parallax Account Created",
          description: "You can now sign in to Parallax Citizen Ecosystem.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-6 py-12 text-white">
      {/* Logo & Title */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-3xl">
          P
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Parallax</h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">Autonomous AI Waste Classification</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-6 animate-fade-up">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            isLogin ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            !isLogin ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up stagger-1">
        {!isLogin && (
          <>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="pl-11 h-12 rounded-xl"
                required={!isLogin}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="pl-11 h-12 rounded-xl"
                required={!isLogin}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="pl-11 h-12 rounded-xl"
                required={!isLogin}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="pl-11 h-12 rounded-xl"
                />
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleChange}
                  className="pl-11 h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="pl-11 h-12 rounded-xl"
                maxLength={6}
              />
            </div>
          </>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="pl-11 h-12 rounded-xl"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="pl-11 pr-11 h-12 rounded-xl"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {!isLogin && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-11 pr-11 h-12 rounded-xl"
              required={!isLogin}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-medium"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-8 animate-fade-up stagger-2">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Auth;
