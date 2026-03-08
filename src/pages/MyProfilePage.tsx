import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Phone, Mail, Globe, Calendar, ExternalLink, Pencil, X, Save } from "lucide-react";
import { useMyProfile, MyProfile } from "@/lib/profileContext";
import { toast } from "sonner";

const Field = ({ label, value, name, onChange }: { label: string; value: string; name: string; onChange: (name: string, val: string) => void }) => (
  <div>
    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full bg-secondary rounded-xl px-3 py-2 text-sm text-foreground outline-none border border-border focus:border-primary transition-colors"
      maxLength={255}
    />
  </div>
);

const TextArea = ({ label, value, name, onChange }: { label: string; value: string; name: string; onChange: (name: string, val: string) => void }) => (
  <div>
    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full bg-secondary rounded-xl px-3 py-2 text-sm text-foreground outline-none border border-border focus:border-primary transition-colors resize-none min-h-[80px]"
      maxLength={500}
    />
  </div>
);

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useMyProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MyProfile>(profile);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = () => {
    const trimmed = {
      ...draft,
      name: draft.name.trim(),
      role: draft.role.trim(),
      company: draft.company.trim(),
    };
    if (!trimmed.name || !trimmed.role) {
      toast.error("Name and role are required");
      return;
    }
    updateProfile(trimmed);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const setField = (path: string, value: string) => {
    setDraft((prev) => {
      const parts = path.split(".");
      if (parts.length === 1) return { ...prev, [parts[0]]: value };
      const section = parts[0] as "business" | "personal" | "social";
      return { ...prev, [section]: { ...prev[section], [parts[1]]: value } };
    });
  };

  const p = editing ? draft : profile;
  const initials = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1.5 -ml-3">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {/* Profile Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-interactive p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xl mx-auto mb-3">
          {initials}
        </div>
        {editing ? (
          <div className="space-y-2 text-left">
            <Field label="Full Name" value={draft.name} name="name" onChange={setField} />
            <Field label="Role / Title" value={draft.role} name="role" onChange={setField} />
            <Field label="Company" value={draft.company} name="company" onChange={setField} />
          </div>
        ) : (
          <>
            <h2 className="font-heading font-bold text-lg text-foreground">{p.name}</h2>
            <p className="text-sm text-muted-foreground">{p.role} · {p.company}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              {p.personal.city}
            </p>
          </>
        )}

        {!editing && (
          <button onClick={startEdit} className="btn-secondary flex items-center gap-1.5 text-xs mx-auto mt-4">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </motion.div>

      {/* Business Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-interactive p-5 space-y-3">
        <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Business
        </h3>
        {editing ? (
          <div className="space-y-2">
            <Field label="Category" value={draft.business.category} name="business.category" onChange={setField} />
            <TextArea label="Description" value={draft.business.description} name="business.description" onChange={setField} />
            <Field label="Phone" value={draft.business.phone} name="business.phone" onChange={setField} />
            <Field label="Email" value={draft.business.email} name="business.email" onChange={setField} />
            <Field label="Website" value={draft.business.website} name="business.website" onChange={setField} />
            <Field label="Address" value={draft.business.address} name="business.address" onChange={setField} />
          </div>
        ) : (
          <div className="space-y-2.5 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-foreground font-medium">{p.business.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-foreground/85 leading-relaxed">{p.business.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />{p.business.phone}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />{p.business.email}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />{p.business.website.replace("https://", "")}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span>{p.business.address}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Personal Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card-interactive p-5 space-y-3">
        <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Personal
        </h3>
        {editing ? (
          <div className="space-y-2">
            <Field label="City" value={draft.personal.city} name="personal.city" onChange={setField} />
            <Field label="Phone" value={draft.personal.phone} name="personal.phone" onChange={setField} />
            <Field label="Email" value={draft.personal.email} name="personal.email" onChange={setField} />
            <Field label="Date of Birth" value={draft.personal.dob} name="personal.dob" onChange={setField} />
          </div>
        ) : (
          <div className="space-y-2.5 text-sm">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />{p.personal.city}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />{p.personal.phone}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />{p.personal.email}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />{p.personal.dob}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="card-interactive p-5 space-y-3">
        <h3 className="font-heading font-bold text-sm text-foreground">Social Profiles</h3>
        {editing ? (
          <div className="space-y-2">
            <Field label="LinkedIn URL" value={draft.social.linkedin} name="social.linkedin" onChange={setField} />
            <Field label="Twitter URL" value={draft.social.twitter} name="social.twitter" onChange={setField} />
            <Field label="Instagram URL" value={draft.social.instagram} name="social.instagram" onChange={setField} />
            <Field label="WhatsApp Link" value={draft.social.whatsapp} name="social.whatsapp" onChange={setField} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {p.social.linkedin && (
              <a href={p.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <span className="w-8 h-8 rounded-full bg-[hsl(210,80%,45%)] text-primary-foreground flex items-center justify-center text-xs font-bold">in</span>
                LinkedIn
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
              </a>
            )}
            {p.social.twitter && (
              <a href={p.social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">𝕏</span>
                Twitter
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
              </a>
            )}
            {p.social.instagram && (
              <a href={p.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(330,80%,55%)] to-[hsl(30,90%,55%)] text-primary-foreground flex items-center justify-center text-xs">📷</span>
                Instagram
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
              </a>
            )}
            {p.social.whatsapp && (
              <a href={p.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <span className="w-8 h-8 rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground flex items-center justify-center text-xs">💬</span>
                WhatsApp
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
              </a>
            )}
          </div>
        )}
      </motion.div>

      {/* Save / Cancel buttons when editing */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex gap-2"
          >
            <button onClick={cancelEdit} className="flex-1 btn-secondary flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-heading font-semibold text-sm">
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button onClick={saveEdit} className="flex-1 btn-primary flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-heading font-semibold text-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProfilePage;
