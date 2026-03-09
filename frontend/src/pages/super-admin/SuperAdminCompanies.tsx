import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Plus, MoreVertical, Building2, Search, LogIn, Users, CreditCard, Layers, Globe, TrendingUp, Calendar, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { usePackages, BILLING_CYCLE_LABELS } from "@/lib/packagesStore";
import api from "@/lib/api";

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



interface Company {
  id: string;
  name: string;
  maxMembers: number;
  modules: string[];
  amount: number;
  billingCycle: string;
  packageId?: string;
  packageName?: string;
  status: "active" | "inactive" | "suspended";
  currentMembers: number;
  domain?: string;
  createdAt: string;
}

const initialCompanies: Company[] = [];

const planFromModules = (count: number) => {
  if (count >= 9) return { name: "Enterprise", color: "bg-primary/10 text-primary border-primary/20" };
  if (count >= 5) return { name: "Pro", color: "bg-accent/10 text-accent border-accent/20" };
  return { name: "Starter", color: "bg-muted text-muted-foreground border-border" };
};

export default function SuperAdminCompanies() {
  const navigate = useNavigate();
  const allPackages = usePackages();
  const activePackages = allPackages.filter(p => p.active);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/super-admin/companies");
        if (res.data?.data) {
          const mapped = res.data.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            maxMembers: 1000,
            modules: ["members", "events"],
            amount: 5000,
            billingCycle: "monthly",
            status: c.subscriptionStatus === "ACTIVE" ? "active" : "inactive",
            currentMembers: 0,
            domain: c.customDomain || c.subdomain,
            createdAt: new Date(c.createdAt).toLocaleDateString()
          }));
          setCompanies(mapped);
        }
      } catch (err) {
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  const [formName, setFormName] = useState("");
  const [formMaxMembers, setFormMaxMembers] = useState("");
  const [formPackageId, setFormPackageId] = useState("");
  const [formModules, setFormModules] = useState<string[]>([]);

  const selectedPackage = allPackages.find(p => p.id === formPackageId);

  const resetForm = () => {
    setFormName(""); setFormMaxMembers(""); setFormPackageId(""); setFormModules([]); setEditingCompany(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    setFormName(c.name); setFormMaxMembers(String(c.maxMembers));
    setFormPackageId(c.packageId || ""); setFormModules(c.modules);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formMaxMembers || !formPackageId) {
      toast.error("Please fill all required fields including a Payment Package"); return;
    }
    const pkg = allPackages.find(p => p.id === formPackageId);
    if (editingCompany) {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id
        ? { ...c, name: formName, maxMembers: Number(formMaxMembers), packageId: formPackageId, packageName: pkg?.name, amount: pkg?.amount ?? 0, billingCycle: pkg?.billingCycle ?? "monthly", modules: formModules }
        : c));
      toast.success("Company updated successfully");
    } else {
      const newCompany: Company = {
        id: Date.now().toString(), name: formName, maxMembers: Number(formMaxMembers),
        modules: formModules, amount: pkg?.amount ?? 0, billingCycle: pkg?.billingCycle ?? "monthly",
        packageId: formPackageId, packageName: pkg?.name,
        status: "active", currentMembers: 0, createdAt: "Mar 2026"
      };
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

  const totalRevenue = companies.reduce((sum, c) => sum + c.amount, 0);
  const totalMembers = companies.reduce((sum, c) => sum + c.currentMembers, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage networking companies and their configurations</p>
        </motion.div>
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
              </div>

              {/* Payment Package Picker */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-primary" /> Payment Package *</Label>
                {activePackages.length === 0 ? (
                  <div className="p-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground text-center">
                    No active packages yet. Go to <span className="text-primary font-medium">Packages &amp; Billing</span> to create one first.
                  </div>
                ) : (
                  <Select value={formPackageId} onValueChange={setFormPackageId}>
                    <SelectTrigger><SelectValue placeholder="Select a payment package..." /></SelectTrigger>
                    <SelectContent>
                      {activePackages.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — ₹{p.amount.toLocaleString("en-IN")} / {BILLING_CYCLE_LABELS[p.billingCycle]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedPackage && (
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                    <CreditCard className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{selectedPackage.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">₹{selectedPackage.amount.toLocaleString("en-IN")} · {BILLING_CYCLE_LABELS[selectedPackage.billingCycle]}</span>
                  </div>
                )}
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

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Companies</span>
          </div>
          <p className="text-lg font-bold font-heading text-foreground">{companies.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">Members</span>
          </div>
          <p className="text-lg font-bold font-heading text-foreground">{totalMembers.toLocaleString()}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Revenue</span>
          </div>
          <p className="text-lg font-bold font-heading text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold">Active</span>
          </div>
          <p className="text-lg font-bold font-heading text-foreground">{companies.filter(c => c.status === "active").length}/{companies.length}</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="pl-9" />
      </div>

      {/* Company Cards */}
      <div className="grid gap-4">
        {filtered.map((c, i) => {
          const plan = planFromModules(c.modules.length);
          const usage = Math.round((c.currentMembers / c.maxMembers) * 100);
          const usageColor = usage >= 90 ? "text-destructive" : usage >= 70 ? "text-accent" : "text-primary";

          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-sm border-0 overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Gradient accent bar */}
                  <div className={`h-1 ${c.status === "active" ? "bg-gradient-to-r from-primary to-accent" : "bg-gradient-to-r from-destructive/60 to-destructive/30"}`} />

                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Company Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-lg font-bold font-heading text-primary shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-bold text-foreground text-base">{c.name}</h3>
                            <Badge className={`text-[10px] border ${plan.color}`}>{plan.name}</Badge>
                            <Badge variant={c.status === "active" ? "default" : "destructive"} className="text-[10px]">
                              {c.status === "active" ? "● Active" : "● Suspended"}
                            </Badge>
                          </div>

                          {c.domain && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              {c.domain}
                            </div>
                          )}

                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Users className="w-3 h-3" /> Members
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={usage} className="h-1.5 flex-1" />
                                <span className={`text-xs font-semibold ${usageColor}`}>{usage}%</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{c.currentMembers}/{c.maxMembers}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <CreditCard className="w-3 h-3" /> Billing
                              </div>
                              <p className="text-sm font-semibold text-foreground">₹{c.amount.toLocaleString("en-IN")}</p>
                              <p className="text-[11px] text-muted-foreground">{c.packageName || BILLING_CYCLE_LABELS[c.billingCycle as keyof typeof BILLING_CYCLE_LABELS] || c.billingCycle}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Layers className="w-3 h-3" /> Modules
                              </div>
                              <p className="text-sm font-semibold text-foreground">{c.modules.length}</p>
                              <p className="text-[11px] text-muted-foreground">of {ALL_MODULES.length} available</p>
                            </div>
                          </div>

                          {/* Module Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {c.modules.slice(0, 6).map(m => (
                              <span key={m} className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground font-medium">
                                {ALL_MODULES.find(mod => mod.id === m)?.label}
                              </span>
                            ))}
                            {c.modules.length > 6 && (
                              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] text-primary font-medium">
                                +{c.modules.length - 6} more
                              </span>
                            )}
                          </div>

                          {c.createdAt && (
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground/60">
                              <Calendar className="w-3 h-3" /> Created {c.createdAt}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => navigate("/admin")}>
                          <LogIn className="w-3.5 h-3.5" /> Enter Panel
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(c)}>Edit Company</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(c.id)}>{c.status === "active" ? "Suspend" : "Activate"}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteCompany(c.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No companies found</div>
        )}
      </div>
    </div>
  );
}
