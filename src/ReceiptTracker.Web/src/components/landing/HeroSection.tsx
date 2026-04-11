import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
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
              onClick={() => navigate("/sign-up")}
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
