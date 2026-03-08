import { BusinessCard } from "@/lib/businessCardContext";
import { Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";

export function BusinessCardPreview({ card }: { card: BusinessCard }) {
  const initials = card.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (card.template === "modern") {
    return <ModernCard card={card} initials={initials} />;
  }
  return <ClassicCard card={card} initials={initials} />;
}

function ModernCard({ card, initials }: { card: BusinessCard; initials: string }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-border">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-foreground/30" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">{initials}</div>
          )}
          <div>
            <h2 className="font-heading font-bold text-lg">{card.name}</h2>
            <p className="text-sm opacity-85">{card.role}</p>
            {card.company && <p className="text-xs opacity-70 mt-0.5">{card.company}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-card p-5 space-y-4">
        {card.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
        )}

        <div className="space-y-2.5">
          {card.phone && <InfoRow icon={<Phone className="w-3.5 h-3.5" />} value={card.phone} href={`tel:${card.phone}`} />}
          {card.email && <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={card.email} href={`mailto:${card.email}`} />}
          {card.website && <InfoRow icon={<Globe className="w-3.5 h-3.5" />} value={card.website.replace(/^https?:\/\//, "")} href={card.website} />}
          {card.address && <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} value={card.address} />}
        </div>

        <SocialLinks card={card} />
      </div>
    </div>
  );
}

function ClassicCard({ card, initials }: { card: BusinessCard; initials: string }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-border bg-card">
      <div className="p-6 text-center border-b border-border">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-primary/10" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto">{initials}</div>
        )}
        <h2 className="font-heading font-bold text-lg text-foreground mt-3">{card.name}</h2>
        <p className="text-sm text-muted-foreground">{card.role}{card.company && ` · ${card.company}`}</p>
      </div>

      <div className="p-5 space-y-4">
        {card.description && (
          <p className="text-sm text-muted-foreground leading-relaxed text-center">{card.description}</p>
        )}

        <div className="space-y-2.5">
          {card.phone && <InfoRow icon={<Phone className="w-3.5 h-3.5" />} value={card.phone} href={`tel:${card.phone}`} />}
          {card.email && <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={card.email} href={`mailto:${card.email}`} />}
          {card.website && <InfoRow icon={<Globe className="w-3.5 h-3.5" />} value={card.website.replace(/^https?:\/\//, "")} href={card.website} />}
          {card.address && <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} value={card.address} />}
        </div>

        <SocialLinks card={card} />
      </div>
    </div>
  );
}

function InfoRow({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-foreground truncate">{value}</span>
      {href && <ExternalLink className="w-3 h-3 text-muted-foreground/50 shrink-0 ml-auto" />}
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">{content}</a>;
  return <div className="-mx-2 px-2 py-1">{content}</div>;
}

function SocialLinks({ card }: { card: BusinessCard }) {
  const links = [
    { url: card.linkedin, label: "in", bg: "bg-[hsl(210,80%,45%)]" },
    { url: card.twitter, label: "𝕏", bg: "bg-foreground" },
    { url: card.instagram, label: "📷", bg: "bg-gradient-to-br from-[hsl(330,80%,55%)] to-[hsl(30,90%,55%)]" },
    { url: card.whatsapp, label: "💬", bg: "bg-[hsl(142,70%,40%)]" },
  ].filter(l => l.url);

  if (!links.length) return null;

  return (
    <div className="flex gap-2 pt-2 justify-center">
      {links.map((l) => (
        <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
          className={`w-9 h-9 rounded-full ${l.bg} text-primary-foreground flex items-center justify-center text-xs font-bold hover:opacity-80 transition-opacity`}>
          {l.label}
        </a>
      ))}
    </div>
  );
}
