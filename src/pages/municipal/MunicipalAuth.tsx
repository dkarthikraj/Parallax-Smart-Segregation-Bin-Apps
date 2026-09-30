import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, User, Phone, Briefcase, Cpu } from "lucide-react";

const MunicipalAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    department: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Check if user is a municipal user
        const { data: municipalUser, error: municipalError } = await supabase
          .from("municipal_users")
          .select("*")
          .eq("user_id", data.user?.id)
          .maybeSingle();

        if (!municipalUser) {
          await supabase.auth.signOut();
          throw new Error("Not authorized as municipal user");
        }

        toast({ title: "Welcome back!", description: "Login successful" });
        navigate("/municipal");
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/municipal`,
          },
        });

        if (error) throw error;

        // Create municipal user record
        const { error: insertError } = await supabase.from("municipal_users").insert({
          user_id: data.user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role: "officer",
        });

        if (insertError) throw insertError;

        toast({ title: "Account created!", description: "Welcome to Parallax Municipal Dashboard" });
        navigate("/municipal");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Card className="w-full max-w-md bg-white border border-slate-200/90 shadow-lg rounded-3xl p-2">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mb-2 text-blue-600 shadow-sm">
            <Cpu className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Parallax Municipal</CardTitle>
          <CardDescription className="text-slate-500 text-xs font-medium">
            {isLogin ? "Sign in to access municipal administration portal" : "Create officer account for Parallax network"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    name="department"
                    placeholder="Department (e.g. Sanitation)"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 h-12 rounded-2xl border-slate-200 text-xs font-medium focus:border-blue-500"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In to Admin Portal" : "Create Officer Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-extrabold text-blue-600 hover:underline"
            >
              {isLogin ? "Need a municipal officer account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MunicipalAuth;
