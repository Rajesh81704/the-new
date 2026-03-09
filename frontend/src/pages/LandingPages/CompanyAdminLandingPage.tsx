import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompanyAdminLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold font-heading text-foreground">Company Administration</h1>
                <p className="text-lg text-muted-foreground">Manage your community, events, and members.</p>
                <div className="flex justify-center">
                    <Button size="lg" onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
            </div>
        </div>
    );
}
