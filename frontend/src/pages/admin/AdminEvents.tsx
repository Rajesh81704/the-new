import { useState } from "react";
import { Plus, Edit2, Trash2, MoreHorizontal, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import api from "@/lib/api";

interface Event {
  id: string; title: string; date: string; time: string; location: string; category: string; description: string; image_url: string;
}

const initialEvents: Event[] = [];

const emptyEvent: Omit<Event, "id"> = { title: "", date: "", time: "", location: "", category: "", description: "", image_url: "" };

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyEvent);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/admin/events");
        if (res.data?.data) {
          const mapped = res.data.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: new Date(e.eventDate).toLocaleDateString(),
            time: new Date(e.eventDate).toLocaleTimeString(),
            location: e.location || 'Online',
            category: "General",
            description: e.description || '',
            image_url: ''
          }));
          setEvents(mapped);
        }
      } catch (err) {
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyEvent); setDialogOpen(true); };
  const openEdit = (e: Event) => { setEditing(e); setForm(e); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.title || !form.date) { toast.error("Title and date are required"); return; }
    if (editing) {
      setEvents(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e));
      toast.success("Event updated");
    } else {
      setEvents(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Event created");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success("Event deleted");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform events</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {events.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ delay: i * 0.04 }} className="bg-card rounded-2xl border border-border p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{e.category}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(e)}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(e.id)} className="text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{e.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{e.description}</p>
              <div className="mt-auto text-xs text-muted-foreground space-y-0.5">
                <p>📅 {e.date} at {e.time}</p>
                <p>📍 {e.location}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "title", label: "Event Title" },
              { key: "date", label: "Date", type: "date" },
              { key: "time", label: "Time" },
              { key: "location", label: "Location" },
              { key: "category", label: "Category" },
              { key: "image_url", label: "Image URL (optional)" },
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
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
