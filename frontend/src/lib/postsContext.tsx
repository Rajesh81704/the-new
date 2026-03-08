import { createContext, useContext, useState, ReactNode } from "react";

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
  addPost: (post: Omit<UserPost, "id" | "timestamp" | "likes">) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<UserPost[]>([]);

  const addPost = (post: Omit<UserPost, "id" | "timestamp" | "likes">) => {
    setPosts((prev) => [
      {
        ...post,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        likes: 0,
      },
      ...prev,
    ]);
  };

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
};
