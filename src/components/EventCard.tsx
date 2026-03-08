import { MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  color: string;
  index: number;
}

export const EventCard = ({ title, date, time, location, attendees, color, index }: EventCardProps) => {
  const [rsvp, setRsvp] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="card-interactive overflow-hidden"
    >
      <div className={`h-28 ${color} flex items-end p-4`}>
        <h3 className="font-heading font-bold text-foreground text-base">{title}</h3>
      </div>
      <div className="p-4 space-y-2.5">
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
            onClick={() => setRsvp(!rsvp)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-95 ${
              rsvp
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {rsvp ? "Registered ✓" : "RSVP"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
