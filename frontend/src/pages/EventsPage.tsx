import { EventCard } from "@/components/EventCard";
import eventPitch from "@/assets/event-pitch.jpg";
import eventSummit from "@/assets/event-summit.jpg";
import eventMixer from "@/assets/event-women-tech.jpg";
import eventBootcamp from "@/assets/event-bootcamp.jpg";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/user/events");
        const mapped = (res.data?.data || []).map((e: any) => ({
          ...e,
          // Format prisma DateTime back into friendly Mar 15, 2026 strings
          date: new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          attendees: 0, // Mock for now until engagement tracking is built
        }));
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading events...</div>;
  }
  return (
    <div className="min-h-screen bg-section-amber/40">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground">Events</h2>
          <p className="text-sm text-muted-foreground">Upcoming networking events</p>
        </div>
        <div className="space-y-3">
          {events.map((event, i) => (
            <EventCard key={event.title} index={i} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
