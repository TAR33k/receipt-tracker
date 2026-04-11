import { motion } from "framer-motion";
import { Cloud, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const techStack = [
  { name: "Azure Document Intelligence" },
  { name: "Azure Functions" },
  { name: "Azure SQL Database" },
  { name: "Azure Storage" },
  { name: "React.js" },
  { name: ".NET" },
];

export function TechnologySection() {
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
                <Button
                  className="btn-primary"
                  onClick={() =>
                    window.open(
                      "https://github.com/TAR33k/receipt-tracker",
                      "_blank",
                    )
                  }
                >
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
