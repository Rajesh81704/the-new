import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SuperAdminLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold font-heading text-foreground">Super Admin Portal</h1>
                <p className="text-lg text-muted-foreground">Manage platforms, companies, and global settings.</p>
                <div className="flex justify-center">
                    <Button size="lg" onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
            </div>
        </div>
    );
}
