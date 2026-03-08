import { FeedCard } from "@/components/FeedCard";
import { CreatePost } from "@/components/CreatePost";
import { usePosts } from "@/lib/postsContext";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import feedFunding from "@/assets/feed-funding.jpg";
import feedPodcast from "@/assets/feed-podcast.jpg";
import feedSummit from "@/assets/feed-summit.jpg";
import { useState } from "react";

const feedData = [
  {
    avatar: "SL",
    name: "Sarah Lawson",
    role: "CEO at Nexora Labs",
    content: "Thrilled to announce our Series A funding! Looking forward to connecting with more founders at next week's networking mixer. 🚀",
    tag: "Update",
    image: feedFunding,
    likes: 42,
    comments: 8,
  },
  {
    avatar: "MK",
    name: "Michael Kerr",
    role: "Marketing Director",
    content: "Just published a new episode of The Growth Loop podcast discussing retention strategies for SaaS products. Give it a listen!",
    tag: "Podcast",
    image: feedPodcast,
    likes: 28,
    comments: 5,
  },
  {
    avatar: "JP",
    name: "Jessica Park",
    role: "UX Designer at Craft Studio",
    content: "Great conversations at yesterday's Design Leadership Summit. The panel on inclusive design was outstanding. Who else was there?",
    image: feedSummit,
    likes: 35,
    comments: 12,
  },
  {
    avatar: "RD",
    name: "Ryan Davis",
    role: "Venture Partner",
    content: "We're hosting an exclusive pitch night for early-stage startups. Applications close Friday — link in bio.",
    tag: "Event",
    likes: 67,
    comments: 15,
  },
  {
    avatar: "AK",
    name: "Amara Kim",
    role: "Product Manager at BuildFlow",
    content: "Reflections on transitioning from engineering to product management — lessons learned after 6 months in my new role.",
    likes: 53,
    comments: 21,
  },
];

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
  const { posts } = usePosts();

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
      <div className="mb-2">
        <h2 className="font-heading font-bold text-xl text-foreground">Feed</h2>
        <p className="text-sm text-muted-foreground">Stay updated with your network</p>
      </div>

      <CreatePost />

      {posts.map((post, i) => (
        <UserPostCard key={post.id} post={post} index={i} />
      ))}

      {feedData.map((item, i) => (
        <FeedCard key={i} index={i + posts.length} {...item} />
      ))}
    </div>
  );
};

export default HomePage;
