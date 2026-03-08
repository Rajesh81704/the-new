import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, CheckCircle2, XCircle, Clock, Eye, Building2, Users, AlertCircle } from "lucide-react";
import { useApplications } from "@/lib/applicationsContext";
import { toast } from "sonner";

export default function SuperAdminApplications() {
  const { applications, updateStatus } = useApplications();
  const [search, setSearch] = useState("");
  const [viewApp, setViewApp] = useState<string | null>(null);

  const filtered = applications.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const pending = applications.filter((a) => a.status === "pending").length;
  const approved = applications.filter((a) => a.status === "approved").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  const selectedApp = viewApp ? applications.find((a) => a.id === viewApp) : null;

  const handleApprove = (id: string) => {
    updateStatus(id, "approved");
    toast.success("Application approved!");
  };

  const handleReject = (id: string) => {
    updateStatus(id, "rejected");
    toast.success("Application rejected");
  };

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
    if (status === "rejected") return <XCircle className="w-3.5 h-3.5 text-destructive" />;
    return <Clock className="w-3.5 h-3.5 text-yellow-600" />;
  };

  const statusBadge = (status: string) => {
    if (status === "approved") return <Badge className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
    if (status === "rejected") return <Badge variant="destructive" className="text-[10px]">Rejected</Badge>;
    return <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Review requests from people who want to become Company Admins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700"><AlertCircle className="w-5 h-5" /></div>
            <div><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold font-heading text-foreground">{pending}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-700"><CheckCircle2 className="w-5 h-5" /></div>
            <div><p className="text-xs text-muted-foreground">Approved</p><p className="text-xl font-bold font-heading text-foreground">{approved}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive"><XCircle className="w-5 h-5" /></div>
            <div><p className="text-xs text-muted-foreground">Rejected</p><p className="text-xl font-bold font-heading text-foreground">{rejected}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications..." className="pl-9" />
      </div>

      {/* Applications List */}
      <div className="grid gap-3">
        {filtered.map((app) => (
          <Card key={app.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-sm text-foreground">{app.name}</h3>
                      {statusBadge(app.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{app.companyName} · {app.industry || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{app.email} · Applied {app.appliedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewApp(app.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {app.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 text-xs text-green-700 border-green-200 hover:bg-green-50" onClick={() => handleApprove(app.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => handleReject(app.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No applications found</div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewApp} onOpenChange={() => setViewApp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">{statusIcon(selectedApp.status)}{statusBadge(selectedApp.status)}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium text-foreground">{selectedApp.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-foreground">{selectedApp.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium text-foreground">{selectedApp.phone || "N/A"}</p></div>
                <div><p className="text-xs text-muted-foreground">Company</p><p className="font-medium text-foreground">{selectedApp.companyName}</p></div>
                <div><p className="text-xs text-muted-foreground">Industry</p><p className="font-medium text-foreground">{selectedApp.industry || "N/A"}</p></div>
                <div><p className="text-xs text-muted-foreground">Expected Members</p><p className="font-medium text-foreground">{selectedApp.expectedMembers || "N/A"}</p></div>
              </div>
              {selectedApp.message && (
                <div><p className="text-xs text-muted-foreground mb-1">Message</p><p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{selectedApp.message}</p></div>
              )}
              <p className="text-[10px] text-muted-foreground">Applied on {selectedApp.appliedAt}</p>
              {selectedApp.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => { handleApprove(selectedApp.id); setViewApp(null); }}>Approve</Button>
                  <Button variant="destructive" className="flex-1" onClick={() => { handleReject(selectedApp.id); setViewApp(null); }}>Reject</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
