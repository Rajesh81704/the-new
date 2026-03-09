import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Building2, KeyRound } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyCode, setCompanyCode] = useState("");
    const [loading, setLoading] = useState(false);

    const hostname = window.location.hostname;
    const isSuperAdmin = hostname.startsWith("admin.");
    const isCompanyAdmin = hostname.startsWith("company.");

    // Contextual labels per subdomain role
    const loginContext = isSuperAdmin
        ? {
            title: "Magically Super",
            badge: "🛡️ Super Admin Portal",
            headline: "Global Control Panel",
            tagline: "Aap Magically Super ke master administrator hain. Yahaan se aap sabhi companies aur platform ko manage kar sakte hain.",
            formTitle: "Super Admin Sign In",
            formSubtitle: "Sirf authorized super admins hi is portal ko access kar sakte hain.",
        }
        : isCompanyAdmin
            ? {
                title: "Magically Super",
                badge: "🏢 Company Admin Portal",
                headline: "Company Dashboard",
                tagline: "Aap apni company ke admin hain. Yahaan se aap apni company ke members, events, blogs, aur settings manage kar sakte hain.",
                formTitle: "Company Admin Sign In",
                formSubtitle: "Apni email, password, aur Company ID enter karein apne admin dashboard tak pahunchne ke liye.",
            }
            : {
                title: "Magically Super",
                badge: "👤 Member Login Portal",
                headline: "Your Professional Network",
                tagline: "Yahaan aap kisi bhi company ke member ki tarah login kar sakte hain. Apna email, password, aur apni company ka unique Company ID enter karein.",
                formTitle: "Member Sign In",
                formSubtitle: "Apni company ka Company ID zaroor daalein — yahi aapko sahi network se jodega.",
            };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || (!isSuperAdmin && !isCompanyAdmin && !companyCode)) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            const payload: any = { email, password };
            if (!isSuperAdmin && !isCompanyAdmin) {
                payload.companyCode = companyCode;
            }
            const res = await api.post("/auth/login", payload);

            if (res.data?.data?.token) {
                localStorage.setItem("token", res.data.data.token);
                // Store company branding for the header
                const company = res.data.data.company;
                if (company) {
                    localStorage.setItem("companyName", company.name || "");
                    localStorage.setItem("companyLogo", company.logoUrl || "");
                } else {
                    localStorage.removeItem("companyName");
                    localStorage.removeItem("companyLogo");
                }

                // determine redirect based on subdomain
                if (isSuperAdmin) {
                    navigate("/super-admin");
                } else if (hostname.startsWith("company.")) {
                    navigate("/admin");
                } else {
                    navigate("/my-feed"); // fallback to user feed
                }

                toast.success("Login successful");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="w-full flex-col flex lg:flex-row m-auto lg:m-0 z-10">
                {/* Left side art panel */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 bg-muted/30 p-12 border-r border-border/50 relative overflow-hidden backdrop-blur-sm">
                    {/* Inner decoration inside panel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="relative z-10"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full mb-4">
                            {loginContext.badge}
                        </span>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mt-2">{loginContext.title}</h1>
                        <h2 className="font-heading text-xl font-semibold text-foreground/80 mt-1">{loginContext.headline}</h2>
                        <p className="mt-3 text-muted-foreground w-3/4 leading-relaxed text-sm">
                            {loginContext.tagline}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative z-10 pb-8"
                    >
                        <div className="p-6 rounded-2xl bg-background/40 border border-white/10 backdrop-blur-md shadow-2xl relative">
                            <div className="absolute -left-2 -top-2 text-primary">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L16.426 14.435L21.436 12.01L16.426 9.585L14.017 3L11.608 9.585L6.598 12.01L11.608 14.435L14.017 21Z" /></svg>
                            </div>
                            <p className="text-lg font-medium text-foreground relative z-10 pl-4 italic">
                                "Magically Super completely transformed how our organization connects internationally and within our own private networks."
                            </p>
                            <div className="mt-4 flex items-center gap-3 pl-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                                    A
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Aayush Sharma</p>
                                    <p className="text-xs text-muted-foreground">CTO, ConnectPro</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right side form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="backdrop-blur-xl bg-card/60 rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                            {/* Glassmorphism shine line */}
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{loginContext.formTitle}</h2>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed px-2">
                                    {loginContext.formSubtitle}
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs ml-1 text-muted-foreground uppercase tracking-wider font-semibold">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 h-12 bg-background/50 border-white/10 focus:bg-background transition-colors rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                {!isSuperAdmin && !isCompanyAdmin && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="companyCode" className="text-xs ml-1 text-muted-foreground uppercase tracking-wider font-semibold">Company ID</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="companyCode"
                                                type="text"
                                                placeholder="e.g. TECHNET2026"
                                                value={companyCode}
                                                onChange={(e) => setCompanyCode(e.target.value)}
                                                className="pl-9 h-12 bg-background/50 border-white/10 focus:bg-background transition-colors rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs ml-1 text-muted-foreground uppercase tracking-wider font-semibold">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9 h-12 bg-background/50 border-white/10 focus:bg-background transition-colors rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 mt-2 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 group"
                                    disabled={loading}
                                >
                                    {loading ? "Authenticating..." : "Sign In"}
                                    {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                                </Button>
                            </form>

                            <div className="mt-8 flex flex-col items-center gap-3">
                                <div className="relative w-full text-center">
                                    <span className="bg-card/60 backdrop-blur-sm px-3 text-xs text-muted-foreground relative z-10">OR</span>
                                    <div className="absolute top-1/2 inset-x-0 h-[1px] bg-border w-full z-0" />
                                </div>
                                <Button variant="outline" asChild className="w-full h-11 rounded-lg border-white/10 bg-background/30 hover:bg-background/60 shadow-sm text-foreground transition-all flex items-center justify-center gap-2">
                                    <Link to="/forgot-password">
                                        <KeyRound className="w-4 h-4 text-primary" />
                                        Reset via Mail OTP
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
