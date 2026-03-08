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

const initialApps: AdminApplication[] = [];

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
