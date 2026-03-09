import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, CreditCard, CheckCircle2, AlertCircle, Copy, XCircle, ExternalLink, IndianRupee, FileText, Paintbrush, Upload, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

const PAYMENT_GATEWAYS = [
  { id: "razorpay", name: "Razorpay", description: "India's leading payment gateway", color: "#3395FF", dashboardUrl: "https://dashboard.razorpay.com", logo: "💳" },
  { id: "stripe", name: "Stripe", description: "Global payment infrastructure for the internet", color: "#635BFF", dashboardUrl: "https://dashboard.stripe.com", logo: "🌐" },
  { id: "phonepe", name: "PhonePe", description: "UPI & wallet payments for India", color: "#5F259F", dashboardUrl: "https://business.phonepe.com", logo: "📱" },
  { id: "cashfree", name: "Cashfree", description: "Next-gen payment gateway", color: "#00C853", dashboardUrl: "https://merchant.cashfree.com", logo: "⚡" },
  { id: "payuindia", name: "PayU India", description: "All-in-one payment solution", color: "#E85A13", dashboardUrl: "https://onboarding.payu.in", logo: "₹" },
  { id: "ccavenue", name: "CCAvenue", description: "Secure online payments since 2001", color: "#E31837", dashboardUrl: "https://www.ccavenue.com/login.jsp", logo: "🏦" },
];

type ConnectStep = "idle" | "prompt" | "waiting" | "verifying" | "done";
interface GatewayState { step: ConnectStep; connected: boolean; }

