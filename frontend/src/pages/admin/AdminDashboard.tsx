import { Users, Calendar, Headphones, PenLine, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const initialStats = [
  { label: "Total Members", value: "0", icon: Users, change: "...", color: "text-primary bg-primary/10" },
  { label: "Active Events", value: "0", icon: Calendar, change: "...", color: "text-accent bg-accent/10" },
  { label: "Podcasts", value: "0", icon: Headphones, change: "...", color: "text-purple-500 bg-purple-500/10" },
  { label: "Blog Posts", value: "0", icon: PenLine, change: "...", color: "text-blue-500 bg-blue-500/10" },
  { label: "Resources", value: "0", icon: BookOpen, change: "...", color: "text-emerald-500 bg-emerald-500/10" },
  { label: "Growth", value: "0%", icon: TrendingUp, change: "...", color: "text-orange-500 bg-orange-500/10" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        if (res.data?.data) {
          const fetchedStats = res.data.data.stats || [];
          setStats((prev) =>
            prev.map((s) => {
              const matchingAPI = fetchedStats.find((f: any) => f.label === s.label);
              return matchingAPI ? { ...s, value: matchingAPI.value } : s;
            })
          );
          setRecentActivity(res.data.data.recentActivity || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your platform activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="px-5 py-3.5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
