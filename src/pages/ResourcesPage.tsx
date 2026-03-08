import { BookOpen, FileText, Video, Download } from "lucide-react";
import { motion } from "framer-motion";

const resources = [
  { title: "Startup Funding Guide 2026", type: "PDF", icon: FileText, desc: "Complete guide to raising your first round of funding." },
  { title: "Networking Masterclass", type: "Video", icon: Video, desc: "Learn how to build meaningful professional connections." },
  { title: "Business Plan Template", type: "Document", icon: Download, desc: "Ready-to-use business plan template for startups." },
  { title: "Marketing Strategy Toolkit", type: "PDF", icon: FileText, desc: "Comprehensive marketing strategies for small businesses." },
  { title: "Financial Planning Workshop", type: "Video", icon: Video, desc: "Step-by-step financial planning for entrepreneurs." },
  { title: "Pitch Deck Examples", type: "Document", icon: Download, desc: "Top pitch deck examples from successful startups." },
];

const ResourcesPage = () => (
  <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl font-bold text-foreground mb-1">
      Resources & Materials
    </motion.h1>
    <p className="text-sm text-muted-foreground mb-6">Curated resources to help you grow.</p>
    <div className="flex flex-col gap-3">
      {resources.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card rounded-2xl border border-border p-4 flex gap-3 items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <r.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground">{r.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{r.type}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ResourcesPage;
