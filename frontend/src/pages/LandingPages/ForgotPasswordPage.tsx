import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Building2, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [companyCode, setCompanyCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const hostname = window.location.hostname;
    const isSuperAdmin = hostname.startsWith("admin.");
    const isCompanyAdmin = hostname.startsWith("company.");
    const isCustomDomain = !(
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "connectpro.in" ||
        hostname === "www.connectpro.in" ||
        isSuperAdmin ||
        isCompanyAdmin ||
        hostname.startsWith("user.")
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || (!isSuperAdmin && !isCustomDomain && !companyCode)) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            const payload: any = { email };
            if (isCustomDomain) {
                payload.domain = hostname;
            } else if (!isSuperAdmin) {
                payload.companyCode = companyCode;
            }
            await api.post("/auth/forgot-password", payload);
            setSubmitted(true);
            toast.success("If the email is registered, a reset link has been sent.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

            <div className="w-full flex-col flex lg:flex-row m-auto lg:m-0 z-10">
                {/* Left side art panel */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 bg-muted/30 p-12 border-r border-border/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative z-10">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
                        </Link>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">Secure Recovery</h1>
                        <p className="mt-2 text-muted-foreground w-3/4 leading-relaxed">
                            Regain access to your professional network. We employ enterprise-grade security for password resets.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="relative z-10 pb-8">
                        <div className="flex items-center gap-4 text-muted-foreground/80">
                            <ShieldCheck className="w-12 h-12" strokeWidth={1} />
                            <div>
                                <p className="text-sm font-semibold text-foreground">2FA Encrypted Links</p>
                                <p className="text-xs">Expiring one-time tokens straight to your inbox</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right side form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
                        <div className="backdrop-blur-xl bg-card/60 rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Reset Password
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Send a one-time reset link to your email
                                </p>
                            </div>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs ml-1 text-muted-foreground uppercase tracking-wider font-semibold">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-12 bg-background/50 border-white/10 focus:bg-background transition-colors rounded-xl" required />
                                        </div>
                                    </div>

                                    {!isSuperAdmin && !isCustomDomain && (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="companyCode" className="text-xs ml-1 text-muted-foreground uppercase tracking-wider font-semibold">Company ID</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input id="companyCode" type="text" placeholder="e.g. TECHNET2026" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} className="pl-9 h-12 bg-background/50 border-white/10 focus:bg-background transition-colors rounded-xl" required />
                                            </div>
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full h-12 mt-4 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={loading}>
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </Button>

                                    <div className="mt-6 text-center lg:hidden">
                                        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
                                    </div>
                                </form>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Check your inbox</h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            We've sent a secure reset link to <br />
                                            <span className="font-medium text-foreground">{email}</span>
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full h-12 rounded-xl" asChild>
                                        <Link to="/login">Return to Login</Link>
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
