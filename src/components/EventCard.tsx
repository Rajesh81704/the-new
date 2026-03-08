import { MapPin, Clock, Users, Video, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { InterestedDialog } from "@/components/InterestedDialog";
import { toast } from "sonner";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  platform?: string;
  description?: string;
  organizer: {
    initials: string;
    name: string;
    role: string;
    isFriend: boolean;
    phone?: string;
    whatsapp?: string;
  };
  index: number;
}

export const EventCard = ({ title, date, time, location, attendees, image, platform, description, organizer, index }: EventCardProps) => {
  const [interested, setInterested] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleInterested = () => {
    if (!interested) {
      setInterested(true);
      setShowDialog(true);
    } else {
      setInterested(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.3 }}
        className="card-interactive overflow-hidden"
      >
        <div className="aspect-[2/1] overflow-hidden bg-muted">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-foreground text-base leading-tight">{title}</h3>
            {platform && (
              <span className="shrink-0 flex items-center gap-1 chip text-[10px]">
                <Video className="w-3 h-3" />
                {platform}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{attendees} attending</span>
            </div>
            <button
              onClick={handleInterested}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
                interested
                  ? "bg-accent/15 text-accent border border-accent/25"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${interested ? "fill-current" : ""}`} />
              {interested ? "Interested ✓" : "Interested"}
            </button>
          </div>
        </div>
      </motion.div>

      <InterestedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        organizer={organizer}
        eventTitle={title}
        onSendRequest={() => {
          toast.success("Connection request sent to " + organizer.name);
        }}
      />
    </>
  );
};
