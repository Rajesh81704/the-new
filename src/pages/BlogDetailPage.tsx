import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Heart, Bookmark, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { avatars } from "@/lib/avatars";
import { useState } from "react";
import { toast } from "sonner";

const blogsData: Record<string, { title: string; author: string; authorInitials: string; date: string; tag: string; readTime: string; views: number; likes: number; coverGradient: string; paragraphs: string[] }> = {
  "5-lessons-from-scaling-a-startup-to-50-employees": {
    title: "5 Lessons from Scaling a Startup to 50 Employees",
    author: "Sarah Lawson", authorInitials: "SL", date: "Mar 5, 2026", tag: "Growth", readTime: "6 min", views: 2340, likes: 187,
    coverGradient: "from-primary/20 to-accent/10",
    paragraphs: [
      "Scaling a startup is one of the most rewarding — and challenging — experiences an entrepreneur can go through. When we started with just 3 people in a tiny co-working space, we had no idea we'd grow to 50 in under two years.",
      "Lesson 1: Hire for culture, not just skills. Early hires set the tone for everything that follows. We made the mistake of hiring purely on technical ability and learned the hard way that a brilliant developer who doesn't align with your values can derail an entire team.",
      "Lesson 2: Document everything early. When you're 5 people, tribal knowledge works. At 20, it breaks down completely. We started building our internal wiki at employee #15 and wished we'd done it at #3.",
      "Lesson 3: Over-communicate, then communicate some more. As teams grow, information silos form naturally. Weekly all-hands, async updates, and transparent dashboards became our lifeline.",
      "Lesson 4: Invest in managers before you need them. We waited too long to promote team leads. By the time we did, several direct reports were already frustrated with the lack of guidance and growth paths.",
      "Lesson 5: Protect the mission. Growth creates noise. New priorities, customer demands, investor expectations — it's easy to lose sight of why you started. We printed our mission on the wall and referenced it in every major decision.",
      "Looking back, I wouldn't trade this journey for anything. If you're in the thick of scaling right now, know that the chaos is temporary, but the lessons are permanent."
    ]
  },
  "the-future-of-remote-networking-in-2026": {
    title: "The Future of Remote Networking in 2026",
    author: "Michael Kerr", authorInitials: "MK", date: "Mar 2, 2026", tag: "Networking", readTime: "8 min", views: 1820, likes: 142,
    coverGradient: "from-accent/20 to-primary/10",
    paragraphs: [
      "The way professionals connect has fundamentally changed. The pandemic accelerated remote work, but 2026 is showing us that remote networking is evolving into something far more sophisticated.",
      "AI-powered matching algorithms now analyze your professional goals, communication style, and even timezone preferences to suggest connections that are genuinely meaningful — not just random LinkedIn requests.",
      "Virtual events have matured beyond awkward Zoom calls. Spatial audio, interactive workshops, and AI-facilitated breakout rooms create experiences that rival in-person events for depth of connection.",
      "The rise of async networking is perhaps the most underrated trend. Platforms now allow you to leave voice notes, video introductions, and collaborative documents that others can engage with on their own time.",
      "However, the human element remains irreplaceable. The most successful remote networkers in 2026 blend technology with genuine curiosity and follow-through. A thoughtful message still beats a thousand automated connections.",
      "As we look ahead, the line between remote and in-person networking will continue to blur, creating hybrid experiences that offer the best of both worlds."
    ]
  },
  "building-a-personal-brand-online": {
    title: "Building a Personal Brand Online",
    author: "Elena Moretti", authorInitials: "EM", date: "Feb 28, 2026", tag: "Branding", readTime: "5 min", views: 1560, likes: 98,
    coverGradient: "from-blue-100 to-primary/5",
    paragraphs: [
      "Your personal brand is what people say about you when you're not in the room. In a digital-first world, that 'room' is the internet — and your brand is being shaped whether you're intentional about it or not.",
      "Start with clarity. What do you want to be known for? Pick one or two themes and commit to them. Trying to be everything to everyone results in being memorable to no one.",
      "Consistency beats virality. Posting regularly, engaging authentically, and showing up in your niche community will compound over time in ways that a single viral post never can.",
      "Share your process, not just your results. People connect with the journey — the failures, the pivots, the messy middle. Polished highlight reels are forgettable; honest stories are magnetic.",
      "Finally, invest in relationships, not just reach. A small, engaged audience that trusts you is infinitely more valuable than thousands of passive followers."
    ]
  },
  "fundraising-mistakes-every-founder-should-avoid": {
    title: "Fundraising Mistakes Every Founder Should Avoid",
    author: "David Wong", authorInitials: "DW", date: "Feb 24, 2026", tag: "Funding", readTime: "7 min", views: 1290, likes: 76,
    coverGradient: "from-destructive/10 to-accent/5",
    paragraphs: [
      "Raising capital is a skill, and like any skill, most of us are terrible at it the first time. Here are the mistakes I see founders make over and over — and how to avoid them.",
      "Mistake 1: Pitching too early. If you don't have clear traction or a compelling narrative, you're wasting warm introductions. Investors remember bad pitches.",
      "Mistake 2: Not knowing your numbers. Revenue, burn rate, CAC, LTV — if an investor asks and you fumble, the meeting is effectively over.",
      "Mistake 3: Treating fundraising as a goal instead of a tool. Capital should accelerate a working business model, not substitute for one. Raise when you need to, not because you can.",
      "Mistake 4: Ignoring the human side. Investors back people. Practice your storytelling, be genuine about challenges, and show resilience. The best pitch decks don't close deals — founders do.",
      "Mistake 5: Giving up too soon. The average successful raise takes 3-6 months and 50+ meetings. Rejection is data, not destiny."
    ]
  },
  "design-thinking-for-modern-entrepreneurs": {
    title: "Design Thinking for Modern Entrepreneurs",
    author: "Jessica Park", authorInitials: "JP", date: "Feb 20, 2026", tag: "Design", readTime: "4 min", views: 980, likes: 64,
    coverGradient: "from-primary/15 to-muted",
    paragraphs: [
      "Design thinking isn't just for designers. It's a problem-solving framework that every entrepreneur should have in their toolkit.",
      "At its core, design thinking is about empathy — deeply understanding the people you're building for before jumping to solutions. Most startups fail not because of bad technology, but because they solve problems nobody has.",
      "The five stages — Empathize, Define, Ideate, Prototype, Test — provide a structured way to move from ambiguity to clarity. But the real magic is in the iteration.",
      "Build quick, ugly prototypes. Test them with real users. Listen more than you talk. Then do it again. The founders who embrace this cycle build products people actually want to use.",
      "In 2026, the best entrepreneurs aren't just business-minded — they're design-minded. They obsess over user experience, question assumptions, and treat every feature as a hypothesis to validate."
    ]
  },
  "mastering-the-art-of-the-cold-pitch": {
    title: "Mastering the Art of the Cold Pitch",
    author: "Ryan Davis", authorInitials: "RD", date: "Feb 16, 2026", tag: "Growth", readTime: "5 min", views: 870, likes: 53,
    coverGradient: "from-accent/15 to-muted",
    paragraphs: [
      "Cold outreach has a bad reputation, and honestly, most of it deserves it. But done right, a cold pitch can open doors that no amount of warm networking can.",
      "The secret? Make it about them, not you. Research the person, reference their work, and clearly articulate why connecting would be mutually beneficial.",
      "Keep it short. Your first message should be 3-4 sentences max. If someone needs to scroll to read your pitch, they won't read it at all.",
      "Follow up exactly once, 5-7 days later. More than that and you're annoying. Less than that and you're forgettable.",
      "Track everything. Use a simple spreadsheet to log who you've reached out to, when, and what happened. Patterns will emerge that sharpen your approach over time."
    ]
  },
  "why-community-led-growth-is-the-future": {
    title: "Why Community-Led Growth is the Future",
    author: "Laura Reyes", authorInitials: "LR", date: "Feb 12, 2026", tag: "Networking", readTime: "6 min", views: 1120, likes: 89,
    coverGradient: "from-primary/10 to-accent/10",
    paragraphs: [
      "The companies growing fastest in 2026 aren't just acquiring customers — they're building communities. And there's a crucial difference.",
      "Customers buy your product. Community members champion it. They create content, answer support questions, provide feedback, and bring in new users organically.",
      "The key is to create genuine value before asking for anything. Host events, share knowledge, facilitate connections between members. When your community thrives, your business follows.",
      "Tools matter, but culture matters more. Slack channels and Discord servers are just containers. What makes a community alive is shared purpose, rituals, and recognition.",
      "Start small. The best communities began with 10 passionate people, not 10,000 lukewarm ones. Depth of engagement always beats breadth of reach.",
      "If you're building a startup in 2026, community isn't a nice-to-have — it's your most defensible growth channel."
    ]
  }
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = slug ? blogsData[slug] : null;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!blog) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Blog not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/blogs")}>Back to Blogs</Button>
      </div>
    );
  }

  const avatar = avatars[blog.authorInitials];

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-24">
      <button onClick={() => navigate("/blogs")} className="btn-ghost flex items-center gap-1.5 -ml-3 mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <motion.article initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className={`bg-gradient-to-br ${blog.coverGradient} rounded-2xl p-6 border border-border`}>
          <Badge className="text-[10px] mb-3">{blog.tag}</Badge>
          <h1 className="font-heading text-xl font-bold text-foreground leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 overflow-hidden shrink-0">
              {avatar ? <img src={avatar} alt={blog.author} className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">{blog.authorInitials}</div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{blog.author}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{blog.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {blog.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-foreground/85 leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${liked ? "text-destructive" : "text-muted-foreground"}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-destructive" : ""}`} />
            {blog.likes + (liked ? 1 : 0)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`ml-auto gap-1.5 ${saved ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from reading list" : "Saved to reading list"); }}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-primary" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogDetailPage;
