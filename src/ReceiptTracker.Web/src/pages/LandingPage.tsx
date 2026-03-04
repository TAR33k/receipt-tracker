import { motion } from "framer-motion";
import {
  ScanLine,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-[#050506] to-[#0a0a0b]" />
      <motion.div
        className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-[#5E6AD2]/20 blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/15 blur-[100px]"
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-20 left-[30%] w-[300px] h-[300px] rounded-full bg-[#5E6AD2]/10 blur-[80px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#818CF8] text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-powered receipt tracking</span>
          </motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gradient leading-[1.1]">
            Track your
            <br />
            <span className="text-gradient-accent">expenses</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#8A8F98] max-w-2xl mx-auto leading-relaxed">
            AI-powered receipt scanning that extracts data automatically. Track
            expenses, visualize spending, and stay organized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="btn-primary h-14 px-8 text-base"
              onClick={() => navigate("/welcome")}
            >
              Start tracking free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base border-white/10 hover:bg-white/5"
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("features")?.offsetTop ?? 0,
                  behavior: "smooth",
                })
              }
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Learn more
            </Button>
          </div>
          <motion.div
            className="flex items-center justify-center gap-6 sm:gap-12 pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-4xl font-bold text-white">5s</div>
              <div className="text-sm text-[#8A8F98]">Avg. scan time</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-xl sm:text-4xl font-bold text-white">
                95%
              </div>
              <div className="text-sm text-[#8A8F98]">Accuracy rate</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-xl sm:text-4xl font-bold text-white">∞</div>
              <div className="text-sm text-[#8A8F98]">Receipts per month</div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-[#8A8F98]" />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass p-8 rounded-2xl group hover:border-[#5E6AD2]/30 transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center mb-5 group-hover:bg-[#5E6AD2]/20 transition-colors">
        <Icon className="w-7 h-7 text-[#5E6AD2]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-[#8A8F98] leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Extraction",
      description:
        "Advanced OCR technology from Azure AI Document Intelligence extracts data with 95% accuracy.",
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description:
        "Receipts are processed in under 5 seconds. Upload multiple receipts and watch them get organized automatically.",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description:
        "Charts and insights show your spending patterns by merchant, category, and time period.",
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description:
        "Built on Azure with serverless architecture. Your receipts are securely stored and accessible from anywhere.",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "Enterprise-level encryption and security. Your financial data never leaves secure Azure infrastructure.",
    },
    {
      icon: Clock,
      title: "Event-Driven Architecture",
      description:
        "Real-time processing and notifications the moment your receipt is ready.",
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to
            <span className="text-gradient-accent block sm:inline">
              {" "}
              track expenses
            </span>
          </h2>
          <p className="text-lg text-[#8A8F98] max-w-2xl mx-auto">
            A complete receipt management solution powered by cutting-edge AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Snap or Upload",
      desc: "Take a photo with your phone or upload existing receipts from your device.",
    },
    {
      step: "02",
      title: "AI Processing",
      desc: "Azure Document Intelligence extracts all key data in seconds automatically.",
    },
    {
      step: "03",
      title: "Review & Save",
      desc: "Verify the extracted data and add any missing details if needed.",
    },
    {
      step: "04",
      title: "Track & Analyze",
      desc: "View spending insights, trends, and export reports anytime.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            How it <span className="text-gradient-accent">works</span>
          </h2>
          <p className="text-lg text-[#8A8F98] max-w-2xl mx-auto">
            From receipt to insights in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-6xl font-bold text-[#5E6AD2]/20 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-[#8A8F98]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Technology() {
  const techStack = [
    {
      name: "Azure Document Intelligence",
    },
    { name: "Azure Functions" },
    { name: "Azure SQL Database" },
    { name: "Azure Storage" },
    { name: "React.js" },
    { name: ".NET" },
  ];

  return (
    <section id="technology" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5E6AD2]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#818CF8] text-sm font-medium mb-6">
                  <Cloud className="w-4 h-4" />
                  Cloud Native Architecture
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Built on Azure with enterprise-grade reliability
                </h2>
                <p className="text-lg text-[#8A8F98] mb-8">
                  Event-driven architecture built with .NET, React, Azure
                  Functions, Azure SQL Database, Azure Storage, and Azure
                  Document Intelligence.
                </p>
                <Button className="btn-primary">
                  View on GitHub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {techStack.map((tech, i) => (
                <div key={i} className="glass p-4 rounded-xl">
                  <div className="font-medium text-white mb-1">{tech.name}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5E6AD2]/20 to-purple-500/20 opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5E6AD2]/30 rounded-full blur-[100px]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to take control of your expenses?
            </h2>
            <p className="text-lg text-[#8A8F98] mb-8 max-w-xl mx-auto">
              Simplify your expense tracking with AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="btn-primary h-14 px-8 text-base w-full sm:w-auto"
              >
                <ScanLine className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#8A8F98]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No credit card required
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050506]">
      <AnimatedBackground />
      <Header isLandingPage={true} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Technology />
        <CTASection />
      </main>
      <Footer isLandingPage={true} />
    </div>
  );
}
