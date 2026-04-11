import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: FeatureCardProps) {
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
