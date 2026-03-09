import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { PostsProvider } from "@/lib/postsContext";
import { ProfileProvider } from "@/lib/profileContext";
import { BusinessCardProvider } from "@/lib/businessCardContext";
import { ApplicationsProvider } from "@/lib/applicationsContext";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import EventsPage from "./pages/EventsPage";
import MembersPage from "./pages/MembersPage";
import PodcastPage from "./pages/PodcastPage";
import TermsPage from "./pages/TermsPage";
import ProfilePage from "./pages/ProfilePage";
import MyFeedPage from "./pages/MyFeedPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyInvoicesPage from "./pages/MyInvoicesPage";
import ResourcesPage from "./pages/ResourcesPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ShareBusinessPage from "./pages/ShareBusinessPage";
import PublicCardPage from "./pages/PublicCardPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminPodcasts from "./pages/admin/AdminPodcasts";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminResources from "./pages/admin/AdminResources";
import AdminTerms from "./pages/admin/AdminTerms";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMembership from "./pages/admin/AdminMembership";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminCompanies from "./pages/super-admin/SuperAdminCompanies";
import SuperAdminBilling from "./pages/super-admin/SuperAdminBilling";
import SuperAdminSettings from "./pages/super-admin/SuperAdminSettings";
import SuperAdminApplications from "./pages/super-admin/SuperAdminApplications";
import CompanyLandingPage from "./pages/CompanyLandingPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const UserHostAuthGate = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isUserHost = window.location.hostname === "user.magicallysocial.cloud";

  if (!isUserHost) {
    return children;
  }

  if (!token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (token && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProfileProvider>
        <BusinessCardProvider>
          <ApplicationsProvider>
            <PostsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route element={<UserHostAuthGate><RoutesProxy /></UserHostAuthGate>} path="*" />
                </Routes>
              </BrowserRouter>
            </PostsProvider>
          </ApplicationsProvider>
        </BusinessCardProvider>
      </ProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const RoutesProxy = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/podcast" element={<PodcastPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/my-feed" element={<MyFeedPage />} />
      <Route path="/my-profile" element={<MyProfilePage />} />
      <Route path="/my-invoices" element={<MyInvoicesPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailPage />} />
      <Route path="/share-business" element={<ShareBusinessPage />} />
    </Route>
    <Route element={<AdminLayout />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/members" element={<AdminMembers />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/podcasts" element={<AdminPodcasts />} />
      <Route path="/admin/blogs" element={<AdminBlogs />} />
      <Route path="/admin/resources" element={<AdminResources />} />
      <Route path="/admin/terms" element={<AdminTerms />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/membership" element={<AdminMembership />} />
    </Route>
    <Route element={<SuperAdminLayout />}>
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/companies" element={<SuperAdminCompanies />} />
      <Route path="/super-admin/billing" element={<SuperAdminBilling />} />
      <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
      <Route path="/super-admin/applications" element={<SuperAdminApplications />} />
    </Route>
    <Route path="/card/:id" element={<PublicCardPage />} />
    <Route path="/get-started" element={<CompanyLandingPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
