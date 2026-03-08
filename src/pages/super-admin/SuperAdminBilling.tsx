import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

const billingOverview = [
  { label: "Active Subscriptions", value: "12", icon: CheckCircle2, color: "text-green-600" },
  { label: "MRR", value: "₹4,52,000", icon: TrendingUp, color: "text-primary" },
  { label: "Pending Payments", value: "2", icon: AlertCircle, color: "text-yellow-600" },
  { label: "Total Revenue (YTD)", value: "₹38,60,000", icon: CreditCard, color: "text-accent" },
];

const invoices = [
  { company: "TechNet India", amount: "₹50,000", cycle: "Monthly", date: "01 Mar 2026", status: "Paid" },
  { company: "StartupHub", amount: "₹75,000", cycle: "Quarterly", date: "15 Feb 2026", status: "Paid" },
  { company: "BizConnect", amount: "₹8,000", cycle: "Monthly", date: "01 Mar 2026", status: "Pending" },
  { company: "NetVentures", amount: "₹3,00,000", cycle: "Yearly", date: "10 Jan 2026", status: "Paid" },
  { company: "DigitalCircle", amount: "₹15,000", cycle: "Monthly", date: "01 Mar 2026", status: "Overdue" },
];

export default function SuperAdminBilling() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Billing & Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1">Track payments and subscriptions across all companies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {billingOverview.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold font-heading text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading">Recent Invoices</CardTitle>
          <Button variant="outline" size="sm">Export</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Cycle</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium text-foreground">{inv.company}</td>
                    <td className="py-3 text-foreground">{inv.amount}</td>
                    <td className="py-3 text-muted-foreground">{inv.cycle}</td>
                    <td className="py-3 text-muted-foreground">{inv.date}</td>
                    <td className="py-3">
                      <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Pending" ? "secondary" : "destructive"} className="text-[10px]">
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
