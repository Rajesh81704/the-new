import { PodcastCard } from "@/components/PodcastCard";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await api.get("/user/podcasts");
        setPodcasts((res.data?.data || []).map((p: any) => ({
          ...p,
          youtubeUrl: p.url, // Map DB url to expected youtubeUrl prop
          duration: "New", // placeholder
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (loading) return <div>Loading...</div>;
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
