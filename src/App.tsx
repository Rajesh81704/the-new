import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PostsProvider } from "@/lib/postsContext";
import { ProfileProvider } from "@/lib/profileContext";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import EventsPage from "./pages/EventsPage";
import MembersPage from "./pages/MembersPage";
import PodcastPage from "./pages/PodcastPage";
import TermsPage from "./pages/TermsPage";
import ProfilePage from "./pages/ProfilePage";
import MyFeedPage from "./pages/MyFeedPage";
import MyProfilePage from "./pages/MyProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProfileProvider>
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
