import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MessageSquare, Zap, Lock, CreditCard, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function UserLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-60 bg-primary/5 rounded-full blur-[100px] -z-10" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">Welcome to Your Network</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Connect, share, and grow within your professional community. Discover features designed for everyday members.
                    </p>

                    <div className="py-8 grid sm:grid-cols-2 gap-4 text-left">
                        <Card className="bg-card shadow-sm border-border">
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
                                    <LayoutGrid className="w-4 h-4" />
                                </div>
                                <h3 className="font-heading font-semibold text-base">Community Feed</h3>
                                <p className="text-sm text-muted-foreground">Post updates, view others' activities, and engage with content in real time.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card shadow-sm border-border">
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h3 className="font-heading font-semibold text-base">Digital Business Card</h3>
                                <p className="text-sm text-muted-foreground">Generate and share your personalized smart connect profile with anyone.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card shadow-sm border-border">
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center mb-1">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <h3 className="font-heading font-semibold text-base">Events, Blogs & Podcasts</h3>
                                <p className="text-sm text-muted-foreground">Access exclusive media and join upcoming community events.</p>
                            </CardContent>
                        </Card>

                        {/* Restrictions Box */}
                        <Card className="bg-muted/40 border-dashed border-border/60">
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center mb-1">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <h3 className="font-heading font-semibold text-base">Platform Scope</h3>
                                <p className="text-sm text-muted-foreground">As a user, your view is limited strictly to your company's network. Admin features and global settings are restricted.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-2">
                        <Button size="lg" className="px-10" onClick={() => navigate("/login")}>
                            Log In
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
