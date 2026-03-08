import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Users, Crown, Star, Zap } from "lucide-react";
import { toast } from "sonner";

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  maxMembers: number;
  isActive: boolean;
  subscriberCount: number;
  icon: "crown" | "star" | "zap";
}

const ICONS = { crown: Crown, star: Star, zap: Zap };

const initialPlans: MembershipPlan[] = [];

const DURATIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannual", label: "6 Months" },
  { value: "yearly", label: "Yearly" },
];

export default function AdminMembership() {
  const [plans, setPlans] = useState<MembershipPlan[]>(initialPlans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDuration, setFormDuration] = useState("monthly");
  const [formFeatures, setFormFeatures] = useState("");
  const [formMaxMembers, setFormMaxMembers] = useState("");
  const [formIcon, setFormIcon] = useState<"crown" | "star" | "zap">("zap");

  const resetForm = () => {
    setFormName(""); setFormPrice(""); setFormDuration("monthly"); setFormFeatures(""); setFormMaxMembers(""); setFormIcon("zap"); setEditingPlan(null);
  };

  const openEdit = (p: MembershipPlan) => {
    setEditingPlan(p);
    setFormName(p.name); setFormPrice(String(p.price)); setFormDuration(p.duration); setFormFeatures(p.features.join("\n")); setFormMaxMembers(p.maxMembers === -1 ? "" : String(p.maxMembers)); setFormIcon(p.icon);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice) { toast.error("Fill required fields"); return; }
    const features = formFeatures.split("\n").map(f => f.trim()).filter(Boolean);
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, name: formName, price: Number(formPrice), duration: formDuration, features, maxMembers: formMaxMembers ? Number(formMaxMembers) : -1, icon: formIcon } : p));
      toast.success("Plan updated");
    } else {
      setPlans(prev => [...prev, { id: Date.now().toString(), name: formName, price: Number(formPrice), duration: formDuration, features, maxMembers: formMaxMembers ? Number(formMaxMembers) : -1, isActive: true, subscriberCount: 0, icon: formIcon }]);
      toast.success("Plan created");
    }
    setDialogOpen(false); resetForm();
  };

  const togglePlan = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    toast.success("Plan status updated");
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.success("Plan deleted");
  };

  const totalSubscribers = plans.reduce((a, p) => a + p.subscriberCount, 0);
  const totalRevenue = plans.reduce((a, p) => a + (p.price * p.subscriberCount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Membership Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage membership tiers for your community</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add Plan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingPlan ? "Edit" : "Create"} Membership Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name *</Label>
                  <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Premium" />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="e.g. 999" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formDuration} onValueChange={setFormDuration}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Members (blank = unlimited)</Label>
                  <Input type="number" value={formMaxMembers} onChange={e => setFormMaxMembers(e.target.value)} placeholder="Unlimited" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={formIcon} onValueChange={(v: "crown" | "star" | "zap") => setFormIcon(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zap">⚡ Bolt</SelectItem>
                    <SelectItem value="star">⭐ Star</SelectItem>
                    <SelectItem value="crown">👑 Crown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea value={formFeatures} onChange={e => setFormFeatures(e.target.value)} placeholder="Access to events&#10;Priority support&#10;..." rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave}>{editingPlan ? "Update" : "Create"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm"><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
          <div><p className="text-xs text-muted-foreground">Total Subscribers</p><p className="text-xl font-bold font-heading text-foreground">{totalSubscribers}</p></div>
        </CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10 text-accent"><Crown className="w-5 h-5" /></div>
          <div><p className="text-xs text-muted-foreground">Active Plans</p><p className="text-xl font-bold font-heading text-foreground">{plans.filter(p => p.isActive).length}</p></div>
        </CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-100 text-green-600"><Zap className="w-5 h-5" /></div>
          <div><p className="text-xs text-muted-foreground">Monthly Revenue</p><p className="text-xl font-bold font-heading text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</p></div>
        </CardContent></Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => {
          const Icon = ICONS[plan.icon];
          return (
            <Card key={plan.id} className={`shadow-sm relative transition-all ${!plan.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Icon className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground">{plan.name}</h3>
                      <Badge variant={plan.isActive ? "default" : "secondary"} className="text-[10px] mt-1">{plan.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(plan)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => togglePlan(plan.id)}>{plan.isActive ? "Deactivate" : "Activate"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deletePlan(plan.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <span className="text-2xl font-bold font-heading text-foreground">₹{plan.price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-muted-foreground">/{DURATIONS.find(d => d.value === plan.duration)?.label.toLowerCase()}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {plan.subscriberCount} subscribers • {plan.maxMembers === -1 ? "Unlimited" : plan.maxMembers} max
                </div>

                <ul className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
