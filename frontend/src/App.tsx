import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CompanyLandingPage from "./pages/LandingPages/CompanyLandingPage";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModuleGuard } from "@/components/ModuleGuard";
import PremiumLandingPage from "./pages/LandingPages/PremiumLandingPage";
import UserLandingPage from "./pages/LandingPages/UserLandingPage";
import CompanyAdminLandingPage from "./pages/LandingPages/CompanyAdminLandingPage";
import SuperAdminLandingPage from "./pages/LandingPages/SuperAdminLandingPage";
import LoginPage from "./pages/LandingPages/LoginPage";
import ForgotPasswordPage from "./pages/LandingPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/LandingPages/ResetPasswordPage";

const queryClient = new QueryClient();

const getAppVariant = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "main";
  }

  // Handle subdomains (both production and local .localhost)
  const isLocalhostSubdomain = hostname.endsWith(".localhost") && parts.length >= 2;
  const isProductionSubdomain = parts.length >= 3;

  if (isLocalhostSubdomain || isProductionSubdomain) {
    const subdomain = parts[0].toLowerCase();
    if (subdomain === "admin" || subdomain === "superadmin") return "superadmin";
    if (subdomain === "company") return "companyadmin";
    if (subdomain === "user") return "user";
    
    // For custom company subdomains (e.g., magicallysocial.localhost or magicallysocial.connectpro.in)
    return "customdomain";
  }

  // Main domain (e.g., connectpro.in or yourdomain.com)
  return "main";
};

import { useEffect } from "react";

