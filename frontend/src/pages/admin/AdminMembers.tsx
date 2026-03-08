import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, MoreHorizontal, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  email: string;
  city: string;
  status: "active" | "inactive";
}

const initialMembers: Member[] = [];

const emptyMember = { id: "", name: "", role: "", company: "", category: "", email: "", city: "", status: "active" as const };

const AdminMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<Omit<Member, "id">>(emptyMember);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyMember); setDialogOpen(true); };
  const openEdit = (m: Member) => { setEditing(m); setForm(m); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } : m));
      toast.success("Member updated");
    } else {
      setMembers(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Member added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success("Member deleted");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">{members.length} total members</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-semibold text-foreground">Name</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Role</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground hidden md:table-cell">Category</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground hidden lg:table-cell">City</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-5 py-3 text-right font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filtered.map(m => (
                  <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{m.role}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{m.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell">{m.city}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate("/")}>
                            <LogIn className="w-3.5 h-3.5 mr-2" /> Enter as User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(m)}>
                            <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(m.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "name", label: "Full Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role / Title" },
              { key: "company", label: "Company" },
              { key: "category", label: "Category" },
              { key: "city", label: "City" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{f.label}</Label>
                <Input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Member"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
