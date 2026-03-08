import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Companies", value: "12", icon: Building2, color: "text-primary" },
  { label: "Total Members", value: "1,847", icon: Users, color: "text-accent" },
  { label: "Monthly Revenue", value: "₹4,52,000", icon: CreditCard, color: "text-green-600" },
  { label: "Growth", value: "+18%", icon: TrendingUp, color: "text-blue-600" },
];

const recentCompanies = [
  { name: "TechNet India", plan: "Enterprise", members: "500/1000", status: "Active" },
  { name: "StartupHub", plan: "Pro", members: "120/250", status: "Active" },
  { name: "BizConnect", plan: "Starter", members: "45/50", status: "Warning" },
  { name: "NetVentures", plan: "Pro", members: "89/250", status: "Active" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage all networking companies from one place</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold font-heading text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-heading">Recent Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Members</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCompanies.map((c) => (
                  <tr key={c.name} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium text-foreground">{c.name}</td>
                    <td className="py-3 text-muted-foreground">{c.plan}</td>
                    <td className="py-3 text-muted-foreground">{c.members}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {c.status}
                      </span>
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