const AppRoutes = () => {
  const variant = getAppVariant();

  useEffect(() => {
    // Magic link / Impersonation handling across subdomains
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);

      // Also potentially store any passed company modules
      const modules = params.get("modules");
      if (modules) localStorage.setItem("companyModules", atob(modules));

      const companyName = params.get("companyName");
      if (companyName) localStorage.setItem("companyName", atob(companyName));

      // Strip params cleanly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (variant === "superadmin") {
    return (
      <Routes>
        <Route path="/" element={<SuperAdminLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/companies" element={<SuperAdminCompanies />} />
          <Route path="/super-admin/billing" element={<SuperAdminBilling />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
          <Route path="/super-admin/applications" element={<SuperAdminApplications />} />
        </Route>

        {/* Company Admin Routes (for inline Super Admin Impersonation) */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<ModuleGuard moduleId="members"><AdminMembers /></ModuleGuard>} />
          <Route path="/admin/events" element={<ModuleGuard moduleId="events"><AdminEvents /></ModuleGuard>} />
          <Route path="/admin/podcasts" element={<ModuleGuard moduleId="podcasts"><AdminPodcasts /></ModuleGuard>} />
          <Route path="/admin/blogs" element={<ModuleGuard moduleId="blogs"><AdminBlogs /></ModuleGuard>} />
          <Route path="/admin/resources" element={<ModuleGuard moduleId="resources"><AdminResources /></ModuleGuard>} />
          <Route path="/admin/terms" element={<AdminTerms />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/membership" element={<AdminMembership />} />
        </Route>

        {/* User Routes (for Super Admin Impersonation) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/friends" element={<ModuleGuard moduleId="friends"><FriendsPage /></ModuleGuard>} />
          <Route path="/events" element={<ModuleGuard moduleId="events"><EventsPage /></ModuleGuard>} />
          <Route path="/my-feed" element={<MyFeedPage />} />
          <Route path="/members" element={<ModuleGuard moduleId="members"><MembersPage /></ModuleGuard>} />
          <Route path="/podcast" element={<ModuleGuard moduleId="podcasts"><PodcastPage /></ModuleGuard>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-invoices" element={<MyInvoicesPage />} />
          <Route path="/resources" element={<ModuleGuard moduleId="resources"><ResourcesPage /></ModuleGuard>} />
          <Route path="/blogs" element={<ModuleGuard moduleId="blogs"><BlogsPage /></ModuleGuard>} />
          <Route path="/blogs/:slug" element={<ModuleGuard moduleId="blogs"><BlogDetailPage /></ModuleGuard>} />
          <Route path="/share-business" element={<ShareBusinessPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  if (variant === "companyadmin") {
    return (
      <Routes>
        <Route path="/" element={<CompanyAdminLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<ModuleGuard moduleId="members"><AdminMembers /></ModuleGuard>} />
          <Route path="/admin/events" element={<ModuleGuard moduleId="events"><AdminEvents /></ModuleGuard>} />
          <Route path="/admin/podcasts" element={<ModuleGuard moduleId="podcasts"><AdminPodcasts /></ModuleGuard>} />
          <Route path="/admin/blogs" element={<ModuleGuard moduleId="blogs"><AdminBlogs /></ModuleGuard>} />
          <Route path="/admin/resources" element={<ModuleGuard moduleId="resources"><AdminResources /></ModuleGuard>} />
          <Route path="/admin/terms" element={<AdminTerms />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/membership" element={<AdminMembership />} />
        </Route>

        {/* User Routes (for Company Admin Access) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/friends" element={<ModuleGuard moduleId="friends"><FriendsPage /></ModuleGuard>} />
          <Route path="/events" element={<ModuleGuard moduleId="events"><EventsPage /></ModuleGuard>} />
          <Route path="/my-feed" element={<MyFeedPage />} />
          <Route path="/members" element={<ModuleGuard moduleId="members"><MembersPage /></ModuleGuard>} />
          <Route path="/podcast" element={<ModuleGuard moduleId="podcasts"><PodcastPage /></ModuleGuard>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-invoices" element={<MyInvoicesPage />} />
          <Route path="/resources" element={<ModuleGuard moduleId="resources"><ResourcesPage /></ModuleGuard>} />
          <Route path="/blogs" element={<ModuleGuard moduleId="blogs"><BlogsPage /></ModuleGuard>} />
          <Route path="/blogs/:slug" element={<ModuleGuard moduleId="blogs"><BlogDetailPage /></ModuleGuard>} />
          <Route path="/share-business" element={<ShareBusinessPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  if (variant === "user") {
    return (
      <Routes>
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/friends" element={<ModuleGuard moduleId="friends"><FriendsPage /></ModuleGuard>} />
          <Route path="/events" element={<ModuleGuard moduleId="events"><EventsPage /></ModuleGuard>} />
          <Route path="/my-feed" element={<MyFeedPage />} />
          <Route path="/members" element={<ModuleGuard moduleId="members"><MembersPage /></ModuleGuard>} />
          <Route path="/podcast" element={<ModuleGuard moduleId="podcasts"><PodcastPage /></ModuleGuard>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-invoices" element={<MyInvoicesPage />} />
          <Route path="/resources" element={<ModuleGuard moduleId="resources"><ResourcesPage /></ModuleGuard>} />
          <Route path="/blogs" element={<ModuleGuard moduleId="blogs"><BlogsPage /></ModuleGuard>} />
          <Route path="/blogs/:slug" element={<ModuleGuard moduleId="blogs"><BlogDetailPage /></ModuleGuard>} />
          <Route path="/share-business" element={<ShareBusinessPage />} />
          {/* Default user landing logic if they login but hit an unhandled path */}
          <Route path="/home" element={<HomePage />} />
        </Route>
        {/* Public routes accessed by users without auth */}
        <Route path="/card/:id" element={<PublicCardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
  if (variant === "customdomain") {
    return (
      <Routes>
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Company Admin Routes mapped to /admin */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<ModuleGuard moduleId="members"><AdminMembers /></ModuleGuard>} />
          <Route path="/admin/events" element={<ModuleGuard moduleId="events"><AdminEvents /></ModuleGuard>} />
          <Route path="/admin/podcasts" element={<ModuleGuard moduleId="podcasts"><AdminPodcasts /></ModuleGuard>} />
          <Route path="/admin/blogs" element={<ModuleGuard moduleId="blogs"><AdminBlogs /></ModuleGuard>} />
          <Route path="/admin/resources" element={<ModuleGuard moduleId="resources"><AdminResources /></ModuleGuard>} />
          <Route path="/admin/terms" element={<AdminTerms />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/membership" element={<AdminMembership />} />
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/friends" element={<ModuleGuard moduleId="friends"><FriendsPage /></ModuleGuard>} />
          <Route path="/events" element={<ModuleGuard moduleId="events"><EventsPage /></ModuleGuard>} />
          <Route path="/my-feed" element={<MyFeedPage />} />
          <Route path="/members" element={<ModuleGuard moduleId="members"><MembersPage /></ModuleGuard>} />
          <Route path="/podcast" element={<ModuleGuard moduleId="podcasts"><PodcastPage /></ModuleGuard>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-invoices" element={<MyInvoicesPage />} />
          <Route path="/resources" element={<ModuleGuard moduleId="resources"><ResourcesPage /></ModuleGuard>} />
          <Route path="/blogs" element={<ModuleGuard moduleId="blogs"><BlogsPage /></ModuleGuard>} />
          <Route path="/blogs/:slug" element={<ModuleGuard moduleId="blogs"><BlogDetailPage /></ModuleGuard>} />
          <Route path="/share-business" element={<ShareBusinessPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="/card/:id" element={<PublicCardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Main Landing Page
  return (
    <Routes>
      <Route path="/" element={<PremiumLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/get-started" element={<Navigate to="/" replace />} />
      {/* Retain public cards on main domain just in case */}
      <Route path="/card/:id" element={<PublicCardPage />} />

      {/* Fallbacks for legacy/local development -> we can redirect to the corresponding subdomains if you host them, but for now we'll just redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
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
                <AppRoutes />
              </BrowserRouter>
            </PostsProvider>
          </ApplicationsProvider>
        </BusinessCardProvider>
      </ProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
