import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, UserPlus, Clock, MessageSquare, MoreHorizontal, UserMinus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { avatars } from "@/lib/avatars";
import { toast } from "sonner";
import api from "@/lib/api";
import { useEffect } from "react";

// Decode JWT payload without external library
function getCurrentUserId(): string | null {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  } catch {
    return null;
  }
}

const FriendsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("connections");
  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = getCurrentUserId();

  const fetchData = async () => {
    try {
      const [friendsRes, requestsRes, membersRes] = await Promise.all([
        api.get("/user/friends"),
        api.get("/user/requests"),
        api.get("/user/members")
      ]);

      const friendsList = friendsRes.data?.data || [];
      const incomingList = requestsRes.data?.data?.incoming || [];
      const outgoingList = requestsRes.data?.data?.outgoing || [];

      setFriends(friendsList);
      setIncoming(incomingList);
      setOutgoing(outgoingList);

      // Exclude: self + already connected + pending requests (both directions)
      const excludedIds = new Set([
        ...(currentUserId ? [currentUserId] : []),
        ...friendsList.map((f: any) => f.id),
        ...incomingList.map((r: any) => r.id),
        ...outgoingList.map((r: any) => r.id),
      ]);

      const allMembers = membersRes.data?.data || [];
      setSuggestions(allMembers.filter((m: any) => !excludedIds.has(m.id)));
    } catch (err) {
      toast.error("Failed to load connection data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFriends = friends.filter((f) =>
    (f.firstName + " " + f.lastName).toLowerCase().includes(search.toLowerCase()) ||
    f.role?.toLowerCase().includes(search.toLowerCase())
  );

  const acceptRequest = async (userId: string) => {
    try {
      await api.post("/user/request/handle", { targetUserId: userId, action: 'ACCEPT' });
      toast.success("Connection accepted!");
      fetchData();
    } catch (err) { toast.error("Failed to accept request"); }
  };

  const rejectRequest = async (userId: string) => {
    try {
      await api.post("/user/request/handle", { targetUserId: userId, action: 'REJECT' });
      toast.success("Request declined");
      fetchData();
    } catch (err) { toast.error("Failed to decline request"); }
  };

  const cancelRequest = async (userId: string) => {
    try {
      await api.delete(`/user/friends/${userId}`);
      toast.success("Request cancelled");
      fetchData();
    } catch (err) { toast.error("Failed to cancel request"); }
  };

  const removeFriend = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/user/friends/${userId}`);
      toast.success("Connection removed");
      fetchData();
    } catch (err) { toast.error("Failed to remove friend"); }
  };

  const sendRequest = async (userId: string) => {
    try {
      await api.post("/user/connect", { receiverId: userId });
      toast.success("Connection request sent!");
      fetchData();
    } catch (err) { toast.error("Failed to send request"); }
  };

  return (
    <div className="min-h-screen bg-section-violet/40">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        {/* Header */}
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground">Connections</h2>
          <p className="text-sm text-muted-foreground">
            {friends.length} connections
            {incoming.length > 0 && <span className="text-primary"> · {incoming.length} pending</span>}
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
              {incoming.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {incoming.length}
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
                  const initials = ((f.firstName?.[0] || "") + (f.lastName?.[0] || "")).toUpperCase() || "U";
                  const avatar = f.avatarUrl || avatars[initials];
                  const fullName = `${f.firstName || ""} ${f.lastName || ""}`.trim() || f.email;
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => navigate(`/profile/${f.id}`)}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                        {avatar ? <img src={avatar} alt={fullName} className="w-full h-full object-cover" /> : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground truncate">{fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{f.role} · {f.company?.name || 'Company'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${f.id}`); }}>
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/profile/${f.id}`); }}>View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); removeFriend(f.id); }}>
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
            {incoming.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider">Incoming Requests</h3>
                {incoming.map((r, i) => {
                  const initials = ((r.firstName?.[0] || "") + (r.lastName?.[0] || "")).toUpperCase() || "U";
                  const avatar = r.avatarUrl || avatars[initials];
                  const fullName = `${r.firstName || ""} ${r.lastName || ""}`.trim() || r.email;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                        {avatar ? <img src={avatar} alt={fullName} className="w-full h-full object-cover" /> : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground truncate">{fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.role} · {r.company?.name || 'Company'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" className="h-8 rounded-xl gap-1 text-xs" onClick={() => acceptRequest(r.id)}>
                          <Check className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => rejectRequest(r.id)}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Outgoing */}
            {outgoing.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider">Sent Requests</h3>
                {outgoing.map((r, i) => {
                  const initials = ((r.firstName?.[0] || "") + (r.lastName?.[0] || "")).toUpperCase() || "U";
                  const avatar = r.avatarUrl || avatars[initials];
                  const fullName = `${r.firstName || ""} ${r.lastName || ""}`.trim() || r.email;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0 overflow-hidden">
                        {avatar ? <img src={avatar} alt={fullName} className="w-full h-full object-cover" /> : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground truncate">{fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.role} · {r.company?.name || 'Company'}</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs text-muted-foreground" onClick={() => cancelRequest(r.id)}>
                        Cancel
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {incoming.length === 0 && outgoing.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">No pending requests</div>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="mt-4 space-y-2">
            {suggestions.map((s, i) => {
              const initials = ((s.firstName?.[0] || "") + (s.lastName?.[0] || "")).toUpperCase() || "U";
              const avatar = s.avatarUrl || avatars[initials];
              const fullName = `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email;
              const alreadySent = outgoing.some(o => o.id === s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => navigate(`/profile/${s.id}`)}
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0 overflow-hidden">
                    {avatar ? <img src={avatar} alt={fullName} className="w-full h-full object-cover" /> : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-foreground truncate">{fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.role} · {s.company?.name || 'Company'}</p>
                  </div>
                  <Button
                    size="sm"
                    className={`h-8 rounded-xl gap-1 text-xs shrink-0 ${alreadySent ? "bg-secondary text-secondary-foreground" : ""}`}
                    variant={alreadySent ? "secondary" : "default"}
                    onClick={(e) => { e.stopPropagation(); if (!alreadySent) sendRequest(s.id); }}
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
    </div>
  );
};

export default FriendsPage;
