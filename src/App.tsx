import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { PostsProvider } from "@/lib/postsContext";
import { ProfileProvider } from "@/lib/profileContext";
import { BusinessCardProvider } from "@/lib/businessCardContext";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import EventsPage from "./pages/EventsPage";
import MembersPage from "./pages/MembersPage";
import PodcastPage from "./pages/PodcastPage";
import TermsPage from "./pages/TermsPage";
import ProfilePage from "./pages/ProfilePage";
import MyFeedPage from "./pages/MyFeedPage";
import MyProfilePage from "./pages/MyProfilePage";
import ResourcesPage from "./pages/ResourcesPage";
import BlogsPage from "./pages/BlogsPage";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProfileProvider>
        <BusinessCardProvider>
        <PostsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
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
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PostsProvider>
      </ProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
