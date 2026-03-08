import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Plus, Trash2, Eye, Copy, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMyProfile } from "@/lib/profileContext";
import { useBusinessCards, BusinessCard } from "@/lib/businessCardContext";
import { toast } from "sonner";
import { BusinessCardPreview } from "@/components/BusinessCardPreview";

export default function ShareBusinessPage() {
  const navigate = useNavigate();
  const { profile } = useMyProfile();
  const { cards, addCard, deleteCard } = useBusinessCards();

  const [step, setStep] = useState<"list" | "template" | "edit">("list");
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic">("modern");
  const [previewCard, setPreviewCard] = useState<BusinessCard | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    name: profile.name,
    role: profile.role,
    company: profile.company,
    phone: profile.business.phone,
    email: profile.business.email,
    website: profile.business.website,
    address: profile.business.address,
    description: profile.business.description,
    imageUrl: "",
    linkedin: profile.social.linkedin,
    twitter: profile.social.twitter,
    instagram: profile.social.instagram,
    whatsapp: profile.social.whatsapp,
  });

  const setField = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("imageUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const card: BusinessCard = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      template: selectedTemplate,
      ...form,
    };
    addCard(card);
    toast.success("Business card created!");
    setStep("list");
  };

  const getShareUrl = (id: string) => `${window.location.origin}/card/${id}`;

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(getShareUrl(id));
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNew = () => {
    setForm({
      name: profile.name, role: profile.role, company: profile.company,
      phone: profile.business.phone, email: profile.business.email,
      website: profile.business.website, address: profile.business.address,
      description: profile.business.description, imageUrl: "",
      linkedin: profile.social.linkedin, twitter: profile.social.twitter,
      instagram: profile.social.instagram, whatsapp: profile.social.whatsapp,
    });
    setStep("template");
  };

  // LIST VIEW
  if (step === "list") {
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
        <button onClick={() => navigate("/my-profile")} className="btn-ghost flex items-center gap-1.5 -ml-3">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back to Profile</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Share Business Details</h1>
              <p className="text-sm text-muted-foreground">Create & share your digital business card</p>
            </div>
            <Button onClick={startNew} size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Card</Button>
          </div>
        </motion.div>

        {cards.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
            <Share2 className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground text-sm">No business cards yet</p>
            <Button onClick={startNew} variant="outline" size="sm">Create your first card</Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {card.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground truncate">{card.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{card.role} · {card.company}</p>
                        <p className="text-[10px] text-muted-foreground/70 capitalize mt-0.5">{card.template} template</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewCard(card)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyLink(card.id)}>
                          {copiedId === card.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteCard(card.id); toast.success("Card deleted"); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewCard} onOpenChange={() => setPreviewCard(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle className="font-heading text-sm">Card Preview</DialogTitle>
            </DialogHeader>
            {previewCard && <div className="p-4"><BusinessCardPreview card={previewCard} /></div>}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // TEMPLATE SELECTION
  if (step === "template") {
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
        <button onClick={() => setStep("list")} className="btn-ghost flex items-center gap-1.5 -ml-3">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
        </button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold text-foreground mb-1">Choose a Template</h1>
          <p className="text-sm text-muted-foreground mb-6">Select a design for your digital business card</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {/* Modern Template Preview */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <button
              onClick={() => { setSelectedTemplate("modern"); setStep("edit"); }}
              className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${selectedTemplate === "modern" ? "border-primary shadow-md" : "border-border hover:border-primary/40"}`}
            >
              <div className="bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">AJ</div>
                  <div>
                    <p className="font-heading font-bold">Alex Johnson</p>
                    <p className="text-sm opacity-80">Product Designer</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-card">
                <p className="font-heading font-semibold text-sm text-foreground">Modern Template</p>
                <p className="text-xs text-muted-foreground">Bold gradient header with clean card layout</p>
              </div>
            </button>
          </motion.div>

          {/* Classic Template Preview */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button
              onClick={() => { setSelectedTemplate("classic"); setStep("edit"); }}
              className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${selectedTemplate === "classic" ? "border-primary shadow-md" : "border-border hover:border-primary/40"}`}
            >
              <div className="bg-card p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">AJ</div>
                  <div>
                    <p className="font-heading font-bold text-foreground">Alex Johnson</p>
                    <p className="text-sm text-muted-foreground">Product Designer</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-card">
                <p className="font-heading font-semibold text-sm text-foreground">Classic Template</p>
                <p className="text-xs text-muted-foreground">Elegant minimal design with rounded avatar</p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // EDIT VIEW
  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
      <button onClick={() => setStep("template")} className="btn-ghost flex items-center gap-1.5 -ml-3">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
      </button>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-xl font-bold text-foreground mb-1">Fill Business Details</h1>
        <p className="text-sm text-muted-foreground">Template: <span className="capitalize font-medium text-foreground">{selectedTemplate}</span></p>
      </motion.div>

      {/* Image Upload */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <Label className="text-xs text-muted-foreground mb-2 block">Profile Image</Label>
          <div className="flex items-center gap-4">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
              </div>
            )}
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {form.imageUrl ? "Change Image" : "Upload Image"}
              </Button>
              <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG under 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Form */}
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setField("name", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={form.role} onChange={e => setField("role", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Company</Label><Input value={form.company} onChange={e => setField("company", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setField("phone", e.target.value)} /></div>
            <div className="col-span-2 space-y-1.5"><Label className="text-xs">Email *</Label><Input value={form.email} onChange={e => setField("email", e.target.value)} /></div>
            <div className="col-span-2 space-y-1.5"><Label className="text-xs">Website</Label><Input value={form.website} onChange={e => setField("website", e.target.value)} /></div>
            <div className="col-span-2 space-y-1.5"><Label className="text-xs">Address</Label><Input value={form.address} onChange={e => setField("address", e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <p className="font-heading text-sm font-semibold text-foreground">Social Links</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">LinkedIn</Label><Input value={form.linkedin} onChange={e => setField("linkedin", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Twitter / X</Label><Input value={form.twitter} onChange={e => setField("twitter", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Instagram</Label><Input value={form.instagram} onChange={e => setField("instagram", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">WhatsApp</Label><Input value={form.whatsapp} onChange={e => setField("whatsapp", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setStep("template")}>Back</Button>
        <Button className="flex-1" onClick={handleCreate}>Create Card</Button>
      </div>
    </div>
  );
}
