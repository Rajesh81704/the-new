import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Globe, Shield, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Total Companies", value: "12", change: "+2", up: true, icon: Building2, gradient: "from-primary/15 to-primary/5", iconBg: "bg-primary/10 text-primary" },
  { label: "Total Members", value: "1,847", change: "+124", up: true, icon: Users, gradient: "from-accent/15 to-accent/5", iconBg: "bg-accent/10 text-accent" },
  { label: "Monthly Revenue", value: "₹4,52,000", change: "+18%", up: true, icon: CreditCard, gradient: "from-emerald-500/15 to-emerald-500/5", iconBg: "bg-emerald-500/10 text-emerald-600" },
  { label: "Active Rate", value: "94.2%", change: "-0.8%", up: false, icon: Activity, gradient: "from-blue-500/15 to-blue-500/5", iconBg: "bg-blue-500/10 text-blue-600" },
];

const recentCompanies = [
  { name: "TechNet India", plan: "Enterprise", members: 500, maxMembers: 1000, status: "Active", revenue: "₹50,000", trend: "+12%" },
  { name: "StartupHub", plan: "Pro", members: 120, maxMembers: 250, status: "Active", revenue: "₹25,000", trend: "+8%" },
  { name: "BizConnect", plan: "Starter", members: 45, maxMembers: 50, status: "Warning", revenue: "₹8,000", trend: "+2%" },
  { name: "NetVentures", plan: "Pro", members: 89, maxMembers: 250, status: "Active", revenue: "₹30,000", trend: "+15%" },
  { name: "ConnectPro", plan: "Enterprise", members: 340, maxMembers: 500, status: "Active", revenue: "₹45,000", trend: "+22%" },
];

const recentActivity = [
  { action: "New company registered", detail: "ConnectPro — Enterprise Plan", time: "2 hours ago", icon: Building2 },
  { action: "Member limit warning", detail: "BizConnect at 90% capacity", time: "5 hours ago", icon: Shield },
  { action: "Payment received", detail: "₹50,000 from TechNet India", time: "1 day ago", icon: CreditCard },
  { action: "New application", detail: "InnovateTech requested access", time: "1 day ago", icon: Globe },
  { action: "Plan upgraded", detail: "StartupHub → Pro Plan", time: "2 days ago", icon: TrendingUp },
];

const platformMetrics = [
  { label: "Uptime", value: "99.97%", sub: "Last 30 days" },
  { label: "Avg Response", value: "142ms", sub: "API latency" },
  { label: "Storage Used", value: "23.4 GB", sub: "of 100 GB" },
  { label: "API Calls", value: "1.2M", sub: "This month" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Platform Overview</h1>
            <p className="text-sm text-muted-foreground">Real-time insights across all companies</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${s.gradient} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-emerald-600" : "text-destructive"}`}>
                      {s.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {s.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Health */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {platformMetrics.map((m) => (
                <div key={m.label} className="text-center p-3 rounded-xl bg-muted/50">
                  <p className="text-lg font-bold font-heading text-foreground">{m.value}</p>
                  <p className="text-xs font-medium text-foreground/70">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Companies Table */}
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Top Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCompanies.map((c, i) => {
                  const usage = Math.round((c.members / c.maxMembers) * 100);
                  return (
                    <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                          <Badge variant={c.status === "Active" ? "default" : "destructive"} className="text-[9px] px-1.5 py-0">
                            {c.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 max-w-[120px]">
                            <Progress value={usage} className="h-1.5" />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{c.members}/{c.maxMembers}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-foreground">{c.revenue}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">{c.trend}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="p-1.5 rounded-lg bg-muted shrink-0 mt-0.5">
                      <a.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{a.action}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{a.detail}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Breakdown */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold mb-1">Monthly Recurring</p>
                <p className="text-xl font-bold font-heading text-foreground">₹4,52,000</p>
                <p className="text-xs text-muted-foreground mt-1">From 12 active companies</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/10">
                <p className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold mb-1">Annual Projected</p>
                <p className="text-xl font-bold font-heading text-foreground">₹54,24,000</p>
                <p className="text-xs text-muted-foreground mt-1">Based on current MRR</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10">
                <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">Avg Revenue/Company</p>
                <p className="text-xl font-bold font-heading text-foreground">₹37,667</p>
                <p className="text-xs text-muted-foreground mt-1">+15% from last quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
