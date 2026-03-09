import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, Search, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const defaultTabs = [
  { path: "/", id: "feed", icon: Home, label: "Home" }, // Home isn't a module, always kept
  { path: "/friends", id: "friends", icon: Users, label: "Friends" },
  { path: "/events", id: "events", icon: Calendar, label: "Events" },
  { path: "/members", id: "members", icon: Search, label: "Members" },
  { path: "/podcast", id: "podcasts", icon: Headphones, label: "Podcast" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve modules array from local storage, default to all visible if missing
  const storedModules = localStorage.getItem("companyModules");
  let activeModules: string[] = [];
  try {
    activeModules = storedModules ? JSON.parse(storedModules) : ["friends", "events", "members", "podcasts"];
  } catch (e) {
    activeModules = ["friends", "events", "members", "podcasts"]; // fallback
  }

  // Filter tabs: always keep Home ("feed"), otherwise check if module is active
  const tabs = defaultTabs.filter(tab => tab.id === "feed" || activeModules.includes(tab.id));

  return (
    <nav className="nav-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 relative px-3 py-1"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors duration-150 ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-150 ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
