import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MoreHorizontal, FileText, Video, Link2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import api from "@/lib/api";

interface Resource {
  id: string; title: string; description: string; type: "PDF" | "Video" | "Document" | "Link"; file_url: string; created_at: string;
}

const typeIcons = { PDF: FileText, Video: Video, Document: Upload, Link: Link2 };
const typeColors = { PDF: "text-red-500 bg-red-500/10", Video: "text-purple-500 bg-purple-500/10", Document: "text-blue-500 bg-blue-500/10", Link: "text-emerald-500 bg-emerald-500/10" };

const initialResources: Resource[] = [];

const emptyResource: Omit<Resource, "id"> = { title: "", description: "", type: "PDF", file_url: "", created_at: "" };

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyResource);

  const fetchResources = async () => {
    try {
      const res = await api.get("/admin/resources");
      if (res.data?.data) {
        const mapped = res.data.data.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          type: r.url?.includes('drive.google.com') ? 'Link' : r.url?.endsWith('.pdf') ? 'PDF' : r.url?.match(/mp4|youtube|vimeo/i) ? 'Video' : 'Document',
          file_url: r.url,
          created_at: new Date(r.createdAt).toISOString().split('T')[0]
        }));
        setResources(mapped);
      }
    } catch (err) {
      toast.error("Failed to load resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyResource); setDialogOpen(true); };
  const openEdit = (r: Resource) => { setEditing(r); setForm(r); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }

    const payload = {
      title: form.title,
      description: form.description,
      url: form.file_url || "https://example.com"
    };

    try {
      if (editing) {
        await api.put(`/admin/resources/${editing.id}`, payload);
        toast.success("Resource updated");
      } else {
        await api.post("/admin/resources", payload);
        toast.success("Resource added");
      }
      setDialogOpen(false);
      fetchResources();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save resource");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      toast.success("Resource deleted");
      fetchResources();
    } catch (err) {
      toast.error("Failed to delete resource");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Resources & Materials</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload PDFs or add Drive links</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Resource</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {resources.map((r, i) => {
            const Icon = typeIcons[r.type];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeColors[r.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{r.type}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(r)}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(r.id)} className="text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{r.title}</h3>
                <p className="text-xs text-muted-foreground">{r.description}</p>
                {r.file_url && <p className="text-xs text-primary mt-2 truncate">{r.file_url}</p>}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Resource" : "Add Resource"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Title</Label>
              <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Type</Label>
              <Select value={form.type} onValueChange={v => setForm(prev => ({ ...prev, type: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF Upload</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Link">Drive Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{form.type === "Link" ? "Drive / External Link" : "File URL (upload with backend)"}</Label>
              <Input value={form.file_url} onChange={e => setForm(prev => ({ ...prev, file_url: e.target.value }))} placeholder={form.type === "Link" ? "https://drive.google.com/..." : "Will be uploadable after backend setup"} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Resource"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminResources;
