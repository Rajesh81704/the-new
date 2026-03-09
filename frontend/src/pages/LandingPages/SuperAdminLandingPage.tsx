import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, LayoutDashboard, Settings, Users, Key, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SuperAdminLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 p-32 bg-destructive/5 rounded-full blur-3xl -z-10" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4">
                        <Key className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">Platform Command Center</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Ultimate access for Magically Super platform owners. See all details across the entire system, covering both Company Admins and End Users.
                    </p>

                    <div className="py-6 grid md:grid-cols-3 gap-4 text-left">
                        <Card className="bg-card shadow-sm border-border hover:shadow-md transition">
                            <CardContent className="p-5 space-y-3">
                                <Database className="w-6 h-6 text-primary" />
                                <h3 className="font-heading font-semibold text-base">Global Oversight</h3>
                                <p className="text-sm text-muted-foreground">Approve, monitor, and manage every company workspace hosted on the platform.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-sm border-border hover:shadow-md transition">
                            <CardContent className="p-5 space-y-3">
                                <Users className="w-6 h-6 text-primary" />
                                <h3 className="font-heading font-semibold text-base">All-User Directory</h3>
                                <p className="text-sm text-muted-foreground">Gain deep insights into millions of users and company admins across all networks.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-sm border-border hover:shadow-md transition">
                            <CardContent className="p-5 space-y-3">
                                <Settings className="w-6 h-6 text-primary" />
                                <h3 className="font-heading font-semibold text-base">System Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage global payment gateways, create platform-level packages, and enforce rules.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                        <Button size="lg" className="px-8 gap-2" onClick={() => navigate("/login")}>
                            <Shield className="w-4 h-4" /> Secure Login
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
