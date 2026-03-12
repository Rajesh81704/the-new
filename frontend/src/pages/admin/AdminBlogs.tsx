import { useState } from "react";
import { Plus, Edit2, Trash2, MoreHorizontal, Eye, EyeOff } from "lucide-react";
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

interface Blog {
  id: string; title: string; excerpt: string; content: string; author: string; tag: string; published_at: string; is_published: boolean;
}

const initialBlogs: Blog[] = [];

const emptyBlog: Omit<Blog, "id"> = { title: "", excerpt: "", content: "", author: "", tag: "", published_at: "", is_published: false };

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyBlog);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/admin/blogs");
      if (res.data?.data) {
        const mapped = res.data.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.description || '',
          content: b.content || '',
          author: 'Admin',
          tag: 'News',
          published_at: new Date(b.createdAt).toISOString().split('T')[0],
          is_published: b.status === "PUBLISHED"
        }));
        setBlogs(mapped);
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyBlog); setDialogOpen(true); };
  const openEdit = (b: Blog) => { setEditing(b); setForm(b); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.author) { toast.error("Title and author are required"); return; }

    const payload = {
      title: form.title,
      description: form.excerpt,
      content: form.content,
      status: form.is_published ? "PUBLISHED" : "DRAFT"
    };

    try {
      if (editing) {
        await api.put(`/admin/blogs/${editing.id}`, payload);
        toast.success("Blog updated");
      } else {
        await api.post("/admin/blogs", payload);
        toast.success("Blog created");
      }
      setDialogOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save blog");
    }
  };

  const togglePublish = async (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    try {
      await api.put(`/admin/blogs/${id}`, {
        title: blog.title,
        description: blog.excerpt,
        content: blog.content,
        status: blog.is_published ? "DRAFT" : "PUBLISHED"
      });
      toast.success(`Blog ${blog.is_published ? "unpublished" : "published"}`);
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to toggle publish status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/admin/blogs/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Blogs</h1>
          <p className="text-sm text-muted-foreground mt-1">{blogs.filter(b => b.is_published).length} published, {blogs.filter(b => !b.is_published).length} drafts</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> New Post</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-semibold text-foreground">Title</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Author</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground hidden md:table-cell">Tag</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-5 py-3 text-right font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {blogs.map(b => (
                  <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{b.excerpt}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{b.author}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{b.tag}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => togglePublish(b.id)} className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${b.is_published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                        {b.is_published ? <><Eye className="w-3 h-3" /> Published</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(b)}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(b.id)} className="text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "title", label: "Title" },
              { key: "author", label: "Author" },
              { key: "tag", label: "Tag" },
              { key: "published_at", label: "Publish Date", type: "date" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{f.label}</Label>
                <Input type={f.type || "text"} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Excerpt</Label>
              <Textarea value={form.excerpt} onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Content</Label>
              <Textarea value={form.content} onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))} rows={6} placeholder="Write your blog content here... (Rich text editor coming with backend)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Publish"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogs;
