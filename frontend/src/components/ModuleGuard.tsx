import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ModuleGuardProps {
    children: ReactNode;
    moduleId: string;
}

export const ModuleGuard = ({ children, moduleId }: ModuleGuardProps) => {
    const storedModules = localStorage.getItem("companyModules");

    // If no modules are stored yet (e.g. SUPER_ADMIN login or fresh session),
    // allow access to all modules rather than blocking.
    if (!storedModules) {
        return <>{children}</>;
    }

    let activeModules: string[] = [];
    try {
        // Normalize to lowercase for case-insensitive matching
        const parsed = JSON.parse(storedModules);
        activeModules = Array.isArray(parsed)
            ? parsed.map((m: string) => m.toLowerCase())
            : [];
    } catch (e) {
        // If parsing fails, allow access rather than blocking
        return <>{children}</>;
    }

    if (!activeModules.includes(moduleId.toLowerCase())) {
        return <Navigate to="/my-feed" replace />;
    }

    return <>{children}</>;
};
