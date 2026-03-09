import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  CheckCircle2, ExternalLink, Loader2, XCircle,
  Settings2, CreditCard, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Payment gateways ──────────────────────────────────────────
interface Gateway {
  id: string;
  name: string;
  description: string;
  color: string;
  dashboardUrl: string;
  logo: string; // emoji used as fallback icon
}

const GATEWAYS: Gateway[] = [
  { id: "razorpay", name: "Razorpay", description: "India's leading payment gateway for all businesses", color: "#3395FF", dashboardUrl: "https://dashboard.razorpay.com", logo: "💳" },
  { id: "stripe", name: "Stripe", description: "Global payment infrastructure for the internet", color: "#635BFF", dashboardUrl: "https://dashboard.stripe.com", logo: "🌐" },
  { id: "phonepe", name: "PhonePe", description: "UPI & wallet payments for India", color: "#5F259F", dashboardUrl: "https://business.phonepe.com", logo: "📱" },
  { id: "cashfree", name: "Cashfree", description: "Next-gen payment gateway for fast settlements", color: "#00C853", dashboardUrl: "https://merchant.cashfree.com", logo: "⚡" },
  { id: "payuindia", name: "PayU India", description: "All-in-one payment solution for Indian businesses", color: "#E85A13", dashboardUrl: "https://onboarding.payu.in", logo: "₹" },
  { id: "ccavenue", name: "CCAvenue", description: "Secure online payment gateway since 2001", color: "#E31837", dashboardUrl: "https://www.ccavenue.com/login.jsp", logo: "🏦" },
];

type ConnectStep = "idle" | "prompt" | "waiting" | "verifying" | "done";

interface GatewayState {
  step: ConnectStep;
  connected: boolean;
}

// ── OAuth-style Connect Dialog ─────────────────────────────────
function ConnectDialog({
  gateway,
  state,
  onClose,
  onAuthorized,
}: {
  gateway: Gateway | null;
  state: GatewayState;
  onClose: () => void;
  onAuthorized: () => void;
}) {
  if (!gateway) return null;

  const handleContinue = () => {
    window.open(gateway.dashboardUrl, "_blank", "noopener");
  };

  return (
    <Dialog open={!!gateway && state.step !== "idle" && state.step !== "done"} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <span className="text-2xl">{gateway.logo}</span>
            Connect {gateway.name}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {state.step === "prompt" && (
            <motion.div key="prompt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pt-1">
              <div className="p-4 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click <strong>Continue to {gateway.name}</strong> below</li>
                  <li>Log in to your {gateway.name} dashboard that opens</li>
                  <li>Navigate to <strong>Settings → API / Integrations</strong></li>
                  <li>Grant access to <em>Magically Super</em> platform</li>
                  <li>Come back here and click <strong>I've Authorized Access</strong></li>
                </ol>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleContinue} className="gap-2 w-full" style={{ background: gateway.color }}>
                  <ExternalLink className="w-4 h-4" />
                  Continue to {gateway.name} →
                </Button>
                <Button variant="outline" className="w-full" onClick={onAuthorized}>
                  I've Authorized Access
                </Button>
              </div>
            </motion.div>
          )}

          {state.step === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 pt-1">
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium">Waiting for your confirmation…</p>
                <p className="mt-1 text-xs">Once you've authorized access in the {gateway.name} dashboard, click the button below.</p>
              </div>
              <Button onClick={onAuthorized} className="w-full gap-2" style={{ background: gateway.color }}>
                <CheckCircle2 className="w-4 h-4" />
                I've Authorized Access
              </Button>
            </motion.div>
          )}

          {state.step === "verifying" && (
            <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">Verifying connection with {gateway.name}…</p>
              <p className="text-xs text-muted-foreground">This usually takes a few seconds</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Settings Page ─────────────────────────────────────────
export default function SuperAdminSettings() {
  const [platformName, setPlatformName] = useState("Magically Super SaaS");
  const [supportEmail, setSupportEmail] = useState("support@magicsuper.com");
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Gateway states
  const [gatewayStates, setGatewayStates] = useState<Record<string, GatewayState>>(
    Object.fromEntries(GATEWAYS.map(g => [g.id, { step: "idle", connected: false }]))
  );
  const [activeGateway, setActiveGateway] = useState<Gateway | null>(null);

  const setStep = (id: string, step: ConnectStep, connected = false) => {
    setGatewayStates(prev => ({ ...prev, [id]: { step, connected } }));
  };

  const openConnect = (gw: Gateway) => {
    setActiveGateway(gw);
    setStep(gw.id, "prompt");
  };

  const handleAuthorized = () => {
    if (!activeGateway) return;
    setStep(activeGateway.id, "verifying");
    setTimeout(() => {
      setStep(activeGateway.id, "done", true);
      toast.success(`${activeGateway.name} connected successfully! 🎉`);
      setActiveGateway(null);
    }, 1800);
  };

  const handleDisconnect = (gw: Gateway) => {
    setStep(gw.id, "idle", false);
    toast.info(`${gw.name} disconnected`);
  };

  const activeState = activeGateway ? gatewayStates[activeGateway.id] : { step: "idle" as ConnectStep, connected: false };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure global platform settings and integrations</p>
      </div>

      {/* General */}
      <Card className="shadow-sm border-0">
        <CardHeader className="border-b border-border pb-4 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" /> General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input value={platformName} onChange={e => setPlatformName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-approve Companies</p>
              <p className="text-xs text-muted-foreground">Automatically activate new company registrations</p>
            </div>
            <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
            <div>
              <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">Temporarily disable platform access for all companies</p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
          <Button onClick={() => toast.success("Settings saved")}>Save Settings</Button>
        </CardContent>
      </Card>

      {/* Payment Gateway */}
      <Card className="shadow-sm border-0">
        <CardHeader className="border-b border-border pb-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Gateway
            </CardTitle>
            <CardDescription className="mt-1">
              Connect your platform payment gateway using OAuth. Click a provider, log in to their dashboard, and grant access — we handle the rest.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            {GATEWAYS.map((gw, i) => {
              const gs = gatewayStates[gw.id];
              const isConnected = gs.connected;
              const isVerifying = gs.step === "verifying";

              return (
                <motion.div key={gw.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all ${isConnected
                    ? "border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-400/30"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}>
                    {/* Logo circle */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                      style={{ background: `${gw.color}20`, border: `1px solid ${gw.color}40` }}
                    >
                      {gw.logo}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground font-heading">{gw.name}</span>
                        {isConnected && (
                          <Badge className="text-[10px] bg-emerald-500 text-white hover:bg-emerald-600 py-0">Connected</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{gw.description}</p>
                    </div>

                    {/* Action */}
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                    ) : isConnected ? (
                      <Button
                        size="sm" variant="outline"
                        className="text-xs h-7 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
                        onClick={() => handleDisconnect(gw)}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="text-xs h-7 gap-1 shrink-0"
                        style={{ background: gw.color }}
                        onClick={() => openConnect(gw)}
                      >
                        <Zap className="w-3.5 h-3.5" /> Connect
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connect Dialog */}
      <ConnectDialog
        gateway={activeGateway}
        state={activeState}
        onClose={() => { setActiveGateway(null); }}
        onAuthorized={handleAuthorized}
      />
    </div>
  );
}
