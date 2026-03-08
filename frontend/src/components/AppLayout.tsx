import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { AppHeader } from "./AppHeader";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="safe-bottom pt-14">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
