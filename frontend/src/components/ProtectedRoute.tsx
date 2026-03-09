import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" replace />; // User will land on the appropriate landing page for their subdomain, which invites them to login
    }
    return <>{children}</>;
};
