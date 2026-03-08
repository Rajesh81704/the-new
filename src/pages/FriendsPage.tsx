import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, UserPlus, Clock, MessageSquare, MoreHorizontal, UserMinus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { avatars } from "@/lib/avatars";
import { toast } from "sonner";

interface Friend {
  initials: string;
  name: string;
  role: string;
  company: string;
  city: string;
  mutualFriends: number;
}

const connectedFriends: Friend[] = [
  { initials: "SL", name: "Sarah Lawson", role: "CEO", company: "Nexora Labs", city: "San Francisco", mutualFriends: 8 },
  { initials: "MK", name: "Michael Kerr", role: "Marketing Director", company: "GrowthCo", city: "New York", mutualFriends: 5 },
  { initials: "JP", name: "Jessica Park", role: "UX Designer", company: "Craft Studio", city: "Austin", mutualFriends: 3 },
  { initials: "AK", name: "Amara Kim", role: "Product Manager", company: "BuildFlow", city: "Seattle", mutualFriends: 12 },
  { initials: "TC", name: "Tom Chen", role: "Software Engineer", company: "CodeStack", city: "San Francisco", mutualFriends: 6 },
  { initials: "LR", name: "Laura Reyes", role: "Business Development", company: "ScaleUp", city: "Los Angeles", mutualFriends: 4 },
];

interface PendingRequest {
  initials: string;
  name: string;
  role: string;
  company: string;
  type: "incoming" | "outgoing";
}

const initialPending: PendingRequest[] = [
  { initials: "RD", name: "Ryan Davis", role: "Venture Partner", company: "Horizon Ventures", type: "incoming" },
  { initials: "EM", name: "Elena Moretti", role: "Startup Advisor", company: "Founders Network", type: "incoming" },
  { initials: "DW", name: "David Wong", role: "Data Scientist", company: "InsightAI", type: "outgoing" },
];

const suggestions: Friend[] = [
  { initials: "RD", name: "Ryan Davis", role: "Venture Partner", company: "Horizon Ventures", city: "Chicago", mutualFriends: 7 },
  { initials: "EM", name: "Elena Moretti", role: "Startup Advisor", company: "Founders Network", city: "New York", mutualFriends: 9 },
  { initials: "DW", name: "David Wong", role: "Data Scientist", company: "InsightAI", city: "Seattle", mutualFriends: 4 },
];

const FriendsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("connections");
  const [pending, setPending] = useState(initialPending);
  const [removedFriends, setRemovedFriends] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const incomingCount = pending.filter((p) => p.type === "incoming").length;

  const filteredFriends = connectedFriends
    .filter((f) => !removedFriends.includes(f.initials))
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.role.toLowerCase().includes(search.toLowerCase()) || f.company.toLowerCase().includes(search.toLowerCase()));

  const acceptRequest = (initials: string) => {
    setPending((p) => p.filter((r) => r.initials !== initials));
    toast.success("Connection accepted!");
  };

  const rejectRequest = (initials: string) => {
    setPending((p) => p.filter((r) => r.initials !== initials));
    toast.success("Request declined");
  };

  const cancelRequest = (initials: string) => {
    setPending((p) => p.filter((r) => r.initials !== initials));
    toast.success("Request cancelled");
  };

  const removeFriend = (initials: string) => {
    setRemovedFriends((p) => [...p, initials]);
    toast.success("Connection removed");
  };

  const sendRequest = (initials: string) => {
    setSentRequests((p) => [...p, initials]);
    toast.success("Connection request sent!");
  };

  return (
    <div className="min-h-screen bg-section-violet/40">
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Connections</h2>
        <p className="text-sm text-muted-foreground">
          {connectedFriends.length - removedFriends.length} connections
          {incomingCount > 0 && <span className="text-primary"> · {incomingCount} pending</span>}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search connections..." className="pl-9 rounded-xl" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 h-10 rounded-xl">
          <TabsTrigger value="connections" className="rounded-lg text-xs gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Connected
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg text-xs gap-1.5 relative">
            <Clock className="w-3.5 h-3.5" /> Requests
            {incomingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {incomingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="rounded-lg text-xs gap-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Discover
          </TabsTrigger>
        </TabsList>

        {/* Connected Tab */}
        <TabsContent value="connections" className="mt-4 space-y-2">
          <AnimatePresence>
            {filteredFriends.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">No connections found</div>
            ) : (
              filteredFriends.map((f, i) => {
                const avatar = avatars[f.initials];
                return (
                  <motion.div
                    key={f.initials}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => navigate(`/profile/${f.initials}`)}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                      {avatar ? <img src={avatar} alt={f.name} className="w-full h-full object-cover" /> : f.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{f.role} · {f.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground/70">{f.city}</span>
                        <span className="text-[10px] text-muted-foreground/50">·</span>
                        <span className="text-[10px] text-primary/70">{f.mutualFriends} mutual</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${f.initials}`); }}>
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/profile/${f.initials}`); }}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); removeFriend(f.initials); }}>
                            <UserMinus className="w-3.5 h-3.5 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-4 space-y-4">
          {/* Incoming */}
          {pending.filter((p) => p.type === "incoming").length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider">Incoming Requests</h3>
              {pending.filter((p) => p.type === "incoming").map((r, i) => {
                const avatar = avatars[r.initials];
                return (
                  <motion.div
                    key={r.initials}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                      {avatar ? <img src={avatar} alt={r.name} className="w-full h-full object-cover" /> : r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.role} · {r.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" className="h-8 rounded-xl gap-1 text-xs" onClick={() => acceptRequest(r.initials)}>
                        <Check className="w-3.5 h-3.5" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => rejectRequest(r.initials)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Outgoing */}
          {pending.filter((p) => p.type === "outgoing").length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider">Sent Requests</h3>
              {pending.filter((p) => p.type === "outgoing").map((r, i) => {
                const avatar = avatars[r.initials];
                return (
                  <motion.div
                    key={r.initials}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0 overflow-hidden">
                      {avatar ? <img src={avatar} alt={r.name} className="w-full h-full object-cover" /> : r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.role} · {r.company}</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs text-muted-foreground" onClick={() => cancelRequest(r.initials)}>
                      Cancel
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {pending.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">No pending requests</div>
          )}
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="mt-4 space-y-2">
          {suggestions.map((s, i) => {
            const avatar = avatars[s.initials];
            const alreadySent = sentRequests.includes(s.initials);
            return (
              <motion.div
                key={s.initials}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/profile/${s.initials}`)}
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0 overflow-hidden">
                  {avatar ? <img src={avatar} alt={s.name} className="w-full h-full object-cover" /> : s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.role} · {s.company}</p>
                  <p className="text-[10px] text-primary/70 mt-0.5">{s.mutualFriends} mutual connections</p>
                </div>
                <Button
                  size="sm"
                  className={`h-8 rounded-xl gap-1 text-xs shrink-0 ${alreadySent ? "bg-secondary text-secondary-foreground" : ""}`}
                  variant={alreadySent ? "secondary" : "default"}
                  onClick={(e) => { e.stopPropagation(); if (!alreadySent) sendRequest(s.initials); }}
                  disabled={alreadySent}
                >
                  {alreadySent ? (
                    <><Clock className="w-3.5 h-3.5" /> Pending</>
                  ) : (
                    <><UserPlus className="w-3.5 h-3.5" /> Connect</>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsPage;
