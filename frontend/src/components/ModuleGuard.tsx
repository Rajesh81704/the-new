import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ModuleGuardProps {
    children: ReactNode;
    moduleId: string;
}

export const ModuleGuard = ({ children, moduleId }: ModuleGuardProps) => {
    const storedModules = localStorage.getItem("companyModules");

    let activeModules: string[] = [];
    try {
        activeModules = storedModules ? JSON.parse(storedModules) : ["friends", "events", "members", "podcasts"];
    } catch (e) {
        activeModules = ["friends", "events", "members", "podcasts"]; // fallback
    }

    if (!activeModules.includes(moduleId)) {
        return <Navigate to="/my-feed" replace />;
    }

    return <>{children}</>;
};
