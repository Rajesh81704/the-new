import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Building2, CreditCard, Settings, ArrowLeft, Crown } from "lucide-react";

const superAdminItems = [
  { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard },
  { title: "Companies", url: "/super-admin/companies", icon: Building2 },
  { title: "Billing Plans", url: "/super-admin/billing", icon: CreditCard },
  { title: "Settings", url: "/super-admin/settings", icon: Settings },
];

function SuperAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-4 py-5 flex items-center gap-2 border-b border-sidebar-border">
          <Crown className="w-6 h-6 text-accent shrink-0" />
          {!collapsed && (
            <span className="font-heading font-bold text-base text-sidebar-foreground">
              Super<span className="text-accent">Admin</span>
            </span>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-4">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/super-admin"}
                      className="hover:bg-sidebar-accent/50 px-3 py-2.5 rounded-lg"
                      activeClassName="bg-accent/10 text-accent font-semibold"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to App</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export const SuperAdminLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <SidebarTrigger className="mr-3" />
          <h2 className="font-heading font-semibold text-sm text-foreground">Super Admin Panel</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);
