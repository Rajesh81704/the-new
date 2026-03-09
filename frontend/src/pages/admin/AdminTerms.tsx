import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const defaultTerms = `Terms and Conditions

Last updated: March 1, 2026

1. Acceptance of Terms
By accessing and using Magically Super, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily use Magically Super for personal, non-commercial transitory viewing only.

3. User Accounts
You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.

4. Privacy Policy
Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.

5. Content
Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material.

6. Termination
We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.

7. Changes
We reserve the right, at our sole discretion, to modify or replace these terms at any time.

8. Contact Us
If you have any questions about these Terms, please contact us at support@netlink.com.`;

const AdminTerms = () => {
  const [content, setContent] = useState(defaultTerms);
  const [saved, setSaved] = useState(defaultTerms);

  const hasChanges = content !== saved;

  const handleSave = () => {
    setSaved(content);
    toast.success("Terms & Conditions saved");
  };

  const handleReset = () => {
    setContent(saved);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit the terms & conditions content displayed to users.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {hasChanges ? "⚠️ You have unsaved changes" : "✅ All changes saved"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={24}
          className="font-mono text-sm leading-relaxed resize-y min-h-[300px]"
          placeholder="Enter terms & conditions content..."
        />
        <p className="text-xs text-muted-foreground mt-3">
          💡 Rich text editor will be available once backend is connected. Currently using plain text.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminTerms;
