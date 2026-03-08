import { motion } from "framer-motion";

const blogs = [
  { title: "5 Lessons from Scaling a Startup", author: "Sarah Lawson", date: "Mar 5, 2026", excerpt: "Key takeaways from growing a team from 3 to 50 in under two years.", tag: "Growth" },
  { title: "The Future of Remote Networking", author: "Michael Chen", date: "Mar 2, 2026", excerpt: "How virtual events are reshaping professional connections in 2026.", tag: "Networking" },
  { title: "Building a Personal Brand Online", author: "Elena Rodriguez", date: "Feb 28, 2026", excerpt: "Actionable strategies to stand out in a crowded digital landscape.", tag: "Branding" },
  { title: "Fundraising Mistakes to Avoid", author: "David Park", date: "Feb 24, 2026", excerpt: "Common pitfalls first-time founders face when raising capital.", tag: "Funding" },
  { title: "Design Thinking for Entrepreneurs", author: "Alex Johnson", date: "Feb 20, 2026", excerpt: "How applying design principles can transform your product strategy.", tag: "Design" },
];

const BlogsPage = () => (
  <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl font-bold text-foreground mb-1">
      Blogs
    </motion.h1>
    <p className="text-sm text-muted-foreground mb-6">Insights and stories from the community.</p>
    <div className="flex flex-col gap-4">
      {blogs.map((b, i) => (
        <motion.article
          key={b.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card rounded-2xl border border-border p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{b.tag}</span>
            <span className="text-[10px] text-muted-foreground">{b.date}</span>
          </div>
          <h3 className="font-semibold text-sm text-foreground mb-1">{b.title}</h3>
          <p className="text-xs text-muted-foreground mb-2">{b.excerpt}</p>
          <p className="text-xs text-muted-foreground">By <span className="text-foreground font-medium">{b.author}</span></p>
        </motion.article>
      ))}
    </div>
  </div>
);

export default BlogsPage;
