import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Building2, Search } from "lucide-react";
import { toast } from "sonner";

const ALL_MODULES = [
  { id: "members", label: "Members Management" },
  { id: "events", label: "Events" },
  { id: "podcasts", label: "Podcasts" },
  { id: "blogs", label: "Blogs" },
  { id: "resources", label: "Resources" },
  { id: "friends", label: "Friend System" },
  { id: "feed", label: "News Feed" },
  { id: "messaging", label: "Messaging" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
  { id: "membership", label: "Membership Plans" },
];

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Every 4 Months" },
  { value: "biannual", label: "Every 6 Months" },
  { value: "yearly", label: "Yearly" },
];

interface Company {
  id: string;
  name: string;
  maxMembers: number;
  modules: string[];
  amount: number;
  billingCycle: string;
  status: "active" | "inactive" | "suspended";
  currentMembers: number;
}

const initialCompanies: Company[] = [
  { id: "1", name: "TechNet India", maxMembers: 1000, modules: ["members", "events", "podcasts", "blogs", "resources", "friends", "feed", "messaging", "analytics", "settings", "membership"], amount: 50000, billingCycle: "monthly", status: "active", currentMembers: 500 },
  { id: "2", name: "StartupHub", maxMembers: 250, modules: ["members", "events", "blogs", "feed", "friends", "settings"], amount: 25000, billingCycle: "quarterly", status: "active", currentMembers: 120 },
  { id: "3", name: "BizConnect", maxMembers: 50, modules: ["members", "events", "feed", "settings"], amount: 8000, billingCycle: "monthly", status: "active", currentMembers: 45 },
  { id: "4", name: "NetVentures", maxMembers: 250, modules: ["members", "events", "podcasts", "blogs", "resources", "feed", "settings"], amount: 30000, billingCycle: "yearly", status: "active", currentMembers: 89 },
];

export default function SuperAdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formName, setFormName] = useState("");
  const [formMaxMembers, setFormMaxMembers] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formBillingCycle, setFormBillingCycle] = useState("monthly");
  const [formModules, setFormModules] = useState<string[]>([]);

  const resetForm = () => {
    setFormName(""); setFormMaxMembers(""); setFormAmount(""); setFormBillingCycle("monthly"); setFormModules([]); setEditingCompany(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    setFormName(c.name); setFormMaxMembers(String(c.maxMembers)); setFormAmount(String(c.amount)); setFormBillingCycle(c.billingCycle); setFormModules(c.modules);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formMaxMembers || !formAmount) {
      toast.error("Please fill all required fields"); return;
    }
    if (editingCompany) {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, name: formName, maxMembers: Number(formMaxMembers), amount: Number(formAmount), billingCycle: formBillingCycle, modules: formModules } : c));
      toast.success("Company updated successfully");
    } else {
      const newCompany: Company = { id: Date.now().toString(), name: formName, maxMembers: Number(formMaxMembers), modules: formModules, amount: Number(formAmount), billingCycle: formBillingCycle, status: "active", currentMembers: 0 };
      setCompanies(prev => [...prev, newCompany]);
      toast.success("Company created successfully");
    }
    setDialogOpen(false); resetForm();
  };

  const toggleModule = (moduleId: string) => {
    setFormModules(prev => prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]);
  };

  const toggleStatus = (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "suspended" : "active" } : c));
    toast.success("Status updated");
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    toast.success("Company deleted");
  };

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage networking companies and their configurations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Company</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingCompany ? "Edit Company" : "Create New Company"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. TechNet India" />
                </div>
                <div className="space-y-2">
                  <Label>Max Members *</Label>
                  <Input type="number" value={formMaxMembers} onChange={e => setFormMaxMembers(e.target.value)} placeholder="e.g. 500" />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="e.g. 25000" />
                </div>
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={formBillingCycle} onValueChange={setFormBillingCycle}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BILLING_CYCLES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Assign Modules ({formModules.length} selected)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_MODULES.map(m => (
                    <label key={m.id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${formModules.includes(m.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                      <Checkbox checked={formModules.includes(m.id)} onCheckedChange={() => toggleModule(m.id)} />
                      <span className="text-sm text-foreground">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave}>{editingCompany ? "Update" : "Create"} Company</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="pl-9" />
      </div>

      <div className="grid gap-4">
        {filtered.map(c => (
          <Card key={c.id} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-foreground">{c.name}</h3>
                      <Badge variant={c.status === "active" ? "default" : "destructive"} className="text-[10px]">
                        {c.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Members: {c.currentMembers}/{c.maxMembers}</span>
                      <span>•</span>
                      <span>₹{c.amount.toLocaleString("en-IN")}/{BILLING_CYCLES.find(b => b.value === c.billingCycle)?.label}</span>
                      <span>•</span>
                      <span>{c.modules.length} modules</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.modules.slice(0, 5).map(m => (
                        <Badge key={m} variant="secondary" className="text-[10px] font-normal">
                          {ALL_MODULES.find(mod => mod.id === m)?.label}
                        </Badge>
                      ))}
                      {c.modules.length > 5 && <Badge variant="secondary" className="text-[10px] font-normal">+{c.modules.length - 5} more</Badge>}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(c)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(c.id)}>{c.status === "active" ? "Suspend" : "Activate"}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteCompany(c.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No companies found</div>
        )}
      </div>
    </div>
  );
}
