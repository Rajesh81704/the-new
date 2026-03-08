import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Eye, Heart, Bookmark, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { avatars } from "@/lib/avatars";
import { toast } from "sonner";

interface Blog {
  title: string;
  author: string;
  authorInitials: string;
  date: string;
  excerpt: string;
  tag: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured?: boolean;
  coverGradient: string;
}

const blogs: Blog[] = [
  { title: "5 Lessons from Scaling a Startup to 50 Employees", author: "Sarah Lawson", authorInitials: "SL", date: "Mar 5, 2026", excerpt: "Key takeaways from growing a team from 3 to 50 in under two years, including hiring strategies and culture building.", tag: "Growth", readTime: "6 min", views: 2340, likes: 187, comments: 24, featured: true, coverGradient: "from-primary/20 to-accent/10" },
  { title: "The Future of Remote Networking in 2026", author: "Michael Kerr", authorInitials: "MK", date: "Mar 2, 2026", excerpt: "How virtual events and AI-powered matching are reshaping professional connections in the post-pandemic world.", tag: "Networking", readTime: "8 min", views: 1820, likes: 142, comments: 31, featured: true, coverGradient: "from-accent/20 to-primary/10" },
  { title: "Building a Personal Brand Online", author: "Elena Moretti", authorInitials: "EM", date: "Feb 28, 2026", excerpt: "Actionable strategies to stand out in a crowded digital landscape and attract the right opportunities.", tag: "Branding", readTime: "5 min", views: 1560, likes: 98, comments: 15, coverGradient: "from-blue-100 to-primary/5" },
  { title: "Fundraising Mistakes Every Founder Should Avoid", author: "David Wong", authorInitials: "DW", date: "Feb 24, 2026", excerpt: "Common pitfalls first-time founders face when raising capital, and how to navigate investor conversations.", tag: "Funding", readTime: "7 min", views: 1290, likes: 76, comments: 19, coverGradient: "from-destructive/10 to-accent/5" },
  { title: "Design Thinking for Modern Entrepreneurs", author: "Jessica Park", authorInitials: "JP", date: "Feb 20, 2026", excerpt: "How applying design principles can transform your product strategy and help you build things people truly want.", tag: "Design", readTime: "4 min", views: 980, likes: 64, comments: 8, coverGradient: "from-primary/15 to-muted" },
  { title: "Mastering the Art of the Cold Pitch", author: "Ryan Davis", authorInitials: "RD", date: "Feb 16, 2026", excerpt: "How to craft compelling cold emails and messages that get responses from investors and potential partners.", tag: "Growth", readTime: "5 min", views: 870, likes: 53, comments: 12, coverGradient: "from-accent/15 to-muted" },
  { title: "Why Community-Led Growth is the Future", author: "Laura Reyes", authorInitials: "LR", date: "Feb 12, 2026", excerpt: "Leveraging your community as a growth engine — strategies from brands that grew 10x through community.", tag: "Networking", readTime: "6 min", views: 1120, likes: 89, comments: 17, coverGradient: "from-primary/10 to-accent/10" },
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const BlogsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [likedBlogs, setLikedBlogs] = useState<string[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<string[]>([]);

  const tags = useMemo(() => [...new Set(blogs.map((b) => b.tag))].sort(), []);
  const featured = blogs.filter((b) => b.featured);

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag === "all" || b.tag === selectedTag;
    return matchSearch && matchTag;
  });

  const toggleLike = (title: string) => {
    setLikedBlogs((p) => p.includes(title) ? p.filter((t) => t !== title) : [...p, title]);
  };

  const toggleSave = (title: string) => {
    const saving = !savedBlogs.includes(title);
    setSavedBlogs((p) => saving ? [...p, title] : p.filter((t) => t !== title));
    toast.success(saving ? "Saved to reading list" : "Removed from reading list");
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Blogs</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights and stories from the community</p>
      </motion.div>

      {/* Featured Hero Cards */}
      <div className="space-y-2">
        <h2 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-primary" /> Trending
        </h2>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
          {featured.map((b, i) => {
            const avatar = avatars[b.authorInitials];
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`shrink-0 w-72 bg-gradient-to-br ${b.coverGradient} rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md transition-all group`}
              >
                <Badge className="text-[9px] font-normal mb-3">{b.tag}</Badge>
                <h3 className="font-heading font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">{b.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 overflow-hidden shrink-0">
                    {avatar ? <img src={avatar} alt={b.author} className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-primary">{b.authorInitials}</div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-foreground/70">{b.author}</span>
                  <span className="text-[10px] text-muted-foreground/50">·</span>
                  <span className="text-[10px] text-muted-foreground/50">{b.readTime}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="pl-9 rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedTag("all")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${selectedTag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border"}`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${selectedTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-muted-foreground">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>

      {/* Blog Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No articles match your search</div>
        ) : (
          filtered.map((b, i) => {
            const avatar = avatars[b.authorInitials];
            const isLiked = likedBlogs.includes(b.title);
            const isSaved = savedBlogs.includes(b.title);
            return (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-shadow cursor-pointer group"
              >
                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[9px] font-normal">{b.tag}</Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{b.readTime}</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{b.excerpt}</p>

                  {/* Author & Meta */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 overflow-hidden shrink-0">
                        {avatar ? <img src={avatar} alt={b.author} className="w-full h-full object-cover" /> : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-primary">{b.authorInitials}</div>
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-foreground">{b.author}</p>
                        <p className="text-[9px] text-muted-foreground">{b.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Eye className="w-3 h-3" />{b.views.toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-7 text-[11px] gap-1 ${isLiked ? "text-destructive" : "text-muted-foreground"}`}
                      onClick={(e) => { e.stopPropagation(); toggleLike(b.title); }}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-destructive" : ""}`} />
                      {b.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground">
                      <MessageCircle className="w-3.5 h-3.5" />{b.comments}
                    </Button>
                    <div className="ml-auto flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${isSaved ? "text-primary" : "text-muted-foreground"}`}
                        onClick={(e) => { e.stopPropagation(); toggleSave(b.title); }}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-primary" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
