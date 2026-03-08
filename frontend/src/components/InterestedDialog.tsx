import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, MessageCircle, UserPlus } from "lucide-react";
import { avatars } from "@/lib/avatars";

interface InterestedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizer: {
    initials: string;
    name: string;
    role: string;
    isFriend: boolean;
    phone?: string;
    whatsapp?: string;
  };
  eventTitle: string;
  onSendRequest: () => void;
}

export const InterestedDialog = ({ open, onOpenChange, organizer, eventTitle, onSendRequest }: InterestedDialogProps) => {
  const avatarSrc = avatars[organizer.initials];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-base">Interested in {eventTitle}</DialogTitle>
          <DialogDescription className="text-xs">
            {organizer.isFriend
              ? `You're connected with ${organizer.name}. Reach out directly!`
              : `You're not connected with ${organizer.name} yet.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm shrink-0 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={organizer.name} className="w-full h-full object-cover" />
            ) : (
              organizer.initials
            )}
          </div>
          <div className="min-w-0">
            <p className="font-heading font-semibold text-sm text-foreground truncate">{organizer.name}</p>
            <p className="text-xs text-muted-foreground truncate">{organizer.role}</p>
          </div>
          {organizer.isFriend && (
            <span className="chip ml-auto text-[10px]">Connected</span>
          )}
        </div>

        <div className="space-y-2 pt-1">
          {organizer.isFriend ? (
            <>
              {organizer.whatsapp && (
                <a
                  href={organizer.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all active:scale-[0.98] text-primary-foreground"
                  style={{ background: "hsl(142, 70%, 40%)" }}
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  Message on WhatsApp
                </a>
              )}
              <a
                href={`tel:${organizer.phone}`}
                className="w-full flex items-center gap-3 rounded-xl p-3 text-sm font-medium bg-primary text-primary-foreground transition-all active:scale-[0.98]"
              >
                <Phone className="w-4.5 h-4.5" />
                Call {organizer.name.split(" ")[0]}
              </a>
            </>
          ) : (
            <button
              onClick={() => {
                onSendRequest();
                onOpenChange(false);
              }}
              className="w-full flex items-center gap-3 rounded-xl p-3 text-sm font-medium bg-primary text-primary-foreground transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4.5 h-4.5" />
              Send Connection Request
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
