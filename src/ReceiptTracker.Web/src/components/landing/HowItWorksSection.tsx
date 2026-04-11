import { motion } from "framer-motion";

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

export function HowItWorksSection() {
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
              <div className="text-6xl font-bold text-[#5E6AD2]/20 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[#8A8F98]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
