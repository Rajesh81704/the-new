import { createContext, useContext, useState, ReactNode } from "react";

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  expectedMembers: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
}

interface ApplicationsContextType {
  applications: AdminApplication[];
  addApplication: (app: Omit<AdminApplication, "id" | "status" | "appliedAt">) => void;
  updateStatus: (id: string, status: "approved" | "rejected") => void;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

const initialApps: AdminApplication[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@biznetwork.in", phone: "+91 98765 43210", companyName: "BizNetwork India", industry: "Business Networking", expectedMembers: "200-500", message: "Looking to create a professional networking platform for Indian startups.", status: "pending", appliedAt: "2026-03-05" },
  { id: "2", name: "Priya Mehta", email: "priya@womentech.co", phone: "+91 87654 32109", companyName: "WomenInTech Network", industry: "Technology", expectedMembers: "100-200", message: "Want to build a community platform for women in technology across India.", status: "pending", appliedAt: "2026-03-07" },
];

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<AdminApplication[]>(initialApps);

  const addApplication = (app: Omit<AdminApplication, "id" | "status" | "appliedAt">) => {
    setApplications((prev) => [
      ...prev,
      { ...app, id: Date.now().toString(), status: "pending", appliedAt: new Date().toISOString().split("T")[0] },
    ]);
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <ApplicationsContext.Provider value={{ applications, addApplication, updateStatus }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
};
