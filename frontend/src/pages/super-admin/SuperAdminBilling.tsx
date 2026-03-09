import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  CreditCard, TrendingUp, AlertCircle, CheckCircle2, Plus, MoreVertical,
  Package, Receipt, IndianRupee, Pencil, Trash2, ArrowUpRight, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { packagesStore, usePackages, BILLING_CYCLE_LABELS, type PaymentPackage } from "@/lib/packagesStore";

// ---------- Transactions (static demo data) ----------
interface Transaction {
  id: string;
  company: string;
  packageName: string;
  amount: number;
  cycle: string;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
}

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "t1", company: "TechNet India", packageName: "Brahmastra", amount: 24999, cycle: "Quarterly", date: "02 Mar 2026", status: "Paid" },
  { id: "t2", company: "StartupHub", packageName: "Enterprise Titan", amount: 79999, cycle: "Yearly", date: "15 Feb 2026", status: "Paid" },
  { id: "t3", company: "BizConnect", packageName: "Starter Shield", amount: 4999, cycle: "Monthly", date: "01 Mar 2026", status: "Pending" },
  { id: "t4", company: "NetVentures", packageName: "Brahmastra", amount: 24999, cycle: "Quarterly", date: "10 Jan 2026", status: "Paid" },
  { id: "t5", company: "DigitalCircle", packageName: "Starter Shield", amount: 4999, cycle: "Monthly", date: "01 Mar 2026", status: "Overdue" },
  { id: "t6", company: "LinkSphere", packageName: "Enterprise Titan", amount: 79999, cycle: "Yearly", date: "20 Feb 2026", status: "Paid" },
];

