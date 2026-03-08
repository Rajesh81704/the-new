import { Users, Calendar, Headphones, PenLine, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Members", value: "248", icon: Users, change: "+12 this month", color: "text-primary bg-primary/10" },
  { label: "Active Events", value: "6", icon: Calendar, change: "2 upcoming", color: "text-accent bg-accent/10" },
  { label: "Podcasts", value: "34", icon: Headphones, change: "+3 this week", color: "text-purple-500 bg-purple-500/10" },
  { label: "Blog Posts", value: "52", icon: PenLine, change: "5 drafts", color: "text-blue-500 bg-blue-500/10" },
  { label: "Resources", value: "18", icon: BookOpen, change: "+2 new", color: "text-emerald-500 bg-emerald-500/10" },
  { label: "Growth", value: "23%", icon: TrendingUp, change: "vs last month", color: "text-orange-500 bg-orange-500/10" },
];

const recentActivity = [
  { action: "New member registered", detail: "Sarah Lawson joined the platform", time: "2 hours ago" },
  { action: "Event created", detail: "Tech Summit 2026 added by admin", time: "5 hours ago" },
  { action: "Blog published", detail: "'5 Lessons from Scaling a Startup' is live", time: "1 day ago" },
  { action: "Resource uploaded", detail: "Startup Funding Guide PDF added", time: "2 days ago" },
  { action: "Podcast episode", detail: "Episode 34 with Michael Chen published", time: "3 days ago" },
];

const AdminDashboard = () => (
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

export default AdminDashboard;
