import { motion } from "framer-motion";
import { useState } from "react";
import { avatars } from "@/lib/avatars";

interface PersonCardProps {
  initials: string;
  name: string;
  role: string;
  company?: string;
  connected?: boolean;
  index: number;
}

export const PersonCard = ({ initials, name, role, company, connected = false, index }: PersonCardProps) => {
  const [isConnected, setIsConnected] = useState(connected);
  const avatarSrc = avatars[initials];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="card-interactive p-4 flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm shrink-0 overflow-hidden">
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{role}</p>
        {company && <p className="text-xs text-muted-foreground/70 truncate">{company}</p>}
      </div>
      <button
        onClick={() => setIsConnected(!isConnected)}
        className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-150 active:scale-95 ${
          isConnected
            ? "bg-secondary text-secondary-foreground border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>
    </motion.div>
  );
};
