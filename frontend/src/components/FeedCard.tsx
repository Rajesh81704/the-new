import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { avatars } from "@/lib/avatars";
import { memberProfiles } from "@/lib/memberData";
import { InterestedDialog } from "@/components/InterestedDialog";
import { toast } from "sonner";

interface FeedCardProps {
  avatar: string;
  name: string;
  role: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  tag?: string;
  index: number;
}

export const FeedCard = ({ avatar, name, role, content, image, likes, tag, index }: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [interested, setInterested] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleInterested = () => {
    if (!interested) {
      setInterested(true);
      setShowDialog(true);
    } else {
      setInterested(false);
    }
  };

  const avatarSrc = avatars[avatar];
  const profile = memberProfiles[avatar];
  const organizer = profile
    ? {
        initials: profile.initials,
        name: profile.name,
        role: `${profile.role}${profile.company ? ` at ${profile.company}` : ""}`,
        isFriend: profile.isFriend,
        phone: profile.personal.phone,
        whatsapp: profile.social.whatsapp,
      }
    : {
        initials: avatar,
        name,
        role,
        isFriend: false,
      };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.35 }}
        className="card-interactive p-4"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm shrink-0 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
            ) : (
              avatar
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          {tag && <span className="chip">{tag}</span>}
        </div>

        <p className="text-sm text-foreground/85 leading-relaxed mb-3">{content}</p>

        {image && (
          <div className="rounded-xl overflow-hidden mb-3 bg-muted aspect-video">
            <img src={image} alt="Post media" className="w-full h-full object-cover" />
          </div>
        )}

      <div className="flex items-center gap-1 pt-2 border-t border-border">
        <button
          onClick={handleLike}
          className={`btn-ghost flex items-center gap-1.5 ${liked ? "text-destructive" : ""}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span className="text-xs">{likeCount}</span>
        </button>
        <button
          onClick={handleInterested}
          className={`ml-auto rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
            interested
              ? "bg-accent/15 text-accent border border-accent/25"
              : "bg-accent text-accent-foreground shadow-md"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${interested ? "fill-current" : ""}`} />
          {interested ? "Interested ✓" : "Interested"}
          </button>
        </div>
      </motion.div>

      <InterestedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        organizer={organizer}
        eventTitle={`${name}'s post`}
        onSendRequest={() => {
          toast.success("Connection request sent to " + name);
        }}
      />
    </>
  );
};