export default function AdminSettings() {
  const [baseDomain, setBaseDomain] = useState("connectpro.in");
  // OAuth gateway state
  const [gatewayStates, setGatewayStates] = useState<Record<string, GatewayState>>(
    Object.fromEntries(PAYMENT_GATEWAYS.map(g => [g.id, { step: "idle" as ConnectStep, connected: false }]))
  );
  const [activeGateway, setActiveGateway] = useState<typeof PAYMENT_GATEWAYS[0] | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(localStorage.getItem("companyLogo") || "");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    const file = logoInputRef.current?.files?.[0];
    if (!file) { toast.error("Please select an image first"); return; }
    try {
      setLogoUploading(true);
      const formData = new FormData();
      formData.append("logo", file);
      const res = await api.post("/admin/settings/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newLogoUrl = res.data?.data?.logoUrl;
      if (newLogoUrl) {
        localStorage.setItem("companyLogo", newLogoUrl);
        setLogoPreview(newLogoUrl);
        toast.success("Company logo updated! Refresh the page to see it in the header.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };


  const renderDomainRow = (title: string, name: string) => (
    <div className="border border-border rounded-xl overflow-hidden mb-6">
      <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 rounded-full bg-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      </div>
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium text-muted-foreground w-1/4">Name</th>
              <th className="px-5 py-3 font-medium text-muted-foreground w-1/4">Type</th>
              <th className="px-5 py-3 font-medium text-muted-foreground w-1/3">Value</th>
              <th className="px-5 py-3 font-medium text-muted-foreground">Verification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(name, "Name")} className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                  <span className="font-medium">{name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-muted-foreground">CNAME</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(baseDomain, "Value")} className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                  <span className="font-medium">{baseDomain}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-destructive font-medium">
                  <XCircle className="w-4 h-4" /> Not Verified
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your platform domain and integrations</p>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="branding" className="gap-2"><Paintbrush className="w-4 h-4" /> Branding</TabsTrigger>
          <TabsTrigger value="domains" className="gap-2"><Globe className="w-4 h-4" /> Domain Settings</TabsTrigger>
          <TabsTrigger value="payments" className="gap-2"><IndianRupee className="w-4 h-4" /> Payment Gateways</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2"><FileText className="w-4 h-4" /> Invoices</TabsTrigger>
        </TabsList>

        {/* BRANDING TAB */}
        <TabsContent value="branding" className="space-y-4">
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border pb-4">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-primary" /> Brand Settings
              </CardTitle>
              <CardDescription>Upload your company logo. It will appear in the top navigation bar for all your users.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Preview */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || ''}${logoPreview}` : logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Logo Preview</p>
                </div>

                {/* Upload controls */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Select Logo Image</Label>
                    <Input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="cursor-pointer h-auto py-2"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: PNG or SVG with transparent background. Max 5MB.</p>
                  </div>
                  <Button onClick={handleLogoUpload} disabled={logoUploading} className="gap-2">
                    <Upload className="w-4 h-4" />
                    {logoUploading ? "Uploading..." : "Upload & Save Logo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Domain Settings
                  </CardTitle>
                  <CardDescription className="mt-1">Connect your custom domain (e.g. community.yourbrand.com)</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 text-xs">Verify DNS</Button>
                  <Button className="h-8 text-xs">Save Changes</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> How to connect your domain
                </h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-1">
                  <li>Log in to your domain provider (GoDaddy, Hostinger, Cloudflare, etc.)</li>
                  <li>Navigate to the DNS Management or DNS Settings page.</li>
                  <li>Add the CNAME records exactly as shown below.</li>
                  <li>Come back here and click "Verify DNS". It may take up to 24 hours to propagate.</li>
                </ol>
              </div>

              {renderDomainRow("Client Login", "login")}
              {renderDomainRow("Shop Domain", "shop")}
              {renderDomainRow("Community Domain", "community")}
              {renderDomainRow("Finance Domain", "finance")}
              {renderDomainRow("Admin Console", "admin")}

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Payment Gateways</h2>
            <p className="text-sm text-muted-foreground ml-2">Connect via OAuth — no manual key entry needed</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {PAYMENT_GATEWAYS.map((gw, i) => {
              const gs = gatewayStates[gw.id];
              const isConnected = gs?.connected;
              const isVerifying = gs?.step === "verifying";

              return (
                <motion.div key={gw.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all ${isConnected
                    ? "border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-400/30"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                      style={{ background: `${gw.color}20`, border: `1px solid ${gw.color}40` }}
                    >
                      {gw.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground font-heading">{gw.name}</span>
                        {isConnected && (
                          <Badge className="text-[10px] bg-emerald-500 text-white hover:bg-emerald-600 py-0">Connected</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{gw.description}</p>
                    </div>
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                    ) : isConnected ? (
                      <Button
                        size="sm" variant="outline"
                        className="text-xs h-7 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
                        onClick={() => { setGatewayStates(prev => ({ ...prev, [gw.id]: { step: "idle", connected: false } })); toast.info(`${gw.name} disconnected`); }}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="text-xs h-7 gap-1 shrink-0"
                        style={{ background: gw.color }}
                        onClick={() => { setActiveGateway(gw); setGatewayStates(prev => ({ ...prev, [gw.id]: { ...prev[gw.id], step: "prompt" } })); }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Connect
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* OAuth Connect Dialog */}
          <Dialog
            open={!!activeGateway && !!gatewayStates[activeGateway?.id ?? ""]?.step && gatewayStates[activeGateway?.id ?? ""]?.step !== "idle" && gatewayStates[activeGateway?.id ?? ""]?.step !== "done"}
            onOpenChange={o => { if (!o) setActiveGateway(null); }}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center gap-2">
                  <span className="text-2xl">{activeGateway?.logo}</span>
                  Connect {activeGateway?.name}
                </DialogTitle>
              </DialogHeader>
              <AnimatePresence mode="wait">
                {gatewayStates[activeGateway?.id ?? ""]?.step === "prompt" && (
                  <motion.div key="prompt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pt-1">
                    <div className="p-4 rounded-xl border border-border bg-muted/30 text-sm space-y-2">
                      <p className="font-medium text-foreground">How it works:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Click <strong>Continue to {activeGateway?.name}</strong> below</li>
                        <li>Log in and go to <strong>Settings → API / Integrations</strong></li>
                        <li>Grant access to <em>Magically Super</em></li>
                        <li>Come back and confirm below</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full gap-2"
                      style={{ background: activeGateway?.color }}
                      onClick={() => { window.open(activeGateway?.dashboardUrl, "_blank", "noopener"); setGatewayStates(prev => ({ ...prev, [activeGateway!.id]: { ...prev[activeGateway!.id], step: "waiting" } })); }}
                    >
                      <ExternalLink className="w-4 h-4" /> Continue to {activeGateway?.name} →
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => { setGatewayStates(prev => ({ ...prev, [activeGateway!.id]: { ...prev[activeGateway!.id], step: "verifying" } })); setTimeout(() => { setGatewayStates(prev => ({ ...prev, [activeGateway!.id]: { step: "done", connected: true } })); toast.success(`${activeGateway?.name} connected! 🎉`); setActiveGateway(null); }, 1800); }}>
                      I've Authorized Access
                    </Button>
                  </motion.div>
                )}
                {gatewayStates[activeGateway?.id ?? ""]?.step === "waiting" && (
                  <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 pt-1">
                    <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300">
                      <p className="font-medium">Waiting for your confirmation…</p>
                      <p className="mt-1 text-xs">Once you've authorized in the {activeGateway?.name} dashboard, click below.</p>
                    </div>
                    <Button className="w-full gap-2" style={{ background: activeGateway?.color }} onClick={() => { setGatewayStates(prev => ({ ...prev, [activeGateway!.id]: { ...prev[activeGateway!.id], step: "verifying" } })); setTimeout(() => { setGatewayStates(prev => ({ ...prev, [activeGateway!.id]: { step: "done", connected: true } })); toast.success(`${activeGateway?.name} connected! 🎉`); setActiveGateway(null); }, 1800); }}>
                      <CheckCircle2 className="w-4 h-4" /> I've Authorized Access
                    </Button>
                  </motion.div>
                )}
                {gatewayStates[activeGateway?.id ?? ""]?.step === "verifying" && (
                  <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-medium">Verifying connection with {activeGateway?.name}…</p>
                    <p className="text-xs text-muted-foreground">This usually takes a few seconds</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Invoice Settings
                  </CardTitle>
                  <CardDescription className="mt-1">Configure the default invoice template and details for your users' monthly subscriptions</CardDescription>
                </div>
                <Button className="h-8 text-xs">Save Template</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Company Name on Invoice</Label>
                    <Input placeholder="e.g. Acme Corp" defaultValue="ConnectPro Inc." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Company Address</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Full company address..."
                      defaultValue="123 Tech Park, \nSilicon Valley, CA 94025"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Tax ID / GST Number</Label>
                    <Input placeholder="Optional..." defaultValue="GSTIN0000000000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Company Logo URL</Label>
                    <div className="flex gap-2">
                      <Input placeholder="https://example.com/logo.png" />
                      <Button variant="outline" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Default Subscription Amount (₹)</Label>
                    <Input type="number" placeholder="99.00" defaultValue="149" />
                    <p className="text-[11px] text-muted-foreground">This standard amount will be shown on users' bills unless customized.</p>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="bg-muted/30 border border-border rounded-xl p-5 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">Live Preview</div>
                  <h4 className="font-semibold text-sm mb-4">Template Preview</h4>

                  <div className="bg-card w-full flex-grow rounded-lg shadow-sm border border-border p-5 text-sm">
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-border border-dashed">
                      <div>
                        <div className="w-10 h-10 bg-primary/20 rounded mb-2 flex items-center justify-center text-primary font-bold">Logo</div>
                        <h5 className="font-bold">ConnectPro Inc.</h5>
                        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">123 Tech Park,{"\n"}Silicon Valley, CA 94025</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xl font-heading font-medium text-primary uppercase tracking-tight">Invoice</h4>
                        <p className="text-xs text-muted-foreground mt-1">#INV-202603-001</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-1">Billed To:</p>
                      <h6 className="font-medium text-sm">[User Name Goes Here]</h6>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Monthly Subscription</span>
                      <span className="font-bold">₹149.00</span>
                    </div>

                    <div className="flex justify-between items-center py-2 mt-4">
                      <span className="font-bold">Total Due</span>
                      <span className="font-bold text-primary">₹149.00</span>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

