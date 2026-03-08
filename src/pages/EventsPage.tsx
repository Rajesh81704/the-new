import { EventCard } from "@/components/EventCard";

const events = [
  {
    title: "Startup Pitch Night",
    date: "Mar 15, 2026",
    time: "6:00 PM",
    location: "Innovation Hub, San Francisco",
    attendees: 84,
    color: "bg-primary/10",
  },
  {
    title: "Design Leadership Summit",
    date: "Mar 22, 2026",
    time: "9:00 AM",
    location: "The Grand Hall, New York",
    attendees: 210,
    color: "bg-accent/10",
  },
  {
    title: "Women in Tech Mixer",
    date: "Apr 3, 2026",
    time: "5:30 PM",
    location: "Skyline Lounge, Austin",
    attendees: 65,
    color: "bg-secondary",
  },
  {
    title: "Product Management Bootcamp",
    date: "Apr 10, 2026",
    time: "10:00 AM",
    location: "Virtual Event",
    attendees: 340,
    color: "bg-primary/5",
  },
];

const EventsPage = () => {
  return (
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
  );
};

export default EventsPage;
