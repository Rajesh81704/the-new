import { useParams } from "react-router-dom";
import { useBusinessCards } from "@/lib/businessCardContext";
import { BusinessCardPreview } from "@/components/BusinessCardPreview";
import { Share2 } from "lucide-react";

export default function PublicCardPage() {
  const { id } = useParams<{ id: string }>();
  const { getCard } = useBusinessCards();
  const card = id ? getCard(id) : undefined;

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Share2 className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <h1 className="font-heading text-lg font-bold text-foreground">Card Not Found</h1>
          <p className="text-sm text-muted-foreground">This business card may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BusinessCardPreview card={card} />
        <p className="text-center text-[10px] text-muted-foreground/50 mt-4">
          Powered by NetLink
        </p>
      </div>
    </div>
  );
}
