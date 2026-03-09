import { FeedCard } from "@/components/FeedCard";
import { CreatePost } from "@/components/CreatePost";
import { usePosts } from "@/lib/postsContext";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import feedFunding from "@/assets/feed-funding.jpg";
import feedPodcast from "@/assets/feed-podcast.jpg";
import feedSummit from "@/assets/feed-summit.jpg";
import { useState, useEffect } from "react";
import api from "@/lib/api";

// Assuming UserPost format from postsContext
// We will still display context ones along with backend if we want,
// but let's fetch backend posts and render them.
const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
};

const UserPostCard = ({ post, index }: { post: { content: string; image?: string; youtubeUrl?: string; timestamp: Date; likes: number }; index: number }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const youtubeId = post.youtubeUrl ? getYoutubeId(post.youtubeUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="card-interactive p-4"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm shrink-0">
          AJ
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-sm text-foreground">Alex Johnson</p>
          <p className="text-xs text-muted-foreground">Product Designer · {timeAgo(post.timestamp)}</p>
        </div>
        <span className="chip">You</span>
      </div>

      {post.content && (
        <p className="text-sm text-foreground/85 leading-relaxed mb-3">{post.content}</p>
      )}

      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 bg-muted aspect-video">
          <img src={post.image} alt="Post media" className="w-full h-full object-cover" />
        </div>
      )}

      {youtubeId && (
        <div className="rounded-xl overflow-hidden mb-3 bg-muted aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className="w-full h-full"
            allowFullScreen
            title="YouTube video"
          />
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t border-border">
        <button
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
          className={`btn-ghost flex items-center gap-1.5 ${liked ? "text-destructive" : ""}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span className="text-xs">{likeCount}</span>
        </button>
      </div>
    </motion.div>
  );
};

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const HomePage = () => {
  const { posts: contextPosts } = usePosts();
  const [backendPosts, setBackendPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/feed");
        if (res.data?.data) {
          setBackendPosts(res.data.data.map((p: any) => ({
            ...p,
            likes: 0,
            timestamp: new Date(p.createdAt)
          })));
        }
      } catch (error) {
        console.error("Error loading posts", error);
      }
    };
    fetchPosts();
  }, []);

  const allPosts = [...contextPosts, ...backendPosts];

  return (
    <div className="min-h-screen bg-section-teal/40">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <div className="mb-2">
          <h2 className="font-heading font-bold text-xl text-foreground">Feed</h2>
          <p className="text-sm text-muted-foreground">Stay updated with your network</p>
        </div>

        <CreatePost />

        {allPosts.map((post, i) => (
          <UserPostCard key={post.id || i} post={post} index={i} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
