import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MoreHorizontal, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import api from "@/lib/api";

interface Podcast {
  id: string; title: string; guest: string; description: string; duration: string; audio_url: string; published_at: string;
}

const initialPodcasts: Podcast[] = [];

const emptyPodcast: Omit<Podcast, "id"> = { title: "", guest: "", description: "", duration: "", audio_url: "", published_at: "" };

const AdminPodcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Podcast | null>(null);
  const [form, setForm] = useState(emptyPodcast);

  const fetchPodcasts = async () => {
    try {
      const res = await api.get("/admin/podcasts");
      if (res.data?.data) {
        const mapped = res.data.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          guest: 'Guest', // Not in generic schema, so omitting
          description: p.description || '',
          duration: 'TBD', // Schema lacks duration specifically
          audio_url: p.url,
          published_at: new Date(p.createdAt).toISOString().split('T')[0]
        }));
        setPodcasts(mapped);
      }
    } catch (err) {
      toast.error("Failed to load podcasts");
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyPodcast); setDialogOpen(true); };
  const openEdit = (p: Podcast) => { setEditing(p); setForm(p); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }

    const payload = {
      title: form.title,
      description: form.description,
      url: form.audio_url || "https://example.com"
    };

    try {
      if (editing) {
        await api.put(`/admin/podcasts/${editing.id}`, payload);
        toast.success("Podcast updated");
      } else {
        await api.post("/admin/podcasts", payload);
        toast.success("Podcast added");
      }
      setDialogOpen(false);
      fetchPodcasts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save podcast");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    try {
      await api.delete(`/admin/podcasts/${id}`);
      toast.success("Podcast deleted");
      fetchPodcasts();
    } catch (err) {
      toast.error("Failed to delete podcast");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Podcasts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage podcast episodes</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Episode</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          <AnimatePresence>
            {podcasts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">with {p.guest} • {p.duration} • {p.published_at}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(p)}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Episode" : "Add Episode"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "title", label: "Episode Title" },
              { key: "guest", label: "Guest Name" },
              { key: "duration", label: "Duration (e.g. 42 min)" },
              { key: "audio_url", label: "Audio URL" },
              { key: "published_at", label: "Published Date", type: "date" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{f.label}</Label>
                <Input type={f.type || "text"} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Episode"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPodcasts;
