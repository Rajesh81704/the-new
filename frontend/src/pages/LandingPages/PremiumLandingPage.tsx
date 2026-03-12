import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Users, Zap, Shield, Globe, BarChart3, 
  MessageSquare, Sparkles, Layout, Cpu, Database, Cloud,
  Building2, Calendar, Headphones, PenLine, BookOpen, Star,
  Menu, X, ChevronDown, CheckCircle2, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  { 
    icon: Users, 
    title: "Member Management", 
    desc: "Seamlessly onboard and organize your professional network with advanced filtering and tagging.",
    color: "from-blue-500 to-cyan-400"
  },
  { 
    icon: Calendar, 
    title: "Event Orchestration", 
    desc: "Host webinars, physical meetups, and conferences with built-in ticketing and attendance tracking.",
    color: "from-purple-500 to-pink-400"
  },
  { 
    icon: Headphones, 
    title: "Media Hosting", 
    desc: "Publish podcasts and video content directly to your community with high-fidelity streaming.",
    color: "from-orange-500 to-amber-400"
  },
  { 
    icon: PenLine, 
    title: "Thought Leadership", 
    desc: "Empower your members to share insights through integrated blogs and resource libraries.",
    color: "from-emerald-500 to-teal-400"
  },
  { 
    icon: Shield, 
    title: "Enterprise Security", 
    desc: "Bank-grade encryption, custom roles, and permission management for absolute data safety.",
    color: "from-red-500 to-orange-400"
  },
  { 
    icon: Zap, 
    title: "Digital Business Cards", 
    desc: "Revolutionize networking with NFC-enabled and QR-based digital profile sharing.",
    color: "from-yellow-400 to-orange-500"
  },
];

const stats = [
  { label: "Communities Launched", value: "500+" },
  { label: "Active Members", value: "1.2M+" },
  { label: "Events Hosted", value: "25k+" },
  { label: "Countries Reached", value: "40+" },
];

export default function PremiumLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary/30 selection:text-primary-foreground font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? "bg-slate-950/80 backdrop-blur-xl border-slate-800/50 py-3" : "bg-transparent border-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">
              Connect<span className="text-primary italic">Pro</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Enterprise", "Pricing", "Support"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50 hidden sm:inline-flex" onClick={() => window.location.href = "https://user.connectpro.in/login"}>
              Login
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-primary/30 bg-primary/5 text-primary-foreground backdrop-blur-sm animate-bounce text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline-block" />
              The Future of Networking is Here
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] font-heading tracking-tight mb-8">
              Orchestrate Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient">
                Digital Community
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              ConnectPro is the enterprise-grade SaaS infrastructure that empowers you to build, scale, and monetize private networking platforms with absolute precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-slate-950 hover:bg-slate-100 shadow-2xl shadow-white/10 group">
                Apply for Access
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-sm">
                View Live Demo
                <Play className="ml-2 w-4 h-4 text-primary fill-primary" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            style={{ opacity, scale }}
            className="mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl backdrop-blur-sm shadow-blue-500/5"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="ml-4 h-6 px-3 bg-slate-800 rounded-md text-[10px] text-slate-500 flex items-center">
                community.connectpro.io/admin
              </div>
            </div>
            <div className="aspect-[16/9] bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-60 mix-blend-luminosity hover:grayscale-0 transition-all duration-700 cursor-crosshair">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                <div className="text-left">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20 mb-2">System Active</Badge>
                  <h3 className="text-2xl font-bold font-heading">Real-time Analytics Dashboard</h3>
                </div>
                <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800">
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">New Members</p>
                      <p className="text-xl font-bold text-white">+1,280</p>
                    </div>
                    <div className="w-px h-full bg-slate-800" />
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Growth Rate</p>
                      <p className="text-xl font-bold text-primary">24.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-slate-900/50 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="text-4xl md:text-5xl font-extrabold text-white mb-2 font-heading tracking-tighter">{stat.value}</h4>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">Architected for Scalability</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A comprehensive suite of modules designed to handle the complexity of modern professional networking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group relative h-full bg-slate-900/30 border-slate-800 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity animate-pulse`} />
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Dashboard Preview Section */}
      <section className="py-32 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 uppercase tracking-wider text-[10px] font-bold py-1">Enterprise Admin Console</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading leading-tight italic">
                Absolute Control Over Your Platform.
              </h2>
              <ul className="space-y-6">
                {[
                  "Hierarchical User Permissions & RBAC",
                  "Real-time Engagement & Retention Heatmaps",
                  "Automated Invoicing & Tax Compliance",
                  "Custom Branded Mobile Applications"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-12 rounded-full px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl shadow-primary/20">
                Explore Admin Features
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                  alt="Dashboard Preview"
                  className="w-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-primary/5 to-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 font-heading">Ready to scale?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">
              Join elite networking communities managing thousands of professional interactions daily on ConnectPro.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white text-[#020617] hover:bg-slate-200 shadow-2xl shadow-white/10 group">
                Apply for License
                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-full border-slate-700 bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-900 bg-slate-950/50 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-heading">ConnectPro</span>
            </div>
            <p className="text-slate-500 max-w-xs text-sm leading-relaxed mb-8">
              Premium community infrastructure for modern networking societies. Built with absolute precision in Bangalore, India.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          {[
            { title: "Product", links: ["Features", "Roadmap", "Pricing", "Enterprise"] },
            { title: "Legal", links: ["Privacy", "Terms", "DPA", "Security"] },
            { title: "Support", links: ["Help Center", "Community", "Developers", "Status"] },
          ].map((column) => (
            <div key={column.title}>
              <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{column.title}</h5>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 ConnectPro Digital Systems. Distributed by Magically Social LLC.</p>
          <div className="flex gap-8 mt-4 sm:mt-0">
            <span>Built by 10x Engineers</span>
            <span className="text-primary">•</span>
            <span>Uptime: 99.99%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
