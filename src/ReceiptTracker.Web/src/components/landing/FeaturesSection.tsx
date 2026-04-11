import { motion } from "framer-motion";
import { Brain, Zap, BarChart3, Cloud, Shield, Clock } from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";

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

export function FeaturesSection() {
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
