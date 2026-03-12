import { useState, useMemo, useEffect } from "react";
import api from "@/lib/api";
import { PersonCard } from "@/components/PersonCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Users } from "lucide-react";

interface Member {
  initials: string;
  name: string;
  role: string;
  company: string;
  category: string;
  city: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/user/members");
        setMembers((res.data?.data || []).map((m: any) => ({
          ...m,
          initials: ((m.firstName?.[0] || "") + (m.lastName?.[0] || "")).toUpperCase() || "U",
          name: `${m.firstName || ""} ${m.lastName || ""}`.trim() || m.email,
          role: m.role || "Member",
          company: m.companyId || "NetLink",
          category: "General",
          city: "Remote",
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading community...</div>;

  const cities = useMemo(() => [...new Set(members.map((m) => m.city as string))].sort(), [members]);
  const categories = useMemo(() => [...new Set(members.map((m) => m.category as string))].sort(), [members]);

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()) || m.company.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "all" || m.city === selectedCity;
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const activeFilters = (selectedCity !== "all" ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-section-blue/40">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground">Members</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {members.length} professionals
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-heading font-semibold text-foreground">{members.length}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, role, or company..." className="pl-9 rounded-xl" />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="flex-1 rounded-xl h-9 text-xs">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 rounded-xl h-9 text-xs">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filter Chips */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedCity !== "all" && (
              <button onClick={() => setSelectedCity("all")} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors">
                <MapPin className="w-3 h-3" />{selectedCity} ×
              </button>
            )}
            {selectedCategory !== "all" && (
              <button onClick={() => setSelectedCategory("all")} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors">
                <Briefcase className="w-3 h-3" />{selectedCategory} ×
              </button>
            )}
            <button
              onClick={() => { setSelectedCity("all"); setSelectedCategory("all"); }}
              className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-medium hover:bg-muted/80 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No members match your filters</div>
          ) : (
            filtered.map((m, i) => (
              <PersonCard key={m.initials} index={i} {...m} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