const STATUS_STYLES: Record<Transaction["status"], string> = {
  Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// ---------- Package Dialog ----------
interface PkgDialogProps {
  open: boolean;
  onClose: () => void;
  editing?: PaymentPackage | null;
}

function PackageDialog({ open, onClose, editing }: PkgDialogProps) {
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [billingCycle, setBillingCycle] = useState<PaymentPackage["billingCycle"]>(editing?.billingCycle ?? "monthly");
  const [amount, setAmount] = useState(editing?.amount ? String(editing.amount) : "");
  const [active, setActive] = useState(editing?.active ?? true);

  const reset = () => { setName(""); setDescription(""); setBillingCycle("monthly"); setAmount(""); setActive(true); };

  const handleSave = () => {
    if (!name.trim() || !amount) { toast.error("Name and amount are required"); return; }
    const payload = { name: name.trim(), description: description.trim(), billingCycle, amount: Number(amount), active };
    if (editing) {
      packagesStore.update(editing.id, payload);
      toast.success("Package updated!");
    } else {
      packagesStore.add(payload);
      toast.success(`Package "${name}" created!`);
    }
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{editing ? "Edit Package" : "Create Payment Package"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Package Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Brahmastra, Starter Shield" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of what's included" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Billing Cycle *</Label>
              <Select value={billingCycle} onValueChange={v => setBillingCycle(v as PaymentPackage["billingCycle"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(BILLING_CYCLE_LABELS) as Array<keyof typeof BILLING_CYCLE_LABELS>).map(k => (
                    <SelectItem key={k} value={k}>{BILLING_CYCLE_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="25000" className="pl-7" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Available for company assignment</p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Package"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Record Transaction Dialog ----------
function RecordTxDialog({ open, onClose, packages }: { open: boolean; onClose: () => void; packages: PaymentPackage[] }) {
  const [company, setCompany] = useState("");
  const [selectedPkg, setSelectedPkg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<Transaction["status"]>("Paid");

  const handleSave = () => {
    if (!company.trim() || !selectedPkg) { toast.error("Company and package are required"); return; }
    toast.success(`Transaction recorded for ${company}`);
    setCompany(""); setSelectedPkg(""); setStatus("Paid");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Record Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Company Name *</Label>
            <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. TechNet India" />
          </div>
          <div className="space-y-1.5">
            <Label>Package *</Label>
            <Select value={selectedPkg} onValueChange={setSelectedPkg}>
              <SelectTrigger><SelectValue placeholder="Select a package" /></SelectTrigger>
              <SelectContent>
                {packages.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ₹{p.amount.toLocaleString("en-IN")} / {BILLING_CYCLE_LABELS[p.billingCycle]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as Transaction["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Record Transaction</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------
export default function SuperAdminBilling() {
  const packages = usePackages();
  const [pkgDialogOpen, setPkgDialogOpen] = useState(false);
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PaymentPackage | null>(null);

  const openCreate = () => { setEditingPkg(null); setPkgDialogOpen(true); };
  const openEdit = (pkg: PaymentPackage) => { setEditingPkg(pkg); setPkgDialogOpen(true); };
  const closeDialog = useCallback(() => { setPkgDialogOpen(false); setEditingPkg(null); }, []);

  const handleDelete = (pkg: PaymentPackage) => {
    packagesStore.remove(pkg.id);
    toast.success(`"${pkg.name}" deleted`);
  };

  const totalRevenue = DEMO_TRANSACTIONS.filter(t => t.status === "Paid").reduce((s, t) => s + t.amount, 0);
  const totalPending = DEMO_TRANSACTIONS.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Active Packages", value: String(packages.filter(p => p.active).length), icon: Package, color: "text-primary", bg: "from-primary/10 to-primary/5 border-primary/10" },
    { label: "Total Revenue (Paid)", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-emerald-600", bg: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10" },
    { label: "Pending Amount", value: `₹${totalPending.toLocaleString("en-IN")}`, icon: AlertCircle, color: "text-amber-600", bg: "from-amber-500/10 to-amber-500/5 border-amber-500/10" },
    { label: "Total Transactions", value: String(DEMO_TRANSACTIONS.length), icon: Receipt, color: "text-accent", bg: "from-accent/10 to-accent/5 border-accent/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Packages & Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage payment packages and track company transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className={`p-4 rounded-xl bg-gradient-to-br border ${s.bg}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
              </div>
              <p className="text-xl font-bold font-heading text-foreground">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="packages" className="gap-2"><Package className="w-4 h-4" /> Payment Packages</TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2"><Receipt className="w-4 h-4" /> Transactions</TabsTrigger>
        </TabsList>

        {/* ====== PACKAGES TAB ====== */}
        <TabsContent value="packages">
          <Card className="shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4 bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Payment Packages
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Create packages assignable to companies during onboarding</p>
              </div>
              <Button onClick={openCreate} size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Create Package
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {packages.length === 0 ? (
                <div className="py-16 text-center">
                  <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No packages yet. Create your first one!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {packages.map((pkg) => (
                      <motion.div key={pkg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <div className="flex items-center gap-4 px-6 py-4">
                          {/* Icon */}
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
                            <IndianRupee className="w-5 h-5 text-primary" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-semibold text-foreground text-sm">{pkg.name}</span>
                              <Badge variant={pkg.active ? "default" : "secondary"} className={`text-[10px] ${pkg.active ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}>
                                {pkg.active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                {BILLING_CYCLE_LABELS[pkg.billingCycle]}
                              </Badge>
                            </div>
                            {pkg.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{pkg.description}</p>}
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Created {pkg.createdAt}</p>
                          </div>

                          {/* Amount */}
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold font-heading text-foreground">₹{pkg.amount.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] text-muted-foreground">{BILLING_CYCLE_LABELS[pkg.billingCycle]}</p>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(pkg)} className="gap-2">
                                <Pencil className="w-3.5 h-3.5" /> Edit Package
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => packagesStore.update(pkg.id, { active: !pkg.active })} className="gap-2">
                                {pkg.active ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                {pkg.active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(pkg)} className="text-destructive gap-2">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== TRANSACTIONS TAB ====== */}
        <TabsContent value="transactions">
          <Card className="shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4 bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" /> Company Transactions
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Track all billing activity across companies</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export CSV</Button>
                <Button size="sm" className="gap-2" onClick={() => setTxDialogOpen(true)}>
                  <Plus className="w-4 h-4" /> Record Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Company</th>
                      <th className="px-6 py-3 font-medium">Package</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Cycle</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-xs font-bold text-primary">
                              {tx.company.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{tx.company}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{tx.packageName}</span>
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-foreground">₹{tx.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{tx.cycle}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{tx.date}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[tx.status]}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PackageDialog open={pkgDialogOpen} onClose={closeDialog} editing={editingPkg} />
      <RecordTxDialog open={txDialogOpen} onClose={() => setTxDialogOpen(false)} packages={packages.filter(p => p.active)} />
    </div>
  );
}
