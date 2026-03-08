import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Video, Download, ExternalLink, Search, Filter, Eye, Clock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
  title: string;
  type: "PDF" | "Video" | "Document" | "Link";
  desc: string;
  category: string;
  author: string;
  date: string;
  views: number;
  featured?: boolean;
}

const resources: Resource[] = [
  { title: "Startup Funding Guide 2026", type: "PDF", desc: "Complete guide to raising your first round of funding with investor pitch strategies.", category: "Finance", author: "Ryan Davis", date: "Mar 6, 2026", views: 1240, featured: true },
  { title: "Networking Masterclass", type: "Video", desc: "Learn how to build meaningful professional connections that drive business growth.", category: "Networking", author: "Sarah Lawson", date: "Mar 4, 2026", views: 890 },
  { title: "Business Plan Template", type: "Document", desc: "Ready-to-use business plan template used by YC-backed startups.", category: "Strategy", author: "Michael Kerr", date: "Mar 1, 2026", views: 2100, featured: true },
  { title: "Marketing Strategy Toolkit", type: "PDF", desc: "Comprehensive marketing strategies and frameworks for small businesses.", category: "Marketing", author: "Elena Moretti", date: "Feb 28, 2026", views: 760 },
  { title: "Financial Planning Workshop", type: "Video", desc: "Step-by-step financial planning and budgeting for early-stage entrepreneurs.", category: "Finance", author: "David Wong", date: "Feb 25, 2026", views: 540 },
  { title: "Pitch Deck Examples", type: "Document", desc: "Top 10 pitch deck examples from companies that raised $1M+ seed rounds.", category: "Strategy", author: "Jessica Park", date: "Feb 22, 2026", views: 1870 },
  { title: "SEO for Startups Guide", type: "Link", desc: "How to rank your startup website and drive organic traffic from day one.", category: "Marketing", author: "Tom Chen", date: "Feb 18, 2026", views: 430 },
  { title: "Legal Essentials for Founders", type: "PDF", desc: "Key legal documents and compliance requirements every founder needs.", category: "Legal", author: "Laura Reyes", date: "Feb 15, 2026", views: 680 },
];

const typeIcons: Record<string, typeof FileText> = { PDF: FileText, Video: Video, Document: Download, Link: ExternalLink };
const typeColors: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive",
  Video: "bg-primary/10 text-primary",
  Document: "bg-accent/10 text-accent",
  Link: "bg-blue-100 text-blue-700",
};

const ResourcesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const categories = useMemo(() => [...new Set(resources.map((r) => r.category))].sort(), []);
  const types = useMemo(() => [...new Set(resources.map((r) => r.type))].sort(), []);

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || r.category === selectedCategory;
    const matchType = selectedType === "all" || r.type === selectedType;
    return matchSearch && matchCat && matchType;
  });

  const featured = resources.filter((r) => r.featured);

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Resources & Materials</h1>
        <p className="text-sm text-muted-foreground mt-1">Curated content to accelerate your growth</p>
      </motion.div>

      {/* Featured */}
      <div className="space-y-2">
        <h2 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-accent" /> Featured
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {featured.map((r, i) => {
            const Icon = typeIcons[r.type];
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20 p-4 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl ${typeColors[r.type]} flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-semibold text-xs text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{r.desc}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground/70">
                  <Eye className="w-3 h-3" />{r.views.toLocaleString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="pl-9 rounded-xl" />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="flex-1 rounded-xl h-9 text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || selectedType !== "all") && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategory !== "all" && (
            <button onClick={() => setSelectedCategory("all")} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors">
              {selectedCategory} ×
            </button>
          )}
          {selectedType !== "all" && (
            <button onClick={() => setSelectedType("all")} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors">
              {selectedType} ×
            </button>
          )}
          <button onClick={() => { setSelectedCategory("all"); setSelectedType("all"); }} className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-medium hover:bg-muted/80 transition-colors">
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Resource List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No resources match your search</div>
        ) : (
          filtered.map((r, i) => {
            const Icon = typeIcons[r.type];
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl border border-border p-4 flex gap-3.5 items-start hover:shadow-sm transition-shadow cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl ${typeColors[r.type]} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">{r.title}</h3>
                    <Badge variant="secondary" className="text-[9px] shrink-0 font-normal">{r.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-muted-foreground/70">
                    <span className="font-medium text-foreground/60">{r.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{r.views.toLocaleString()}</span>
                  </div>
                  <Badge className="mt-2 text-[9px] font-normal bg-muted text-muted-foreground hover:bg-muted">{r.category}</Badge>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
