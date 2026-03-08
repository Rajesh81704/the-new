import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PodcastCardProps {
  title: string;
  speaker: string;
  duration: string;
  youtubeUrl: string;
  index: number;
}

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
};

export const PodcastCard = ({ title, speaker, duration, youtubeUrl, index }: PodcastCardProps) => {
  const [playing, setPlaying] = useState(false);
  const videoId = getYoutubeId(youtubeUrl);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="card-interactive overflow-hidden"
    >
      {playing && videoId ? (
        <div className="aspect-video bg-muted">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay"
            title={title}
          />
        </div>
      ) : (
        <div className="relative aspect-video bg-muted cursor-pointer group" onClick={() => setPlaying(true)}>
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10" />
          )}
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center group-hover:bg-foreground/30 transition-colors">
            <div className="w-14 h-14 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Play className="w-6 h-6 text-foreground ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-foreground/70 text-background text-[10px] font-medium px-1.5 py-0.5 rounded">
            {duration}
          </div>
        </div>
      )}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading font-semibold text-sm text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground">{speaker}</p>
        </div>
        <button
          onClick={() => setPlaying(!playing)}
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-transform active:scale-90"
        >
          {playing ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary ml-0.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
