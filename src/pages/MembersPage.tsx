import { useState } from "react";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";

const industries = ["All", "Tech", "Design", "Finance", "Marketing", "Healthcare"];

const members = [
  { initials: "SL", name: "Sarah Lawson", role: "CEO", company: "Nexora Labs" },
  { initials: "MK", name: "Michael Kerr", role: "Marketing Director", company: "GrowthCo" },
  { initials: "JP", name: "Jessica Park", role: "UX Designer", company: "Craft Studio" },
  { initials: "RD", name: "Ryan Davis", role: "Venture Partner", company: "Horizon Ventures" },
  { initials: "AK", name: "Amara Kim", role: "Product Manager", company: "BuildFlow" },
  { initials: "TC", name: "Tom Chen", role: "Software Engineer", company: "CodeStack" },
  { initials: "LR", name: "Laura Reyes", role: "Business Development", company: "ScaleUp" },
  { initials: "EM", name: "Elena Moretti", role: "Startup Advisor", company: "Founders Network" },
  { initials: "DW", name: "David Wong", role: "Data Scientist", company: "InsightAI" },
];

const MembersPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Members</h2>
        <p className="text-sm text-muted-foreground">Discover professionals in the community</p>
      </div>

      <SearchBar placeholder="Search members..." value={search} onChange={setSearch} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setActiveFilter(ind)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
              activeFilter === ind
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((m, i) => (
          <PersonCard key={m.name} index={i} {...m} />
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
