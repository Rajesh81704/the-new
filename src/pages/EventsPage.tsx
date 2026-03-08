import { EventCard } from "@/components/EventCard";
import eventPitch from "@/assets/event-pitch.jpg";
import eventSummit from "@/assets/event-summit.jpg";
import eventMixer from "@/assets/event-women-tech.jpg";
import eventBootcamp from "@/assets/event-bootcamp.jpg";

const events = [
  {
    title: "Startup Pitch Night",
    date: "Mar 15, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "Innovation Hub, San Francisco",
    attendees: 84,
    image: eventPitch,
    description: "Join us for an evening of exciting startup pitches from early-stage founders. Network with investors, mentors, and fellow entrepreneurs over food and drinks.",
    organizer: {
      initials: "RD",
      name: "Ryan Davis",
      role: "Venture Partner at Horizon Ventures",
      isFriend: false,
      phone: "+1 (650) 555-0401",
    },
  },
  {
    title: "Design Leadership Summit",
    date: "Mar 22, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "The Grand Hall, New York",
    attendees: 210,
    image: eventSummit,
    platform: "Zoom",
    description: "A full-day summit featuring panels on inclusive design, design systems at scale, and leadership in creative teams. Hybrid event with virtual access.",
    organizer: {
      initials: "JP",
      name: "Jessica Park",
      role: "UX Designer at Craft Studio",
      isFriend: true,
      phone: "+1 (310) 555-0302",
      whatsapp: "https://wa.me/13105550302",
    },
  },
  {
    title: "Tech Networking Mixer",
    date: "Apr 3, 2026",
    time: "5:30 PM – 8:30 PM",
    location: "Skyline Lounge, Austin",
    attendees: 65,
    image: eventMixer,
    description: "An intimate networking mixer for professionals in tech. Casual atmosphere with curated introductions and a keynote on building diverse teams.",
    organizer: {
      initials: "AK",
      name: "Amara Kim",
      role: "Product Manager at BuildFlow",
      isFriend: true,
      phone: "+1 (206) 555-0502",
      whatsapp: "https://wa.me/12065550502",
    },
  },
  {
    title: "Product Management Bootcamp",
    date: "Apr 10, 2026",
    time: "10:00 AM – 4:00 PM",
    location: "Virtual Event",
    attendees: 340,
    image: eventBootcamp,
    platform: "Google Meet",
    description: "Intensive one-day bootcamp covering product strategy, roadmap planning, user research, and stakeholder management. Perfect for aspiring and new PMs.",
    organizer: {
      initials: "SL",
      name: "Sarah Lawson",
      role: "CEO at Nexora Labs",
      isFriend: true,
      phone: "+1 (415) 555-0102",
      whatsapp: "https://wa.me/14155550102",
    },
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
