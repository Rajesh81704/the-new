import { useState, useRef } from "react";
import { Image, Youtube, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "@/lib/postsContext";
import { useMyProfile } from "@/lib/profileContext";
import { toast } from "sonner";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
};

export const CreatePost = () => {
  const { addPost } = usePosts();
  const { profile } = useMyProfile();
  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const youtubeId = youtubeUrl ? getYoutubeId(youtubeUrl) : null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !imagePreview && !youtubeId) return;
    try {
      await addPost({
        content: text.trim(),
        image: imagePreview || undefined,
        youtubeUrl: youtubeId ? youtubeUrl : undefined,
      });

      setText("");
      setImagePreview(null);
      setYoutubeUrl("");
      setShowYoutubeInput(false);
      toast.success("Post published!");
    } catch (error) {
      toast.error("Could not publish post");
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="card-interactive p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm shrink-0">
          {initials}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share something with your network..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[60px]"
          rows={2}
        />
      </div>

      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative rounded-xl overflow-hidden bg-muted"
          >
            <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 text-background flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {showYoutubeInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube link..."
                className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
              />
              <button onClick={() => { setShowYoutubeInput(false); setYoutubeUrl(""); }} className="text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {youtubeId && (
              <div className="rounded-xl overflow-hidden aspect-video bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  className="w-full h-full"
                  allowFullScreen
                  title="YouTube preview"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-ghost flex items-center gap-1.5 text-xs"
          >
            <Image className="w-4 h-4" />
            Photo
          </button>
          <button
            onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            className="btn-ghost flex items-center gap-1.5 text-xs"
          >
            <Youtube className="w-4 h-4" />
            Video
          </button>
        </div>
        <button
          onClick={handlePost}
          disabled={!text.trim() && !imagePreview && !youtubeId}
          className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="w-3.5 h-3.5" />
          Post
        </button>
      </div>
    </div>
  );
};
