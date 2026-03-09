import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users2, Calendar, Globe, CreditCard, LayoutTemplate, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyAdminLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 p-40 bg-primary/5 rounded-full blur-3xl -z-10" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">Build Your Community</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Take full control of your networking space. As a Company Admin, you get exclusive features designed to grow, engage, and monetize your audience.
                    </p>

                    <div className="py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <Users2 className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Member Management</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Approve, group, and manage your community seamlessly.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <Calendar className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Event Hosting</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Schedule virtual and offline meetups effortlessly.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <LayoutTemplate className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Content Publishing</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Post blogs, podcasts, and rich resources.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <Globe className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">White-Label Domain</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Connect your own custom domain for branding.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <CreditCard className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Direct Payments</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Link your gateway and sell memberships to your users.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-border hover:border-primary/30 transition">
                            <CardContent className="p-5 flex items-start gap-4">
                                <Briefcase className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Module Toggling</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Enable or restrict features for your users at will.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-2 flex justify-center">
                        <Button size="lg" className="px-8" onClick={() => navigate("/login")}>
                            Company Login
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
