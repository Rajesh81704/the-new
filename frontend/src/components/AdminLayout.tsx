import { Outlet, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Headphones,
  PenLine,
  BookOpen,
  FileText,
  ArrowLeft,
  Shield,
} from "lucide-react";

import { CreditCard, Settings } from "lucide-react";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Members", url: "/admin/members", icon: Users },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Podcasts", url: "/admin/podcasts", icon: Headphones },
  { title: "Blogs", url: "/admin/blogs", icon: PenLine },
  { title: "Resources", url: "/admin/resources", icon: BookOpen },
  { title: "Terms & Conditions", url: "/admin/terms", icon: FileText },
  { title: "Membership", url: "/admin/membership", icon: CreditCard },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-4 py-5 flex items-center gap-2 border-b border-sidebar-border">
          <Shield className="w-6 h-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="font-heading font-bold text-base text-sidebar-foreground">
              Magically <span className="text-primary">Super</span> Admin
            </span>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-sidebar-accent/50 px-3 py-2.5 rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-semibold"
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

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
            <SidebarTrigger className="mr-3" />
            <h2 className="font-heading font-semibold text-sm text-foreground">Admin Panel</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
