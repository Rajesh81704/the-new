import { usePosts } from "@/lib/postsContext";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
};

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const MyFeedPage = () => {
  const { posts } = usePosts();
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1.5 -ml-3">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>
      <div className="mb-2">
        <h2 className="font-heading font-bold text-xl text-foreground">My Feed</h2>
        <p className="text-sm text-muted-foreground">Posts you've shared with your network</p>
      </div>

      {posts.length === 0 && (
        <div className="card-interactive p-8 text-center">
          <p className="text-muted-foreground text-sm">You haven't posted anything yet.</p>
          <button onClick={() => navigate("/")} className="btn-primary mt-3 text-xs">
            Create your first post
          </button>
        </div>
      )}

      {posts.map((post, i) => {
        const youtubeId = post.youtubeUrl ? getYoutubeId(post.youtubeUrl) : null;
        return (
          <MyPostCard key={post.id} post={post} youtubeId={youtubeId} index={i} />
        );
      })}
    </div>
  );
};

const MyPostCard = ({ post, youtubeId, index }: { post: { content: string; image?: string; youtubeUrl?: string; timestamp: Date; likes: number }; youtubeId: string | null; index: number }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

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

export default MyFeedPage;
