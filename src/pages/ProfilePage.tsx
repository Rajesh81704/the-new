import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, Phone, Mail, Globe, Calendar, MessageCircle, ExternalLink } from "lucide-react";
import { avatars } from "@/lib/avatars";
import { memberProfiles } from "@/lib/memberData";
import { useState } from "react";

const SocialIcon = ({ type }: { type: string }) => {
  const icons: Record<string, string> = {
    linkedin: "in",
    twitter: "𝕏",
    instagram: "📷",
    whatsapp: "💬",
  };
  return <span className="text-xs font-bold">{icons[type] || type}</span>;
};

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = id ? memberProfiles[id] : null;
  const [isConnected, setIsConnected] = useState(profile?.isFriend ?? false);

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Profile not found</p>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
      </div>
    );
  }

  const avatarSrc = avatars[profile.initials];

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1.5 -ml-3">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-interactive p-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xl mx-auto mb-3 overflow-hidden">
          {avatarSrc ? (
            <img src={avatarSrc} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            profile.initials
          )}
        </div>
        <h2 className="font-heading font-bold text-lg text-foreground">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.role}{profile.company ? ` at ${profile.company}` : ""}</p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" />
          {profile.personal.city}
        </p>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <a href={`tel:${profile.personal.phone}`} className="btn-primary flex items-center gap-1.5 text-xs">
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          {profile.social.whatsapp && (
            <a href={profile.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-1.5 text-xs" style={{ background: "hsl(142 70% 40%)" }}>
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
          <a href={profile.business.website} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        </div>
      </motion.div>

      {/* Business Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="card-interactive p-5 space-y-3"
      >
        <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Business
        </h3>
        <div className="space-y-2.5 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="text-foreground font-medium">{profile.business.category}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-foreground/85 leading-relaxed">{profile.business.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <a href={`tel:${profile.business.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.phone}
            </a>
            <a href={`mailto:${profile.business.email}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.email}
            </a>
            <a href={profile.business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.website.replace("https://", "")}
            </a>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{profile.business.address}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="card-interactive p-5 space-y-3"
      >
        <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Personal
        </h3>
        <div className="space-y-2.5 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.city}
            </div>
            <a href={`tel:${profile.personal.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.phone}
            </a>
            <a href={`mailto:${profile.personal.email}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.email}
            </a>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.dob}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="card-interactive p-5 space-y-3"
      >
        <h3 className="font-heading font-bold text-sm text-foreground">Social Profiles</h3>
        <div className="grid grid-cols-2 gap-2">
          {profile.social.linkedin && (
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <span className="w-8 h-8 rounded-full bg-[hsl(210,80%,45%)] text-primary-foreground flex items-center justify-center text-xs font-bold">in</span>
              LinkedIn
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </a>
          )}
          {profile.social.twitter && (
            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">𝕏</span>
              Twitter
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </a>
          )}
          {profile.social.instagram && (
            <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(330,80%,55%)] to-[hsl(30,90%,55%)] text-primary-foreground flex items-center justify-center text-xs">📷</span>
              Instagram
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </a>
          )}
          {profile.social.whatsapp && (
            <a href={profile.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <span className="w-8 h-8 rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground flex items-center justify-center text-xs">💬</span>
              WhatsApp
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Disconnect Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`w-full rounded-2xl py-3.5 font-heading font-semibold text-sm transition-all duration-150 active:scale-[0.98] ${
            isConnected
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
