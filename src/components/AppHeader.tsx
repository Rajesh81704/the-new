import { useState } from "react";
import { User, LogOut, FileText, Newspaper, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <h1 className="font-heading font-bold text-lg text-foreground tracking-tight">
          Net<span className="text-primary">Link</span>
        </h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/20"
        >
          <User className="w-4.5 h-4.5 text-primary" />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="fixed top-14 right-3 z-[70] w-56 bg-card rounded-2xl border border-border p-1.5"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="font-heading font-semibold text-sm text-foreground">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">Product Designer</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate("/my-profile"); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
              >
                <UserCircle className="w-4 h-4 text-muted-foreground" />
                My Profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/my-feed"); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
              >
                <Newspaper className="w-4 h-4 text-muted-foreground" />
                My Feed
              </button>
              <a
                href="/terms"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                Terms & Conditions
              </a>
              <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
