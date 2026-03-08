import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PodcastCardProps {
  title: string;
  speaker: string;
  duration: string;
  color: string;
  index: number;
}

export const PodcastCard = ({ title, speaker, duration, color, index }: PodcastCardProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="card-interactive p-4 flex items-center gap-3"
    >
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <button
          onClick={() => setPlaying(!playing)}
          className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center transition-transform active:scale-90"
        >
          {playing ? (
            <Pause className="w-3.5 h-3.5 text-foreground" />
          ) : (
            <Play className="w-3.5 h-3.5 text-foreground ml-0.5" />
          )}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{speaker}</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{duration}</p>
      </div>
    </motion.div>
  );
};
