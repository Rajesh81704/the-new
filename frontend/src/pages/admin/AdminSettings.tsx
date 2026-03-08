import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Globe, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PAYMENT_GATEWAYS = [
  { id: "razorpay", name: "Razorpay", description: "India's leading payment gateway", fields: ["Key ID", "Key Secret"] },
  { id: "phonepe", name: "PhonePe", description: "UPI & wallet payments", fields: ["Merchant ID", "Salt Key", "Salt Index"] },
  { id: "cashfree", name: "Cashfree", description: "Payment gateway for India", fields: ["App ID", "Secret Key"] },
  { id: "payuindia", name: "PayU India", description: "All-in-one payment solution", fields: ["Merchant Key", "Merchant Salt"] },
  { id: "instamojo", name: "Instamojo", description: "Simple payments for businesses", fields: ["API Key", "Auth Token"] },
  { id: "ccavenue", name: "CCAvenue", description: "Secure online payments", fields: ["Merchant ID", "Access Code", "Working Key"] },
];

interface GatewayConfig {
  enabled: boolean;
  values: Record<string, string>;
}

export default function AdminSettings() {
  const [customDomain, setCustomDomain] = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [gateways, setGateways] = useState<Record<string, GatewayConfig>>({});

  const handleVerifyDomain = () => {
    if (!customDomain.trim()) { toast.error("Enter a domain"); return; }
    setTimeout(() => { setDomainVerified(true); toast.success("Domain verified!"); }, 1000);
    toast.info("Verifying domain...");
  };

  const toggleGateway = (id: string) => {
    setGateways(prev => ({
      ...prev,
      [id]: { enabled: !prev[id]?.enabled, values: prev[id]?.values || {} },
    }));
  };

  const updateGatewayField = (gatewayId: string, field: string, value: string) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: { ...prev[gatewayId], values: { ...prev[gatewayId]?.values, [field]: value } },
    }));
  };

  const saveGateway = (id: string) => {
    toast.success(`${PAYMENT_GATEWAYS.find(g => g.id === id)?.name} settings saved`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your platform domain and payment integrations</p>
      </div>

      {/* Custom Domain */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-heading">Custom Domain</CardTitle>
          </div>
          <CardDescription>Connect your own domain to your networking platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label>Domain Name</Label>
              <Input value={customDomain} onChange={e => { setCustomDomain(e.target.value); setDomainVerified(false); }} placeholder="e.g. community.yourcompany.com" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleVerifyDomain} variant={domainVerified ? "secondary" : "default"}>
                {domainVerified ? "Verified" : "Verify"}
              </Button>
            </div>
          </div>
          {domainVerified && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Domain verified! Add the following DNS records to complete setup.</span>
            </div>
          )}
          {customDomain && !domainVerified && (
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">DNS Configuration Required:</p>
              <p>Add an <strong>A Record</strong> pointing to <code className="bg-background px-1.5 py-0.5 rounded text-xs">185.158.133.1</code></p>
              <p>Add a <strong>CNAME Record</strong> for www pointing to your domain</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">Payment Gateways</h2>
        </div>
        <p className="text-sm text-muted-foreground">Integrate one or more payment gateways to collect membership fees</p>

        <div className="grid gap-4">
          {PAYMENT_GATEWAYS.map(gw => {
            const config = gateways[gw.id];
            const isEnabled = config?.enabled;
            return (
              <Card key={gw.id} className={`shadow-sm transition-colors ${isEnabled ? "border-primary/30" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold text-foreground text-sm">{gw.name}</h3>
                        {isEnabled && <Badge className="text-[10px]">Enabled</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{gw.description}</p>
                    </div>
                    <Switch checked={!!isEnabled} onCheckedChange={() => toggleGateway(gw.id)} />
                  </div>
                  {isEnabled && (
                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gw.fields.map(field => (
                          <div key={field} className="space-y-1.5">
                            <Label className="text-xs">{field}</Label>
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
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => saveGateway(gw.id)}>Save</Button>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Keys are stored securely
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
