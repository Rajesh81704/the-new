import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setSubmitting(true);
      const response = await AuthAPI.login({ email, password });
      const payload = response.data?.data;

      localStorage.setItem("token", payload?.token || "");
      localStorage.setItem("authUser", JSON.stringify(payload?.user || {}));

      const role = payload?.user?.role;
      if (role === "SUPER_ADMIN") {
        window.location.href = "https://superadmin.magicallysocial.cloud/super-admin";
        return;
      }

      navigate("/", { replace: true });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold text-foreground">User Login</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your feed</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@magicallysocial.cloud"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
