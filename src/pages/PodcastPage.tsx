import { PodcastCard } from "@/components/PodcastCard";

const podcasts = [
  { title: "The Growth Loop — Retention Strategies", speaker: "Michael Kerr", duration: "32 min", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { title: "Founder Stories: From Idea to Series A", speaker: "Sarah Lawson", duration: "45 min", youtubeUrl: "https://www.youtube.com/watch?v=ZK-rNEhJIDs" },
  { title: "Design at Scale", speaker: "Jessica Park", duration: "28 min", youtubeUrl: "https://www.youtube.com/watch?v=rUkIJBgA3IM" },
  { title: "The Future of Remote Work", speaker: "Tom Chen", duration: "38 min", youtubeUrl: "https://www.youtube.com/watch?v=UBOj6rqRUME" },
  { title: "Investing in Early-Stage Startups", speaker: "Ryan Davis", duration: "52 min", youtubeUrl: "https://www.youtube.com/watch?v=Yc3GhGEcEOg" },
  { title: "Building Inclusive Products", speaker: "Amara Kim", duration: "35 min", youtubeUrl: "https://www.youtube.com/watch?v=6Af6b_wyiwI" },
];

const PodcastPage = () => {
  return (
    <div className="min-h-screen bg-section-rose/40">
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Podcasts</h2>
        <p className="text-sm text-muted-foreground">Video content from the community</p>
      </div>
      <div className="space-y-3">
        {podcasts.map((p, i) => (
          <PodcastCard key={p.title} index={i} {...p} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default PodcastPage;
