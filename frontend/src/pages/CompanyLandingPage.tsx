import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Calendar, Headphones, PenLine, BookOpen, MessageSquare,
  BarChart3, Settings, CreditCard, Globe, Shield, Zap, ArrowRight,
  CheckCircle2, Star, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApplications } from "@/lib/applicationsContext";
import { toast } from "sonner";

const features = [
  { icon: Users, title: "Member Management", desc: "Onboard, manage, and organize your community members with ease." },
  { icon: Calendar, title: "Events", desc: "Create and manage networking events, meetups, and conferences." },
  { icon: Headphones, title: "Podcasts", desc: "Host and share industry podcasts with your community." },
  { icon: PenLine, title: "Blogs", desc: "Publish articles, insights, and thought leadership content." },
  { icon: BookOpen, title: "Resources", desc: "Share documents, guides, and learning materials." },
  { icon: MessageSquare, title: "News Feed", desc: "Keep your community engaged with a real-time activity feed." },
  { icon: BarChart3, title: "Analytics", desc: "Track growth, engagement, and membership insights." },
  { icon: CreditCard, title: "Membership Plans", desc: "Create tiered memberships with flexible pricing." },
  { icon: Globe, title: "Custom Domain", desc: "Brand your platform with your own custom domain." },
  { icon: Shield, title: "Payment Gateway", desc: "Integrate Razorpay, PhonePe, Cashfree, PayU & more." },
  { icon: Settings, title: "Admin Dashboard", desc: "Full control panel to manage every aspect of your platform." },
  { icon: Zap, title: "Digital Business Cards", desc: "Members can create and share digital business cards." },
];

const testimonials = [
  { name: "Amit Patel", company: "TechNet India", text: "NetLink helped us scale our community from 100 to 1000+ members in 6 months.", stars: 5 },
  { name: "Sneha Kapoor", company: "StartupHub", text: "The admin panel is incredibly powerful. We manage everything from one place.", stars: 5 },
  { name: "Vikram Singh", company: "BizConnect", text: "Setting up was seamless. Our members love the digital business card feature.", stars: 4 },
];

const pricingPlans = [
  { name: "Starter", price: "₹8,000", period: "/month", members: "Up to 50 members", modules: "4 modules", highlight: false },
  { name: "Professional", price: "₹25,000", period: "/month", members: "Up to 250 members", modules: "7 modules", highlight: true },
  { name: "Enterprise", price: "₹50,000", period: "/month", members: "Up to 1000 members", modules: "All modules", highlight: false },
];

export default function CompanyLandingPage() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", companyName: "", industry: "", expectedMembers: "", message: "" });

  const setField = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleApply = () => {
    if (!form.name.trim() || !form.email.trim() || !form.companyName.trim()) {
      toast.error("Name, email, and company name are required");
      return;
    }
    addApplication(form);
    toast.success("Application submitted! We'll review and get back to you soon.");
    setApplyOpen(false);
    setForm({ name: "", email: "", phone: "", companyName: "", industry: "", expectedMembers: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span className="font-heading font-bold text-foreground">Net<span className="text-primary">Link</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
            <Button size="sm" onClick={() => setApplyOpen(true)}>Apply Now</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              SaaS Platform for Networking Communities
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              Launch Your Own<br /><span className="text-primary">Networking Platform</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to build, manage, and grow a professional networking community — members, events, podcasts, blogs, payments, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button size="lg" className="gap-2 text-base px-8" onClick={() => setApplyOpen(true)}>
                Apply to Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">Powerful features to run your networking community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Card className="shadow-sm h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                        <f.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-foreground">{f.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Simple Pricing</h2>
            <p className="text-muted-foreground mt-2">Choose a plan that fits your community size</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`shadow-sm relative ${plan.highlight ? "border-primary border-2 shadow-md" : ""}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-heading font-bold text-foreground text-lg">{plan.name}</h3>
                  <div>
                    <span className="text-3xl font-extrabold font-heading text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-primary" />{plan.members}</p>
                    <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-primary" />{plan.modules}</p>
                    <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-primary" />Custom domain</p>
                    <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-primary" />Payment gateway</p>
                  </div>
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"} onClick={() => setApplyOpen(true)}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Trusted by Communities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">Ready to Build Your Community?</h2>
          <p className="text-muted-foreground mt-3">Apply now and get your networking platform up and running in minutes.</p>
          <Button size="lg" className="mt-6 gap-2 text-base px-8" onClick={() => setApplyOpen(true)}>
            Apply Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-foreground">Net<span className="text-primary">Link</span></span>
          </div>
          <p>© 2026 NetLink. All rights reserved.</p>
        </div>
      </footer>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Apply for Company Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name *</Label>
                <Input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Company Name *</Label>
                <Input value={form.companyName} onChange={(e) => setField("companyName", e.target.value)} placeholder="Your company" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Industry</Label>
                <Input value={form.industry} onChange={(e) => setField("industry", e.target.value)} placeholder="e.g. Technology" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Expected Members</Label>
                <Select value={form.expectedMembers} onValueChange={(v) => setField("expectedMembers", v)}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1–50</SelectItem>
                    <SelectItem value="50-200">50–200</SelectItem>
                    <SelectItem value="200-500">200–500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Why do you want to use NetLink?</Label>
              <Textarea value={form.message} onChange={(e) => setField("message", e.target.value)} placeholder="Tell us about your community..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
