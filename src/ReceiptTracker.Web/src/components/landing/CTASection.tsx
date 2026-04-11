import { motion } from "framer-motion";
import { ScanLine, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

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
                onClick={() => navigate("/sign-up")}
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
