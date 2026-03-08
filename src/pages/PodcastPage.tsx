import { PodcastCard } from "@/components/PodcastCard";

const podcasts = [
  { title: "The Growth Loop — Retention Strategies", speaker: "Michael Kerr", duration: "32 min", color: "bg-primary/15" },
  { title: "Founder Stories: From Idea to Series A", speaker: "Sarah Lawson", duration: "45 min", color: "bg-accent/15" },
  { title: "Design at Scale", speaker: "Jessica Park", duration: "28 min", color: "bg-secondary" },
  { title: "The Future of Remote Work", speaker: "Tom Chen", duration: "38 min", color: "bg-primary/10" },
  { title: "Investing in Early-Stage Startups", speaker: "Ryan Davis", duration: "52 min", color: "bg-accent/10" },
  { title: "Building Inclusive Products", speaker: "Amara Kim", duration: "35 min", color: "bg-secondary" },
];

const PodcastPage = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Podcasts</h2>
        <p className="text-sm text-muted-foreground">Audio content from the community</p>
      </div>
      <div className="space-y-2">
        {podcasts.map((p, i) => (
          <PodcastCard key={p.title} index={i} {...p} />
        ))}
      </div>
    </div>
  );
};

export default PodcastPage;
