import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "./api";
import { toast } from "sonner";

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
  createdAt?: string; // from backend
  updatedAt?: string;
}

interface ApplicationsContextType {
  applications: AdminApplication[];
  addApplication: (app: Omit<AdminApplication, "id" | "status" | "appliedAt">) => Promise<void>;
  updateStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  fetchApplications: () => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/super-admin/applications');
      if (response.data && response.data.data) {
        const mapped = response.data.data.map((app: any) => ({
          ...app,
          appliedAt: app.createdAt || app.appliedAt || new Date().toISOString()
        }));
        setApplications(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  useEffect(() => {
    // Only fetch applications automatically if we might be a superadmin
    if (window.location.hostname.startsWith("superadmin.") || window.location.pathname.startsWith("/super-admin") || window.location.pathname.startsWith("/superadmin")) {
        fetchApplications();
    }
  }, []);

  const addApplication = async (app: Omit<AdminApplication, "id" | "status" | "appliedAt">) => {
    try {
      const payload = {
        name: app.name,
        email: app.email,
        phone: app.phone,
        companyName: app.companyName,
        industry: app.industry,
        expectedMembers: app.expectedMembers,
        message: app.message,
      };
      await apiClient.post('/public/company-application', payload);
      // We don't necessarily need to fetch here since this is often done by public users
    } catch (error) {
      console.error("Failed to submit application", error);
      throw error;
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      // Backend expects /api/superadmin/applications/:id/status
      await apiClient.put(`/super-admin/applications/${id}/status`, { status });
      // Update local state optimistic
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
      throw error;
    }
  };

  return (
    <ApplicationsContext.Provider value={{ applications, addApplication, updateStatus, fetchApplications }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
};
