import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Phone, Mail, Globe, Calendar, MessageCircle, ExternalLink, Pencil } from "lucide-react";

const MyProfilePage = () => {
  const navigate = useNavigate();

  const profile = {
    name: "Alex Johnson",
    role: "Product Designer",
    company: "Freelance",
    business: {
      category: "Design / Product",
      phone: "+1 (555) 123-4567",
      email: "alex@alexjohnson.design",
      website: "https://alexjohnson.design",
      address: "123 Creative Ave, San Francisco, CA 94102",
      description: "Independent product designer specializing in mobile-first experiences for startups. Focused on creating intuitive interfaces that drive user engagement and business growth.",
    },
    personal: {
      city: "San Francisco, CA",
      phone: "+1 (555) 123-4568",
      email: "alex.johnson@gmail.com",
      dob: "May 20, 1992",
    },
    social: {
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjdesign",
      instagram: "https://instagram.com/alexjdesign",
      whatsapp: "https://wa.me/15551234568",
    },
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
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
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xl mx-auto mb-3">
          AJ
        </div>
        <h2 className="font-heading font-bold text-lg text-foreground">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.role} · {profile.company}</p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" />
          {profile.personal.city}
        </p>
        <button className="btn-secondary flex items-center gap-1.5 text-xs mx-auto mt-4">
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </motion.div>

      {/* Business Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-interactive p-5 space-y-3">
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
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.phone}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.email}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.business.website.replace("https://", "")}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{profile.business.address}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card-interactive p-5 space-y-3">
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
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.phone}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.email}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {profile.personal.dob}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="card-interactive p-5 space-y-3">
        <h3 className="font-heading font-bold text-sm text-foreground">Social Profiles</h3>
        <div className="grid grid-cols-2 gap-2">
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span className="w-8 h-8 rounded-full bg-[hsl(210,80%,45%)] text-primary-foreground flex items-center justify-center text-xs font-bold">in</span>
            LinkedIn
            <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
          </a>
          <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">𝕏</span>
            Twitter
            <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
          </a>
          <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(330,80%,55%)] to-[hsl(30,90%,55%)] text-primary-foreground flex items-center justify-center text-xs">📷</span>
            Instagram
            <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
          </a>
          <a href={profile.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span className="w-8 h-8 rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground flex items-center justify-center text-xs">💬</span>
            WhatsApp
            <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfilePage;
