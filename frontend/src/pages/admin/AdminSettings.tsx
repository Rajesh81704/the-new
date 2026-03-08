import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CreditCard, CheckCircle2, AlertCircle, Copy, XCircle, ExternalLink, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const PAYMENT_GATEWAYS = [
  { id: "razorpay", name: "Razorpay", description: "India's leading payment gateway", fields: ["Key ID", "Key Secret"], icon: "₹" },
  { id: "phonepe", name: "PhonePe", description: "UPI & wallet payments", fields: ["Merchant ID", "Salt Key", "Salt Index"], icon: "₹" },
  { id: "cashfree", name: "Cashfree", description: "Payment gateway for India", fields: ["App ID", "Secret Key"], icon: "₹" },
  { id: "payuindia", name: "PayU India", description: "All-in-one payment solution", fields: ["Merchant Key", "Merchant Salt"], icon: "₹" },
  { id: "instamojo", name: "Instamojo", description: "Simple payments for businesses", fields: ["API Key", "Auth Token"], icon: "₹" },
  { id: "ccavenue", name: "CCAvenue", description: "Secure online payments", fields: ["Merchant ID", "Access Code", "Working Key"], icon: "₹" },
];

interface GatewayConfig {
  enabled: boolean;
  values: Record<string, string>;
  verified?: boolean;
}

export default function AdminSettings() {
  const [baseDomain, setBaseDomain] = useState("connectpro.in");
  const [gateways, setGateways] = useState<Record<string, GatewayConfig>>({});

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleGateway = (id: string) => {
    setGateways(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id]?.enabled, values: prev[id]?.values || {} },
    }));
  };

  const updateGatewayField = (gatewayId: string, field: string, value: string) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: { ...prev[gatewayId], values: { ...prev[gatewayId]?.values, [field]: value }, verified: false },
    }));
  };

  const verifyAndSaveGateway = (id: string) => {
    toast.info(`Verifying ${PAYMENT_GATEWAYS.find(g => g.id === id)?.name} credentials...`);
    setTimeout(() => {
      setGateways(prev => ({
        ...prev,
        [id]: { ...prev[id], verified: true }
      }));
      toast.success(`${PAYMENT_GATEWAYS.find(g => g.id === id)?.name} connected and verified successfully!`);
    }, 1500);
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

      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="domains" className="gap-2"><Globe className="w-4 h-4" /> Domain Settings</TabsTrigger>
          <TabsTrigger value="payments" className="gap-2"><IndianRupee className="w-4 h-4" /> Payment Gateways</TabsTrigger>
        </TabsList>

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
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Indian Payment Gateways</h2>
            <p className="text-sm text-muted-foreground ml-2">Enable direct verifications for faster onboarding</p>
          </div>

          <div className="grid gap-4">
            {PAYMENT_GATEWAYS.map(gw => {
              const config = gateways[gw.id];
              const isEnabled = config?.enabled;
              const isVerified = config?.verified;

              return (
                <Card key={gw.id} className={`shadow-sm transition-colors ${isEnabled ? "border-primary/50 ring-1 ring-primary/20" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold text-foreground text-base flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs font-bold text-primary">{gw.icon}</span>
                            {gw.name}
                          </h3>
                          {isEnabled && (
                            <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""}>
                              {isVerified ? "Verified" : "Pending Verification"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{gw.description}</p>
                      </div>
                      <Switch checked={!!isEnabled} onCheckedChange={() => toggleGateway(gw.id)} />
                    </div>

                    <AnimatePresence>
                      {isEnabled && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="space-y-4 pt-4 mt-2 border-t border-border">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {gw.fields.map(field => (
                                <div key={field} className="space-y-1.5">
                                  <Label className="text-xs font-medium text-muted-foreground">{field}</Label>
                                  <Input
                                    type="password"
                                    placeholder={`Enter ${field}`}
                                    value={config?.values?.[field] || ""}
                                    onChange={e => updateGatewayField(gw.id, field, e.target.value)}
                                    className="h-9 text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" /> Keys are encrypted and stored securely
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                                  <ExternalLink className="w-3.5 h-3.5" /> Get Keys
                                </Button>
                                <Button size="sm" onClick={() => verifyAndSaveGateway(gw.id)} className="h-8 text-xs gap-1.5" disabled={isVerified}>
                                  {isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                                  {isVerified ? "Connected" : `Verify & Connect ${gw.name}`}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

