import { useState } from "react";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";

const friends = [
  { initials: "SL", name: "Sarah Lawson", role: "CEO at Nexora Labs" },
  { initials: "MK", name: "Michael Kerr", role: "Marketing Director" },
  { initials: "JP", name: "Jessica Park", role: "UX Designer at Craft Studio" },
  { initials: "AK", name: "Amara Kim", role: "Product Manager at BuildFlow" },
  { initials: "TC", name: "Tom Chen", role: "Software Engineer" },
  { initials: "LR", name: "Laura Reyes", role: "Business Development" },
];

const suggestions = [
  { initials: "RD", name: "Ryan Davis", role: "Venture Partner", company: "Horizon Ventures" },
  { initials: "EM", name: "Elena Moretti", role: "Startup Advisor", company: "Founders Network" },
];

const FriendsPage = () => {
  const [search, setSearch] = useState("");

  const filtered = friends.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Connections</h2>
        <p className="text-sm text-muted-foreground">{friends.length} professional connections</p>
      </div>

      <SearchBar placeholder="Search connections..." value={search} onChange={setSearch} />

      <div className="space-y-2">
        {filtered.map((f, i) => (
          <PersonCard key={f.name} index={i} connected {...f} />
        ))}
      </div>

      {!search && (
        <>
          <div className="pt-2">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Suggested for you</h3>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <PersonCard key={s.name} index={i} {...s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsPage;
