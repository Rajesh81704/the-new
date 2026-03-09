import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/lib/api";

export interface UserPost {
  id: string;
  content: string;
  image?: string;
  youtubeUrl?: string;
  timestamp: Date;
  likes: number;
}

interface PostsContextType {
  posts: UserPost[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  addPost: (post: Omit<UserPost, "id" | "timestamp" | "likes">) => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/feed");
      const apiPosts = response.data?.data?.posts ?? [];

      setPosts(
        apiPosts.map((post: any) => ({
          id: post.id,
          content: post.content,
          image: post.mediaUrl || undefined,
          timestamp: new Date(post.createdAt),
          likes: 0,
        }))
      );
    } catch (error) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (post: Omit<UserPost, "id" | "timestamp" | "likes">) => {
    await apiClient.post("/feed", {
      content: post.content,
      mediaUrl: post.image || post.youtubeUrl,
    });

    await refreshPosts();
  }, [refreshPosts]);

  useEffect(() => {
    void refreshPosts();
  }, [refreshPosts]);

  return (
    <PostsContext.Provider value={{ posts, loading, refreshPosts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
};
