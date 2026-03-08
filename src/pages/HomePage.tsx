import { FeedCard } from "@/components/FeedCard";

const feedData = [
  {
    avatar: "SL",
    name: "Sarah Lawson",
    role: "CEO at Nexora Labs",
    content: "Thrilled to announce our Series A funding! Looking forward to connecting with more founders at next week's networking mixer. 🚀",
    tag: "Update",
    likes: 42,
    comments: 8,
  },
  {
    avatar: "MK",
    name: "Michael Kerr",
    role: "Marketing Director",
    content: "Just published a new episode of The Growth Loop podcast discussing retention strategies for SaaS products. Give it a listen!",
    tag: "Podcast",
    image: "🎙️ The Growth Loop — Episode 24",
    likes: 28,
    comments: 5,
  },
  {
    avatar: "JP",
    name: "Jessica Park",
    role: "UX Designer at Craft Studio",
    content: "Great conversations at yesterday's Design Leadership Summit. The panel on inclusive design was outstanding. Who else was there?",
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

const HomePage = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
      <div className="mb-2">
        <h2 className="font-heading font-bold text-xl text-foreground">Feed</h2>
        <p className="text-sm text-muted-foreground">Stay updated with your network</p>
      </div>
      {feedData.map((item, i) => (
        <FeedCard key={i} index={i} {...item} />
      ))}
    </div>
  );
};

export default HomePage;
